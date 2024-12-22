import { ButtonType } from "../constants";
import { FunctionComponent } from "react";
type config = {
  type: ButtonType;
  content: string;
  img?: string;
};

const Button: FunctionComponent<config> = ({ type, content, img }: config) => {
  switch (type) {
    case ButtonType.Primary:
      return (
        <button className="flex bg-btnPrimary hover:bg-btnPrimary80 text-surface py-1 px-2 rounded-md gap-1 items-center">
          <div className={img !== undefined ? "block" : "hidden"}>
            <img className="w-img" src={img} alt="" />
          </div>
          <p>{content}</p>
        </button>
      );
    case ButtonType.Danger:
      return <button>{content}</button>;
    default:
      return <></>;
  }
};

export default Button;
