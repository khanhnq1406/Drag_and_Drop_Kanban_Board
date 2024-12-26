import { ButtonType, OnClickType } from "../constants";
import Button from "./Button";

type ConfirmationProps = {
  title: string;
  message: string;
  submessage?: string;
  onConfirm: (
    event: React.MouseEvent<HTMLButtonElement>,
    onClickType: OnClickType
  ) => void;
};
export const ConfirmationBox = ({
  title,
  message,
  submessage,
  onConfirm,
}: ConfirmationProps) => {
  return (
    <div className="flex fixed top-0 left-0 bg-black-layer w-full h-full justify-center content-center flex-wrap z-10">
      <div className="bg-surface h-fit rounded-lg p-5 w-2/3">
        <div className="font-bold text-2xl">{title}</div>
        <div className="my-4">
          {message}
          <br />
          {submessage}
        </div>
        <div className="flex gap-2">
          <Button
            type={ButtonType.Primary}
            content="Cancel"
            onClick={(e) => onConfirm(e, OnClickType.Close)}
          />
          <Button
            type={ButtonType.Danger}
            content="Delete"
            onClick={(e) => onConfirm(e, OnClickType.Delete)}
          />
        </div>
      </div>
    </div>
  );
};
