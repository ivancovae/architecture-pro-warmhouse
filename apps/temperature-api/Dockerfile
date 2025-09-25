FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

COPY ./src/*.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish ./src/temperature-api.csproj -c release -o /app

# final stage image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app .

EXPOSE ${SERVER_PORT}

ENTRYPOINT [ "dotnet", "temperature-api.dll" ]