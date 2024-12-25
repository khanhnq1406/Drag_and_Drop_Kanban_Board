from fastapi import APIRouter
from app.routes.api.endpoints.initial import router
routers = APIRouter()
router_list = [router]

for router in router_list:
    routers.include_router(router)