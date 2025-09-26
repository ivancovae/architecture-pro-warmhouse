from fastapi import FastAPI
from fastapi.responses import HTMLResponse

import os
smarthomeApi = os.getenv("SMARTHOME_APP_API_URL")
 
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
    
    #
    # sensorRes = requests.get(SMARTHOME_APP_API_URL+"/api/v1/sensors/"+id)
    # print(sensorRes)

    # content = sensorRes.content
    # sensorStatus = requests.put(SMARTHOME_APP_API_URL+"/api/v1/sensors/"+id, data=content)

    return HTMLResponse(content="Command sended")