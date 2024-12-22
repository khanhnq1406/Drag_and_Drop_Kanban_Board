import React from "react";
import Button from "./Button";
import { ButtonType } from "../constants";
const Navbar: React.FunctionComponent = () => (
  <div>
    <div className="flex justify-between items-center">
      <p>Kanban Board</p>
      <Button type={ButtonType.Primary} content="Create" img="plusWhite.png" />
    </div>
    <hr className="w-full h-1 bg-column border-none rounded my-3" />
  </div>
);

export default Navbar;
