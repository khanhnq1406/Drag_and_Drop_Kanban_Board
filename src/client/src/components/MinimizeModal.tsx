import { Modal } from "./Modal";
import { ModalType, OnClickType } from "../constants";

type setModalType = {
  setModal: React.Dispatch<React.SetStateAction<JSX.Element>>;
  handleCreateEvent: (event: React.MouseEvent, type: OnClickType) => void;
  summary: string;
};

export const MinimizeModal = ({
  setModal,
  handleCreateEvent,
  summary,
}: setModalType) => {
  return (
    <div
      className=""
      onClick={(event) => {
        setModal(
          <Modal
            type={ModalType.Create}
            onClickEvent={(event, type) => handleCreateEvent(event, type)}
          />
        );
      }}
    >
      <div className="bg-surface h-fit rounded-lg px-10 py-3 flex fixed bottom-0 right-0 justify-center content-center flex-wrap hover:bg-column drop-shadow-xl  m-5 border-2 border-column">
        {summary !== "" ? summary : "New task"}
      </div>
    </div>
  );
};
