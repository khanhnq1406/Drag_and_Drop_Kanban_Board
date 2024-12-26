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

    async def create(self, data):
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
    
    async def edit(self, data):
        try:
            print(data)
            index = self.database.edit_task(Tasks(
                id=data["id"],
                status_id=data["status"],
                task_index=data["taskIndex"],
                summary=data["summary"],
                description=data["description"],
                assignee=data["assignee"]
            ), has_change_status=data["hasChangeStatus"])
            print("service index:",index)
            response_data = {
                "id": data["id"],
                "status": data["status"],
                "index": index,
                "summary": data["summary"],
                "description": data["description"],
                "assignee": data["assignee"],
                "hasChangeStatus": data["hasChangeStatus"]
            }
            message = {"data": response_data, "type": SendType.Edit.value}
            await self.manager.broadcast_all(message)
        except Exception as e:
            print("Error editing task:", e)
        return
    
    async def delete(self, data):
        try:
            print(data)
            index = self.database.get_task_by_id(task_id=data["id"])
            if index:
                index = index["task_index"]
            self.database.delete_task(task_id=data["id"])
            response_data = {"id": data["id"], "index": index}
            message = {"data": response_data, "type": SendType.Delete.value}
            await self.manager.broadcast_all(message)
        except Exception as e:
            print("Error deleting task:", e)
        return
    
    async def get(self, data, websocket):
        return
