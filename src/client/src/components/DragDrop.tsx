import React, { useEffect, useState } from "react";
import initialData from "../api/data";
import { atom, useRecoilState } from "recoil";
import { DraggableLocation, DropResult } from "../types/DragDrop.type";
import Button from "./Button";
import { ButtonType, WS_URL } from "../constants";
import { TaskBoardType } from "../types/DragDrop.type";
import {
  AddDragEffect,
  AddLastElementEffect,
  RemoveDragEffect,
  RemoveLastElementEffect,
} from "../styles/DragEffect";
import { reorder } from "../utils/reorder";
const dataState = atom({
  key: "dataState",
  default: initialData as TaskBoardType,
});

const dragDropState = atom({
  key: "dragDropState",
  default: {} as DropResult,
});

const DragDrop: React.FunctionComponent = () => {
  const [data, setData] = useRecoilState(dataState);
  const [dragState, setDragState] = useRecoilState(dragDropState);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (!message.from_sender) {
          const updatedData = message.data;
          if (JSON.stringify(updatedData) !== JSON.stringify(data)) {
            setData(updatedData);
          }
        }
      };
    }
  }, [socket, data]);

  useEffect(() => {
    if (socket) {
      socket.send(JSON.stringify(data));
    }
  }, [data]);

  const handleDragStart = (
    event: React.DragEvent,
    source: DraggableLocation,
    draggableId: number
  ) => {
    setDragState({
      source: source,
      draggableId: draggableId,
    });
  };

  const handleOnDrop = (
    event: React.DragEvent,
    destination: DraggableLocation
  ) => {
    if (destination.index === -1) {
      RemoveLastElementEffect(event);
    } else {
      RemoveDragEffect(event);
    }
    setDragState((prevDragState) => ({
      ...prevDragState,
      destination: destination,
    }));
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    if (index === -1) {
      AddLastElementEffect(event);
    } else {
      AddDragEffect(event);
    }
  };

  const handleDragLeave = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    if (index === -1) {
      RemoveLastElementEffect(event);
    } else {
      RemoveDragEffect(event);
    }
  };

  const handleDragEnd = (event: React.DragEvent) => {
    const { destination, source, draggableId } = dragState;
    console.log(
      "source:",
      source,
      "destination:",
      destination,
      "draggableId: ",
      draggableId
    );

    if (!source) {
      return;
    }

    // dropped nowhere
    if (!destination) {
      return;
    }

    // did not move anywhere
    if (
      source?.droppableId === destination?.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (source?.droppableId === destination?.droppableId) {
      // moving to same list
      const updatedTasks = reorder(
        data.columns[source.droppableId - 1].tasks,
        source.index,
        destination.index
      );

      const updatedColumns = data.columns.map((column, index) => {
        if (index === source.droppableId - 1) {
          return {
            ...column,
            tasks: updatedTasks,
          };
        }
        return column;
      });

      setData((prevData) => ({
        ...prevData,
        columns: updatedColumns,
      }));
    } else {
      // Moving between columns
      const sourceColumnIndex = source.droppableId - 1;
      const destinationColumnIndex = destination.droppableId - 1;

      const sourceColumn = data.columns[sourceColumnIndex];
      const destinationColumn = data.columns[destinationColumnIndex];

      const sourceUpdatedTasks = [...sourceColumn.tasks];
      const [removedTask] = sourceUpdatedTasks.splice(source.index, 1);

      const destinationUpdatedTasks = [...destinationColumn.tasks];
      destinationUpdatedTasks.splice(destination.index, 0, removedTask);

      const updatedColumns = data.columns.map((column, index) => {
        if (index === sourceColumnIndex) {
          return {
            ...column,
            tasks: sourceUpdatedTasks,
          };
        } else if (index === destinationColumnIndex) {
          return {
            ...column,
            tasks: destinationUpdatedTasks,
          };
        }
        return column;
      });

      setData((prevData) => ({
        ...prevData,
        columns: updatedColumns,
      }));
    }

    setDragState({
      source: undefined,
      destination: undefined,
      draggableId: undefined,
    });
  };

  return (
    <>
      <div className="flex gap-5 items-stretch ">
        {data.columns.map((column, index) => (
          <div
            key={index}
            className="h-full bg-column p-2 rounded-lg flex-1 min-w-[250px]"
          >
            <div className="text-sub font-semibold">{column.title}</div>
            {column.tasks.map((task, index) => (
              <div
                draggable="true"
                onDragStart={(e) =>
                  handleDragStart(
                    e,
                    {
                      droppableId: column.id,
                      index: column.tasks.indexOf(task),
                    },
                    task.id
                  )
                }
                onDragEnd={handleDragEnd}
                onDrop={(e) =>
                  handleOnDrop(e, {
                    droppableId: column.id,
                    index: index,
                  })
                }
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={(e) => handleDragLeave(e, index)}
                className="bg-surface rounded-md p-4 flex justify-between m-4 border-t-0 border-t-btnPrimary"
              >
                <div>
                  <p>{task.content.summary}</p>
                  <p className="text-sm">{task.content.assignee}</p>
                  <p>ID-{task.id}</p>
                  <p>{index}</p>
                </div>
                <div className="">
                  <Button type={ButtonType.Image} img="edit.png" />
                  <Button type={ButtonType.Image} img="delete.png" />
                </div>
              </div>
            ))}
            {/* Handle drop at the end of the column */}
            <div
              className="h-[20px] bg-[#e0e0e0] border-dashed border-[#aaa] border-[1px] m-4"
              onDrop={(e) =>
                handleOnDrop(e, {
                  droppableId: column.id,
                  index: -1,
                })
              }
              onDragOver={(e) => handleDragOver(e, -1)}
              onDragLeave={(e) => handleDragLeave(e, -1)}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DragDrop;
