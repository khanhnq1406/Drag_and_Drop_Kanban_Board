from fastapi import APIRouter, status
router = APIRouter()
from app.db.Database import Database
from pydantic import BaseModel

from typing import List

class Task(BaseModel):
    columnId: int
    taskId: int
    realIndex: int

class UpdateTasksRequest(BaseModel):
    tasks: List[Task]



@router.post("/updateTasks",  status_code=status.HTTP_201_CREATED)
def update(update_data: UpdateTasksRequest):
    print("Update Tasks")
    database = Database()
    for update in update_data.tasks:
        database.update_task(update.columnId, update.taskId, update.realIndex)
    return {}