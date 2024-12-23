from fastapi import FastAPI, WebSocket
from app.connection_manager import ConnectionManager
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
            message = {"data": data, "from_sender": False}
            await manager.broadcast(message, websocket)
    except:
        manager.disconnect(websocket)
