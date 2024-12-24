from fastapi import FastAPI, WebSocket
from app.routes.websocket.ConnectionManager import ConnectionManager
from app.db.Database import Database
from app.models.Status import Status
from app.models.Tasks import Tasks
class WebSocketHandler():
    def __init__(self, app: FastAPI):
        self.app = app
        self.manager = ConnectionManager()
        self.register_routes()
        self.database = Database()

    def register_routes(self):
        @self.app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            await self.manager.connect(websocket)
            try:
                while True:
                    data = await websocket.receive_json()
                    message = {"data": data, "from_sender": False}
                    await self.manager.broadcast(message, websocket)
            except:
                self.manager.disconnect(websocket)