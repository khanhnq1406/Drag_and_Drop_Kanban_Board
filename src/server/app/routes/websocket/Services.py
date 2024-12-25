from fastapi import WebSocket
from app.db.Database import Database

class Services():
    def __init__(self, manager):
        self.manager = manager
        self.database = Database()


    async def update(self, data, websocket):
        message = {"data": data, "from_sender": False}
        await self.manager.broadcast(message, websocket)

    async def create(self, data, websocket):
        return
    
    async def edit(self, data, websocket):
        return
    
    async def delete(self, data, websocket):
        return
    
    async def get(self, data, websocket):
        get_data = self.database.get()
        await self.manager.send_json(get_data)
        return
