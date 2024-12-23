export type ContentType = {
  summary: string;
  description: string;
  assignee: string;
};

export type TaskType = {
  id: number;
  index: number;
  content: ContentType;
};

export type ColumnType = {
  id: number;
  index: number;
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
  destination?: DraggableLocation;
  source?: DraggableLocation;
  draggableId?: number;
};

export type handleDragEnd = (result: DropResult) => void;
