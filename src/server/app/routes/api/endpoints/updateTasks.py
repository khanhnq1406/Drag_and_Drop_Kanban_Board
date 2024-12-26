from fastapi import APIRouter, status
router = APIRouter()
from app.db.Database import Database
from app.models.Tasks import UpdateTasksRequest



@router.post("/updateTasks",  status_code=status.HTTP_201_CREATED)
def update(update_data: UpdateTasksRequest):
    print("Update Tasks")
    database = Database()
    for update in update_data.tasks:
        database.update_task(update.columnId, update.taskId, update.realIndex)
    return {"updated": update_data}