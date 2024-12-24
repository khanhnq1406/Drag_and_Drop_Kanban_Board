from dataclasses import dataclass

@dataclass
class Tasks:
    id: int | None
    status_id: int
    task_index: int | None
    summary: str
    description: str
    assignee: str