import React, { useEffect, useState } from "react";
import initialData from "../api/data";
import { atom, useRecoilState } from "recoil";
import { handleDragEnd } from "../types/DragDrop.type";

const dragDropState = atom({
  key: "dragDropState",
  default: {},
});

const DragDrop: React.FunctionComponent = () => {
  const [state, setState] = useRecoilState(dragDropState);

  useEffect(() => {
    setState(initialData);
  }, []);

  const onDragEnd: handleDragEnd = (result) => {
    console.log(result);
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  };

  return <div draggable="true">Drag me</div>;
};

export default DragDrop;
