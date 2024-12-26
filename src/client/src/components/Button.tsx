import { ButtonType } from "../constants";
import { FunctionComponent } from "react";
type config = {
  type: ButtonType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  content?: string;
  img?: string;
};

const Button: FunctionComponent<config> = ({
  type,
  content,
  img,
  onClick,
}: config) => {
  switch (type) {
    case ButtonType.Primary:
      return (
        <button
          className="flex bg-btnPrimary hover:bg-btnPrimary80 text-surface py-1 px-2 rounded-md gap-1 items-center hover:shadow-lg"
          onClick={onClick}
        >
          <div className={img !== undefined ? "block" : "hidden"}>
            <img className="w-img" src={img} alt="" />
          </div>
          <p>{content}</p>
        </button>
      );
    case ButtonType.Danger:
      return (
        <button
          className="text-warning border-2 border-warning rounded-md py-1 px-2 hover:shadow-lg"
          onClick={onClick}
        >
          {content}
        </button>
      );
    case ButtonType.Image:
      return (
        <button
          className="hover:bg-btn-hover hover:rounded-md p-1 hover:shadow-lg"
          onClick={onClick}
        >
          <img className="w-img-lg" src={img} alt="" />
        </button>
      );
    default:
      return <></>;
  }
};

export default Button;
