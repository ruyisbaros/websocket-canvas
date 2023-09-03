import React from "react";
import rectIcon from "../assets/icons/rectangle.svg";
import lineIcon from "../assets/icons/line.svg";
import rubberIcon from "../assets/icons/rubber.svg";
import pencilIcon from "../assets/icons/pencil.svg";
import textIcon from "../assets/icons/txt-file-symbol.svg";
import { toolTypes } from "../constants/toolType";
import IconButton from "./IconButton";

const Menu = () => {
  return (
    <div className="menu_container">
      <IconButton src={rectIcon} type={toolTypes.RECTANGLE} />
      <IconButton src={lineIcon} type={toolTypes.LINE} />
      <IconButton src={pencilIcon} type={toolTypes.PENCIL} />
      <IconButton src={textIcon} type={toolTypes.TEXT} />
      <IconButton src={rubberIcon} type={toolTypes.RUBBER} isRubber={true} />
    </div>
  );
};

export default Menu;
