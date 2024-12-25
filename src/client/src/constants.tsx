export enum ButtonType {
  Primary,
  Danger,
  Image,
}

export const WS_URL = "ws://localhost:5000/ws";
export const API_URL = "http://localhost:5000/api";
export enum ModalType {
  Create,
  Edit,
}

export enum OnClickType {
  Create,
  Edit,
  Close,
  Minimize,
}

export enum RecoilKey {
  DragDropState = "DragDropState",
  DataState = "DataState",
  InputState = "InputState",
  WebSocketState = "WebSocketState",
}

export enum SendType {
  Create = 0,
  Update = 1,
  Delete = 2,
  Edit = 3,
  Get = 4,
}
