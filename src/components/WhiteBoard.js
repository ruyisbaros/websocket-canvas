import React, { useRef } from "react";
import Menu from "./Menu";

const WhiteBoard = () => {
  const canvasRef = useRef();
  return (
    <>
      <Menu />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};

export default WhiteBoard;
