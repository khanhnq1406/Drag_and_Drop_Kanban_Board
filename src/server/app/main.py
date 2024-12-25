from fastapi import FastAPI
from app.routes.websocket.WebSocketHandler import WebSocketHandler
from app.routes.api.routes import routers
from starlette.middleware.cors import CORSMiddleware
class AppCreator:
    def __init__(self):
        self.app = FastAPI()
        self.app.add_middleware(
                CORSMiddleware,
                allow_origins=["*"],
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"],
            )

app_creator = AppCreator()
app = app_creator.app
websocket_hanlder = WebSocketHandler(app)
app.include_router(routers, prefix="/api")