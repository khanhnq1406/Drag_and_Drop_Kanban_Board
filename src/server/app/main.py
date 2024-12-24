from fastapi import FastAPI
from app.routes.websocket.WebSocketHandler import WebSocketHandler
class AppCreator:
    def __init__(self):
        self.app = FastAPI()

app_creator = AppCreator()
app = app_creator.app
websocket_hanlder = WebSocketHandler(app)