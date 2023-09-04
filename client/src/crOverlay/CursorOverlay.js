import React from "react";
import { useSelector } from "react-redux";
import cursor from "../assets/icons/selection-svgrepo-com.svg";

const CursorOverlay = () => {
  const { cursors } = useSelector((store) => store.cursor);
  return (
    <div>
      return (
      <div className="cursor-overlay">
        {cursors.map((cr) => (
          <img
            key={cr.userId}
            src={cursor}
            alt=""
            className="cursor"
            style={{
              position: "absolute",
              left: cr.x,
              top: cr.y,
              width: "25px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CursorOverlay;
