import React, { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { DraggableLocation, DropResult } from "../types/DragDrop.type";
import Button from "./Button";
import {
  API_URL,
  ButtonType,
  ModalType,
  OnClickType,
  RecoilKey,
  SendType,
  WS_URL,
} from "../constants";
import { TaskBoardType } from "../types/DragDrop.type";
import {
  AddDragEffect,
  AddLastElementEffect,
  RemoveDragEffect,
  RemoveLastElementEffect,
} from "../styles/DragEffect";
import { reorder } from "../utils/reorder";
import { Initial } from "../api/initial";
import { inputState, Modal } from "./Modal";
import { ModalConfig } from "../types/ModalConfig";
import { ConfirmationBox } from "./ConfirmationBox";
import { findTaskToUpdate } from "../utils/findTasksToUpdate";
import { Input } from "./Input";

export const dataState = atom({
  key: RecoilKey.DataState,
  default: {} as TaskBoardType,
});

const dragDropState = atom({
  key: RecoilKey.DragDropState,
  default: {} as DropResult,
});
export const websocketState = atom<WebSocket>({
  key: RecoilKey.WebSocketState,
  default: new WebSocket(WS_URL),
});
const DragDrop: React.FunctionComponent = () => {
  const [data, setData] = useRecoilState(dataState);
  const [dragState, setDragState] = useRecoilState(dragDropState);
  const [socket] = useRecoilState(websocketState);
  const [modal, setModal] = useState(<></>);
  const [confirm, setConfirm] = useState(<></>);
  const [input, setInput] = useRecoilState(inputState);
  const [columnSetting, setColumnSetting] = useState({
    state: false,
    column: -1,
  });
  useEffect(() => {
    Initial().then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        if (!message.from_sender) {
          const updatedData = message.data;
          if (message.type === SendType.Update) {
            if (JSON.stringify(updatedData) !== JSON.stringify(data)) {
              setData(updatedData);
            }
          }
          if (Number(message.type) === Number(SendType.Create)) {
            var index = data.columns
              .map(function (o) {
                return o.id;
              })
              .indexOf(Number(updatedData.status));

            const updateData = { ...data };
            updateData.columns = updateData.columns.map((column) => {
              if (Number(column.index) === Number(index)) {
                return {
                  ...column,
                  tasks: [
                    ...column.tasks,
                    {
                      id: updatedData.id,
                      index: updatedData.index,
                      content: {
                        assignee: updatedData.assignee,
                        description: updatedData.description,
                        summary: updatedData.summary,
                      },
                    },
                  ],
                };
              }
              return column;
            });
            setData(updateData);
          }
          if (Number(message.type) === Number(SendType.Edit)) {
            const updateData = {
              ...data,
              columns: data.columns.map((column) => ({
                ...column,
                tasks: [...column.tasks],
              })),
            };
            if (updatedData.hasChangeStatus) {
              // Find the old column containing the task
              const oldColumnIndex = updateData.columns.findIndex((column) =>
                column.tasks.some((task) => task.id === updatedData.id)
              );

              if (oldColumnIndex !== -1) {
                // Remove the task from the old column
                updateData.columns[oldColumnIndex].tasks = updateData.columns[
                  oldColumnIndex
                ].tasks.filter((task) => task.id !== updatedData.id);
              }

              // Find the index of the new column
              const newColumnIndex = updateData.columns.findIndex(
                (column) => Number(column.id) === Number(updatedData.status)
              );

              if (newColumnIndex !== -1) {
                // Add the updated task to the new column
                updateData.columns[newColumnIndex].tasks.push({
                  id: updatedData.id,
                  index: updatedData.index,
                  content: {
                    assignee: updatedData.assignee,
                    description: updatedData.description,
                    summary: updatedData.summary,
                  },
                });
              }
            } else {
              const index = data.columns
                .map(function (o) {
                  return o.id;
                })
                .indexOf(Number(updatedData.status));

              updateData.columns = updateData.columns.map((column) => {
                if (Number(column.index) === Number(index)) {
                  return {
                    ...column,
                    tasks: column.tasks.map((task) => {
                      if (task.id === updatedData.id) {
                        return {
                          ...task,
                          content: {
                            assignee: updatedData.assignee,
                            description: updatedData.description,
                            summary: updatedData.summary,
                          },
                        };
                      }
                      return task;
                    }),
                  };
                }
                return column;
              });
            }
            setData(updateData);
          }
          if (Number(message.type) === Number(SendType.Delete)) {
            const updateData = {
              ...data,
              columns: data.columns.map((column) => ({
                ...column,
                tasks: [...column.tasks],
              })),
            };
            const taskWithColumnIndex = updateData.columns
              .map((column, columnIndex) => ({
                columnIndex,
                task: column.tasks.find((task) => task.id === updatedData.id),
              }))
              .find((result) => result.task !== undefined);
            console.log(taskWithColumnIndex);
            if (taskWithColumnIndex && taskWithColumnIndex.task) {
              console.log(taskWithColumnIndex);
              updateData.columns[taskWithColumnIndex.columnIndex].tasks.splice(
                taskWithColumnIndex.task.index,
                1
              );
              console.log(updateData);
              findTaskToUpdate(updateData);
              setData(updateData);
              setConfirm(<></>);
            }
          }
        }
      };
    }
  }, [socket, data]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: SendType.Update, data: data }));
      if (data.columns) {
        const updateData = {
          ...data,
          columns: data.columns.map((column) => ({
            ...column,
            tasks: [...column.tasks],
          })),
        };
        findTaskToUpdate(updateData);
      }
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
  const handleConfirmation = (
    event: React.MouseEvent<HTMLButtonElement>,
    onClickType: OnClickType,
    id: number
  ) => {
    event.preventDefault();
    switch (onClickType) {
      case OnClickType.Delete:
        console.log(id);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({ type: SendType.Delete, data: { id: id } })
          );
        }
        break;
      case OnClickType.Close:
        setConfirm(<></>);
        break;

      default:
        break;
    }
  };
  const handleModalClick = (
    event: React.MouseEvent,
    type: OnClickType,
    id: number
  ) => {
    event.preventDefault();
    switch (type) {
      case OnClickType.Close:
        setModal(<></>);
        setInput({} as ModalConfig);
        break;

      case OnClickType.Edit:
        setInput((prevInput) => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({ type: SendType.Edit, data: prevInput })
            );
          }
          return prevInput;
        });
        break;

      case OnClickType.Delete:
        setConfirm(
          <ConfirmationBox
            title={`Delete ID-${id}`}
            message="You're about to permanently delete this work item, its comments and
          attachments, and all of its data."
            submessage="If you're not sure, you can resolve or close this work item instead."
            onConfirm={(event, type) => handleConfirmation(event, type, id)}
          />
        );
        break;

      default:
        break;
    }
  };

  const handleRemoveStatus = (
    event: React.MouseEvent<HTMLButtonElement>,
    onClickType: OnClickType,
    id: number
  ) => {
    event.preventDefault();
    switch (onClickType) {
      case OnClickType.Delete:
        fetch(`${API_URL}/deleteStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Tasks created successfully:", data);
          })
          .catch((error) => {
            console.error("Error creating tasks:", error);
          });
        const updateData = {
          ...data,
          columns: data.columns.map((column) => ({
            ...column,
            tasks: [...column.tasks],
          })),
        };
        const newData = {
          ...updateData,
          columns: updateData.columns.filter((column) => column.id !== id),
        };
        setData(newData);
        setConfirm(<></>);
        break;
      case OnClickType.Close:
        setConfirm(<></>);
        break;

      default:
        break;
    }
  };
  return (
    <>
      <div className="flex gap-5 items-stretch">
        {confirm}
        {modal}
        {data.columns !== undefined ? (
          data.columns.map((column, index) => (
            <div
              key={index}
              className="h-full bg-column p-2 rounded-lg flex-1 min-w-[250px] max-w-[400px]"
            >
              <div className="flex justify-between">
                {!columnSetting.state ||
                columnSetting.column != column.index ? (
                  <>
                    <div className="text-sub font-semibold">{column.title}</div>
                    <div>
                      <Button
                        type={ButtonType.Image}
                        img="edit.png"
                        onClick={(e) =>
                          setColumnSetting({
                            state: true,
                            column: column.index,
                          })
                        }
                      />
                      <Button
                        type={ButtonType.Image}
                        img="delete.png"
                        onClick={(e) =>
                          setConfirm(
                            <ConfirmationBox
                              title={`Delete column ${column.title}`}
                              message="You're about to permanently delete this column, tasks in it, and all of its data."
                              submessage="If you're not sure, you can resolve or close this work item instead."
                              onConfirm={(event, type) =>
                                handleRemoveStatus(event, type, column.id)
                              }
                            />
                          )
                        }
                      />
                    </div>
                  </>
                ) : (
                  <Input
                    index={column.index}
                    value={column.title}
                    id={column.id}
                    title={column.title}
                    setColumnSetting={setColumnSetting}
                  />
                )}
              </div>
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
                  </div>
                  <div className="">
                    <Button
                      type={ButtonType.Image}
                      img="edit.png"
                      onClick={(e) => {
                        setModal(
                          <Modal
                            type={ModalType.Edit}
                            onClickEvent={(event, type) => {
                              handleModalClick(event, type, task.id);
                            }}
                            status={String(column.id)}
                            summary={task.content.summary}
                            description={task.content.description}
                            assignee={task.content.assignee}
                            id={task.id}
                            taskIndex={task.index}
                          />
                        );
                      }}
                    />
                    <Button
                      type={ButtonType.Image}
                      img="delete.png"
                      onClick={(e) => {
                        setConfirm(
                          <ConfirmationBox
                            title={`Delete ID-${task.id}`}
                            message="You're about to permanently delete this work item, its comments and
                            attachments, and all of its data."
                            submessage="If you're not sure, you can resolve or close this work item instead."
                            onConfirm={(event, type) =>
                              handleConfirmation(event, type, task.id)
                            }
                          />
                        );
                      }}
                    />
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
          ))
        ) : (
          <div>Loading</div>
        )}

        {columnSetting.state && columnSetting.column === -1 ? (
          <div className="min-w-[250px]">
            <Input setColumnSetting={setColumnSetting} />
          </div>
        ) : (
          <div>
            <Button
              type={ButtonType.Image}
              img="plus.png"
              onClick={(e) => setColumnSetting({ state: true, column: -1 })}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DragDrop;
