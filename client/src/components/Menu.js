import React from "react";
import rectIcon from "../assets/icons/rectangle.svg";
import rectIcon2 from "../assets/icons/rectangle-w.svg";
import lineIcon from "../assets/icons/line.svg";
import lineIcon2 from "../assets/icons/line-w.svg";
import rubberIcon from "../assets/icons/rubber.svg";
import rubberIcon2 from "../assets/icons/rubber-w.svg";
import pencilIcon from "../assets/icons/pencil.svg";
import pencilIcon2 from "../assets/icons/pencil-w.svg";
import textIcon from "../assets/icons/txt-file-symbol.svg";
import textIcon2 from "../assets/icons/txt-file-symbol-w.svg";
import { toolTypes } from "../constants/toolType";
import IconButton from "./IconButton";

const Menu = () => {
  return (
    <div className="menu_container">
      <IconButton src={rectIcon} src2={rectIcon2} type={toolTypes.RECTANGLE} />
      <IconButton src={lineIcon} src2={lineIcon2} type={toolTypes.LINE} />
      <IconButton src={pencilIcon} src2={pencilIcon2} type={toolTypes.PENCIL} />
      <IconButton src={textIcon} src2={textIcon2} type={toolTypes.TEXT} />
      <IconButton
        src={rubberIcon}
        src2={rubberIcon2}
        type={toolTypes.RUBBER}
        isRubber={true}
      />
    </div>
  );
};

export default Menu;
