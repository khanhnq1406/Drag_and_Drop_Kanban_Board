from dataclasses import dataclass
from pydantic import BaseModel
from typing import List

@dataclass
class Tasks:
    id: int | None
    status_id: int
    task_index: int | None
    summary: str
    description: str
    assignee: str

class Task(BaseModel):
    columnId: int
    taskId: int
    realIndex: int

class UpdateTasksRequest(BaseModel):
    tasks: List[Task]


class ColumnRequestBase(BaseModel):
    id: int

class ColumnRequest(ColumnRequestBase):
    id: int
    title: str
    index: int