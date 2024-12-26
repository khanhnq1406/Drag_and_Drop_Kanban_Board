import { useRecoilState } from "recoil";
import { API_URL, ButtonType } from "../constants";
import Button from "./Button";
import { dataState } from "./DragDrop";
import { useState } from "react";

type InputProps = {
  index?: number;
  value?: string;
  id?: number;
  title?: string;
  setColumnSetting: React.Dispatch<
    React.SetStateAction<{
      state: boolean;
      column: number;
    }>
  >;
};
export const Input = ({
  index,
  value,
  id,
  title,
  setColumnSetting,
}: InputProps) => {
  const [data, setData] = useRecoilState(dataState);
  const [columnValue, setColumnValue] = useState(value);
  const changeColumnHandle = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log(columnValue);
    const updateData = {
      ...data,
      columns: data.columns.map((column) => ({
        ...column,
        tasks: [...column.tasks],
      })),
    };
    if (id !== undefined) {
      const newColumn = {
        id: id,
        title: columnValue,
        index: index,
      };
      fetch(`${API_URL}/updateStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newColumn),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Tasks created successfully:", data);
        })
        .catch((error) => {
          console.error("Error creating tasks:", error);
        });
      if (columnValue) {
        const newData = {
          ...updateData,
          columns: updateData.columns.map((column) =>
            column.id === id ? { ...column, title: columnValue } : column
          ),
        };
        setData(newData);
      }
    } else {
      if (columnValue) {
        const newColumn = {
          id: data.columns.length + 1,
          title: columnValue,
          index: data.columns.length,
          tasks: [],
        };
        updateData.columns.push(newColumn);
        fetch(`${API_URL}/createStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newColumn),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Tasks created successfully:", data);
          })
          .catch((error) => {
            console.error("Error creating tasks:", error);
          });
        setData(updateData);
      }
    }
    setColumnSetting({
      state: false,
      column: -1,
    });
    console.log(data);
  };
  return (
    <>
      <input
        className="border border-black rounded-md p-1"
        type="text"
        value={columnValue}
        onChange={(e) => setColumnValue(e.target.value)}
      />
      <Button
        type={ButtonType.Image}
        img="check.png"
        onClick={(e) => changeColumnHandle(e)}
      />
      <Button
        type={ButtonType.Image}
        img="close.png"
        onClick={(e) =>
          setColumnSetting({
            state: false,
            column: -1,
          })
        }
      />
    </>
  );
};
