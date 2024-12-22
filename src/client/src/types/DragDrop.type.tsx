export type TaskType = {
  id: string;
  content: string;
};

export type ColumnType = {
  id: string;
  title: string;
  tasks: TaskType[];
};

export type TaskBoardType = {
  columns: ColumnType[];
};

export interface DraggableLocation {
  droppableId: number;
  index: number;
}

export type DropResult = {
  destination: DraggableLocation;
  source: DraggableLocation;
  draggableId: number;
};

export type handleDragEnd = (result: DropResult) => void;
