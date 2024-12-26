from fastapi import APIRouter, status
router = APIRouter()
from app.db.Database import Database
from app.models.Tasks import ColumnRequest, ColumnRequestBase
from app.models.Status import Status

@router.post("/updateStatus", status_code=status.HTTP_201_CREATED)
def update_status(update_data: ColumnRequest):
    database = Database()
    database.update_status(update_data.id, update_data.title,  update_data.index)
    return {"updated": update_data}

@router.post("/createStatus",  status_code=status.HTTP_201_CREATED)
def create_status(data: ColumnRequest):
    database = Database()
    database.create_status(Status(data.id,  data.index, data.title))
    return {"created": data}

@router.post("/deleteStatus", status_code=status.HTTP_201_CREATED)
def delete_status(data: ColumnRequestBase):
    database = Database()
    database.delete_status(data.id)
    return {"deleted": data}