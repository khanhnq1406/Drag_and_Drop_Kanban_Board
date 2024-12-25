import React, { useEffect } from "react";
import { ButtonType, OnClickType, RecoilKey } from "../constants";
import Button from "./Button";
import { atom, useRecoilState } from "recoil";
import { ModalConfig } from "../types/ModalConfig";

export const inputState = atom({
  key: RecoilKey.InputState,
  default: {} as ModalConfig,
});

export const Modal = ({
  type,
  status,
  summary,
  descripton,
  assignee,
  onClickEvent,
}: ModalConfig) => {
  const [input, setInput] = useRecoilState(inputState);
  useEffect(() => {
    setInput((prevInput) => ({
      ...prevInput,
      type: type,
      status: status || prevInput.status || "To Do",
      summary: summary || prevInput.summary || "",
      descripton: descripton || prevInput.descripton || "",
      assignee: assignee || prevInput.assignee || "",
      onClickEvent,
    }));
  }, []);

  return (
    <div className="flex fixed top-0 left-0 bg-black-layer w-full h-full justify-center content-center flex-wrap">
      <div className="bg-surface h-fit rounded-lg p-5 w-2/3">
        <div className="flex justify-between">
          <div className="font-bold">Create work item</div>
          <div>
            <Button
              type={ButtonType.Image}
              img="minimize.png"
              onClick={(e) => onClickEvent(e, OnClickType.Minimize)}
            />
            <Button
              type={ButtonType.Image}
              img="close.png"
              onClick={(e) => onClickEvent(e, OnClickType.Close)}
            />
          </div>
        </div>
        <hr className="w-full h-1 bg-column border-none rounded my-3" />
        <form className="flex flex-wrap gap-2">
          <label className="w-full text-sub font-semibold">Status</label>
          <select
            value={input.status || ""}
            onChange={(e) =>
              setInput((prevInput) => ({
                ...prevInput,
                status: e.target.value,
              }))
            }
            className="bg-column rounded p-1"
            name="status"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <div className="text-xs w-full">
            This is the initial status once created.
          </div>

          <label className="w-full text-sub font-semibold">Summary</label>
          <input
            onChange={(e) =>
              setInput((prevInput) => ({
                ...prevInput,
                summary: e.target.value,
              }))
            }
            name="summary"
            type="text"
            value={input.summary || ""}
            className="border border-black rounded-md p-2 w-full"
          ></input>

          <label className="w-full text-sub font-semibold">Description</label>
          <textarea
            onChange={(e) =>
              setInput((prevInput) => ({
                ...prevInput,
                descripton: e.target.value,
              }))
            }
            name="descripton"
            value={input.descripton || ""}
            className="border border-black rounded-md p-2 w-full"
          ></textarea>

          <label className="w-full text-sub font-semibold">Assignee</label>
          <input
            onChange={(e) =>
              setInput((prevInput) => ({
                ...prevInput,
                assignee: e.target.value,
              }))
            }
            name="assignee"
            type="text"
            value={input.assignee || ""}
            className="border border-black rounded-md p-2 w-full"
          ></input>
          <Button
            type={ButtonType.Primary}
            content="Create"
            onClick={(e) => onClickEvent(e, OnClickType.Create)}
          />
        </form>
      </div>
    </div>
  );
};
