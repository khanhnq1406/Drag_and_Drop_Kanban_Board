from fastapi import APIRouter
from app.routes.api.endpoints.initial import router as initial_router
from app.routes.api.endpoints.updateTasks import router as update_router
from app.routes.api.endpoints.status import router as status_router

routers = APIRouter()
router_list = [initial_router, update_router, status_router]

for router in router_list:
    routers.include_router(router)