from fastapi import FastAPI, WebSocket
from app.routes.websocket.ConnectionManager import ConnectionManager
from app.models.Status import Status
from app.models.Tasks import Tasks
from app.models.SendType import SendType
from app.routes.websocket.Services import Services
class WebSocketHandler():
    def __init__(self, app: FastAPI):
        self.app = app
        self.manager = ConnectionManager()
        self.register_routes()
        self.service = Services(self.manager)

    def register_routes(self):
        @self.app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            await self.manager.connect(websocket)
            try:
                while True:
                    received = await websocket.receive_json()
                    type_received = received['type']
                    data = received['data']
                    
                    if int(type_received) == int(SendType.Update.value):
                        await self.service.update(data, websocket)

                    if int(type_received) == int(SendType.Create.value):
                        await self.service.create(data)

                    if int(type_received) == int(SendType.Edit.value):
                        await self.service.edit(data)

                    if int(type_received) == int(SendType.Delete.value):
                        await self.service.delete(data, websocket)
                    
                    if int(type_received) == int(SendType.Get.value):
                        await self.service.get(data, websocket)

            except:
                self.manager.disconnect(websocket)