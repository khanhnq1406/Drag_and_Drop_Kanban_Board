from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def send_personal_message(self, message, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message, sender: WebSocket):
        for connection in self.active_connections:
            if connection != sender:
                await connection.send_json(message)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)