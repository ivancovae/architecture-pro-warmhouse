using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Linq;
using System;
using System.Reflection.PortableExecutable;

namespace temperature_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            var routeBuilder = new RouteBuilder(app);
 
            routeBuilder.MapRoute("temperature",
                async context => {
                    context.Response.ContentType = "text/html; charset=utf-8";
                    await context.Response.WriteAsync("Service get temperature");
                });
         
 
            routeBuilder.MapRoute("temperature/{id}",
                async context => {
                    context.Response.ContentType = "text/html; charset=utf-8";
                    var location = context.Request.Query["location"].ToString();
                    var temperature = new Random().Next(-30, 55);

                    var jResult = new JObject() {
                        { "value", temperature }
                    };

                    await context.Response.WriteAsync($"{jResult.ToString()}");
                });
 
            app.UseRouter(routeBuilder.Build());
        }
    }
}
