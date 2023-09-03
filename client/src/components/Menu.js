import React from "react";
import rectIcon from "../assets/icons/rectangle.svg";
import lineIcon from "../assets/icons/line.svg";
import rubberIcon from "../assets/icons/rubber.svg";
import { toolTypes } from "../constants/toolType";
import IconButton from "./IconButton";

const Menu = () => {
  return (
    <div className="menu_container">
      <IconButton src={rectIcon} type={toolTypes.RECTANGLE} />
      <IconButton src={lineIcon} type={toolTypes.LINE} />
      <IconButton src={rubberIcon} type={toolTypes.RUBBER} isRubber={true} />
    </div>
  );
};

export default Menu;
