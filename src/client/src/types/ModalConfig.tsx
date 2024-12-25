import { ModalType, OnClickType } from "../constants";

export type ModalConfig = {
  type: ModalType;
  status?: string;
  summary?: string;
  description?: string;
  assignee?: string;
  onClickEvent: (
    event: React.MouseEvent<HTMLButtonElement>,
    onClickType: OnClickType
  ) => void;
};
