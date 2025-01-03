import React, { useEffect, useState } from "react";
import Button from "./Button";
import { ButtonType, ModalType, OnClickType, SendType } from "../constants";
import { useRecoilState } from "recoil";
import { inputState, Modal } from "./Modal";
import { ModalConfig } from "../types/ModalConfig";
import { MinimizeModal } from "./MinimizeModal";
import { websocketState } from "./DragDrop";

const Navbar: React.FunctionComponent = () => {
  const [input, setInput] = useRecoilState(inputState);
  const [socket] = useRecoilState(websocketState);
  const [modal, setModal] = useState(<></>);

  const handleCreateEvent = (event: React.MouseEvent, type: OnClickType) => {
    event.preventDefault();
    switch (type) {
      case OnClickType.Create:
        setInput((prevInput) => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({ type: SendType.Create, data: prevInput })
            );
          }
          return prevInput;
        });
        break;

      case OnClickType.Close:
        setInput({} as ModalConfig);
        setModal(<></>);
        break;

      case OnClickType.Minimize:
        console.log(input);
        setInput((prevInput) => {
          setModal(
            <MinimizeModal
              setModal={setModal}
              handleCreateEvent={handleCreateEvent}
              summary={
                prevInput.summary !== undefined ? prevInput.summary : "New task"
              }
            />
          );
          return prevInput;
        });

        break;

      default:
        break;
    }
  };
  return (
    <div>
      {modal}
      <div className="flex justify-between items-center">
        <p>Kanban Board</p>
        <Button
          type={ButtonType.Primary}
          content="Create"
          img="plusWhite.png"
          onClick={(event) => {
            setModal(
              <Modal
                type={ModalType.Create}
                onClickEvent={(event, type) => handleCreateEvent(event, type)}
              />
            );
          }}
        />
      </div>
      <hr className="w-full h-1 bg-column border-none rounded my-3" />
    </div>
  );
};

export default Navbar;
