from fastapi import FastAPI, WebSocket
from app.connection_manager import ConnectionManager
import json
class AppCreator:
    def __init__(self):
        self.app = FastAPI()

app_creator = AppCreator()
app = app_creator.app
manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket:WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast(data, websocket)
    except:
        manager.disconnect(websocket)
