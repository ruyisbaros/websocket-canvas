import React, { useRef, useLayoutEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Menu from "./Menu";
import rough from "roughjs/bundled/rough.esm";
import { useDispatch, useSelector } from "react-redux";
import { toolTypes } from "../constants/toolType";
import { actions } from "../constants/action";
import {
  adjustCoordinate,
  createElement,
  drawElement,
  updateElement,
} from "../helpers/elementMoves";
import { updateCanvasElements } from "../redux/whiteboardSlice";

let selectedElement;

const setSelectedElement = (el) => {
  selectedElement = el;
};

const WhiteBoard = () => {
  const canvasRef = useRef();
  const dispatch = useDispatch();
  const { tool, canvasElements } = useSelector((store) => store.whiteboard);
  const [action, setAction] = useState(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);
    canvasElements.forEach((el) => {
      drawElement({ roughCanvas, context: ctx, el });
    });
  }, [canvasElements]);

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    //console.log(clientX, clientY);
    if (tool === toolTypes.RECTANGLE) {
      setAction(actions.DRAWING);

      const element = createElement({
        x1: clientX,
        y1: clientY,
        x2: clientX,
        y2: clientY,
        toolType: tool,
        id: uuid(),
      });
      setSelectedElement(element);
      dispatch(updateCanvasElements(element));
      //console.log(element);
    }
  };

  //Mouse Up
  const handleMouseUp = () => {
    if (selectedElement) {
      const activeElementIndex = canvasElements.findIndex(
        (el) => el.id === selectedElement.id
      );
      const activeElement = canvasElements.find(
        (el) => el.id === selectedElement.id
      );

      if (activeElement) {
        if (action === actions.DRAWING) {
          if (selectedElement.type === "RECTANGLE") {
            const { x1, y1, x2, y2 } = adjustCoordinate(activeElement);
            updateElement(
              {
                index: activeElementIndex,
                id: activeElement.id,
                x1,
                y1,
                x2,
                y2,
                type: activeElement.type,
              },
              canvasElements
            );
          }
        }
      }
    }
    setAction(null);
    setSelectedElement(null);
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    //console.log(clientX, clientY);
    if (action === actions.DRAWING) {
      const indexOfSelectedElement = canvasElements?.findIndex(
        (el) => el.id === selectedElement.id
      );
      if (indexOfSelectedElement !== -1) {
        updateElement(
          {
            index: indexOfSelectedElement,
            id: canvasElements[indexOfSelectedElement].id,
            x1: canvasElements[indexOfSelectedElement].x1,
            y1: canvasElements[indexOfSelectedElement].y1,
            x2: clientX,
            y2: clientY,
            type: canvasElements[indexOfSelectedElement].type,
          },
          canvasElements
        );
      }
    }
  };

  return (
    <>
      <Menu />
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};

export default WhiteBoard;
