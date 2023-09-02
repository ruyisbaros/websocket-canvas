import React from "react";
import rectIcon from "../assets/icons/rectangle.svg";
import { toolTypes } from "../constants/toolType";
import IconButton from "./IconButton";

const Menu = () => {
  return (
    <div className="menu_container">
      <IconButton src={rectIcon} type={toolTypes.RECTANGLE} />
    </div>
  );
};

export default Menu;
