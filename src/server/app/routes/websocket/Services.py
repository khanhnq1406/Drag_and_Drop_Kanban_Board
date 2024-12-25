from fastapi import WebSocket
from app.db.Database import Database
from app.models.Tasks import Tasks
from app.models.SendType import SendType
class Services():
    def __init__(self, manager):
        self.manager = manager
        self.database = Database()

    async def update(self, data, websocket):
        message = {"data": data, "from_sender": False, "type": SendType.Update.value}
        await self.manager.broadcast(message, websocket)

    async def create(self, data, websocket):
        try:
            task_id = self.database.create_task(
                Tasks(
                    id=None,
                    status_id=data["status"],
                    task_index=None,
                    summary=data["summary"],
                    description=data["description"],
                    assignee=data["assignee"]
                    )
                )
            print(task_id)
            if (task_id is not None):
                print("Debug")
                data['id'] = task_id["id"]
                data['index'] = task_id["index"]
            print((data))
            message = {"data": data, "type": SendType.Create.value}
            await self.manager.broadcast_all(message)
        except Exception as e:
            print("Error creating new task:", e)
        return
    
    async def edit(self, data, websocket):
        return
    
    async def delete(self, data, websocket):
        return
    
    async def get(self, data, websocket):
        return
