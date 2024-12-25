from enum import Enum

class SendType(Enum):
    Create = 0
    Update = 1
    Delete = 2
    Edit = 3
    Get = 4