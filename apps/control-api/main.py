import requests
import json
import os
from typing import Optional, Dict, Any

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

smarthomeApi = os.getenv("SMARTHOME_APP_API_URL")
temperatureApi = os.getenv("TEMPERATURE_API_URL")

app = FastAPI()
    
@app.get("/api/")
def get_about():
    html_content = "Control Devices Service"
    print(f"{smarthomeApi}")
    return HTMLResponse(content=html_content)

@app.get("/api/sensors/{id}/command/{command}")
def get_command(id, command):
    print("id="+id)
    print("command="+command)

    url = f"{smarthomeApi}/api/v1/sensors/{id}"
    print("url="+url)
    error = ""
    try:
        print("request before")
        response = requests.get(url, verify=False)
        print("request after")
        response.raise_for_status()
        print(response)
        data = response.json() if response.content else {}
        
    except requests.exceptions.RequestException as e:
        error = str(e)
    if (error != ""):
        print(error)
    response.close()

    status = "inactive"
    json_data =  json.loads("{}")

    for key, value in data.items():
            if key == "status":
                if value == "inactive":
                    status = "active"

    json_data["status"] = status
    print(status)
    json_data["value"] = 0
    
    url = f"{smarthomeApi}/api/v1/sensors/{id}/value?status={status}"
    print(f"url={url}")
    try:
        print("before url")
        responsePatch = requests.patch(url, data={"value": 0.0, "status": status}, verify=False)
        print("after url")
        print(responsePatch)

    except requests.exceptions.RequestException as e:
        error = str(e)
        if (error != ""):
            print(error)
    responsePatch.close()
    return HTMLResponse(content="Command sended")