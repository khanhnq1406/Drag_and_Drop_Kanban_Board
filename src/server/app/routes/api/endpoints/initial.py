from fastapi import APIRouter
router = APIRouter()
from app.db.Database import Database


@router.get("/initial")
def initial_data():
    database = Database()
    data = database.get()
    return {"data": data}