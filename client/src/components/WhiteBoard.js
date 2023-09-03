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
} from "../helpers/elementCreations";
import { updateCanvasElements } from "../redux/whiteboardSlice";
import { getElementAtPosition, styleCursor } from "../helpers/elementMoves";

const WhiteBoard = () => {
  const canvasRef = useRef();
  const textareaRef = useRef();
  const dispatch = useDispatch();
  const { tool, canvasElements } = useSelector((store) => store.whiteboard);
  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [cursorCatch, setCursorCatch] = useState(false);

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

    if (selectedElement && action === actions.WRITING) {
      return;
    }

    const element = createElement({
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
      toolType: tool,
      id: uuid(),
    });

    switch (tool) {
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL:
        setAction(actions.DRAWING);
        break;
      case toolTypes.TEXT:
        setAction(actions.WRITING);
        break;
      default:
        break;
    }
    setSelectedElement(element);
    dispatch(updateCanvasElements(element));
  };

  //Mouse Move
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
    if (tool === toolTypes.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, canvasElements);

      e.target.style.cursor = element
        ? styleCursor(element.position)
        : "default";
    }
    //console.log(cursorCatch);
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
          if (
            selectedElement.type === "RECTANGLE" ||
            selectedElement.type === "LINE"
          ) {
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
  const handleTextarea = (e) => {
    const { id, x1, y1, type } = selectedElement;
    const textElementIndex = canvasElements.findIndex(
      (el) => el.id === selectedElement.id
    );

    if (textElementIndex !== -1) {
      updateElement(
        {
          id,
          x1,
          y1,
          type,
          text: e.target.value,
          index: textElementIndex,
        },
        canvasElements
      );

      setAction(null);
      setSelectedElement(null);
    }
  };
  return (
    <>
      <Menu />
      {action === actions.WRITING ? (
        <textarea
          ref={textareaRef}
          onBlur={handleTextarea}
          placeholder="Text"
          style={{
            paddingTop: "12px",
            maxWidth: "max-content",
            position: "absolute",
            top: selectedElement.y1 - 3,
            left: selectedElement.x1,
            font: "24px sans-serif",
            border: 0,
            outline: 0,
            padding: 0,
            margin: 0,
            resize: "none",
            overflow: "hidden",
            whitespace: "pre",
            //background: "rgba(0,0,0,.03)",
            borderRadius: "3px",
          }}
        />
      ) : null}
      <canvas
        id="canvas"
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
