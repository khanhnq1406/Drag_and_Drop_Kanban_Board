from dataclasses import dataclass

@dataclass
class Status:
    id: int | None
    status_index: int | None
    title: str
