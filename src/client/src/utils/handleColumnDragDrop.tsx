import {
  AddDragColumnEffect,
  AddLastColumnEffect,
  RemoveDragColumnEffect,
  RemoveLastColumnEffect,
} from "../styles/ColumnDragEffect";

export const handleColumnDragOver = (event: React.DragEvent, index: number) => {
  event.preventDefault();
  if (index === -1) {
    AddLastColumnEffect(event);
  } else {
    AddDragColumnEffect(event);
  }
};

export const handleColumnDragLeave = (
  event: React.DragEvent,
  index: number
) => {
  event.preventDefault();
  if (index === -1) {
    RemoveLastColumnEffect(event);
  } else {
    RemoveDragColumnEffect(event);
  }
};
