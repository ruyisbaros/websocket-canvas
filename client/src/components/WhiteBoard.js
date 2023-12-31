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
import {
  getElementAtPosition,
  getResizedCoordinate,
  styleCursor,
  updateEachPointPosition,
} from "../helpers/elementMoves";
import { cursorPositions } from "../constants/cursorPosition";
import { emitCursorPosition } from "../socketCon";

let emitCursor = true;
let lastCursorPosition;

const WhiteBoard = () => {
  const canvasRef = useRef();
  const textareaRef = useRef();
  const dispatch = useDispatch();
  const { tool, canvasElements } = useSelector((store) => store.whiteboard);
  const [action, setAction] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

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
    if (selectedElement && action === actions.WRITING) {
      return;
    }
    switch (tool) {
      case toolTypes.RECTANGLE:
      case toolTypes.LINE:
      case toolTypes.PENCIL:
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
        break;
      case toolTypes.TEXT:
        setAction(actions.WRITING);
        const element1 = createElement({
          x1: clientX,
          y1: clientY,
          x2: clientX,
          y2: clientY,
          toolType: tool,
          id: uuid(),
        });
        setSelectedElement(element1);
        dispatch(updateCanvasElements(element1));
        break;
      case toolTypes.SELECTION:
        const elementWithPosition = getElementAtPosition(
          clientX,
          clientY,
          canvasElements
        );
        if (
          elementWithPosition &&
          (elementWithPosition.type === toolTypes.RECTANGLE ||
            elementWithPosition.type === toolTypes.TEXT ||
            elementWithPosition.type === toolTypes.LINE)
        ) {
          setAction(
            elementWithPosition.position === cursorPositions.INSIDE
              ? actions.MOVING
              : actions.RESIZING
          );
          const offsetX = clientX - elementWithPosition.x1;
          const offsetY = clientY - elementWithPosition.y1;
          setSelectedElement({ ...elementWithPosition, offsetX, offsetY });
        }
        if (
          elementWithPosition &&
          elementWithPosition.type === toolTypes.PENCIL
        ) {
          setAction(actions.MOVING);

          const xOffsets = elementWithPosition.points?.map(
            (point) => clientX - point.x
          );
          const yOffsets = elementWithPosition.points?.map(
            (point) => clientY - point.y
          );

          setSelectedElement({ ...elementWithPosition, xOffsets, yOffsets });
        }
        break;
      default:
        break;
    }
  };

  //Mouse Move
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    lastCursorPosition = { x: clientX, y: clientY };
    if (emitCursor) {
      emitCursorPosition({ x: clientX, y: clientY });
      emitCursor = false;
      console.log("event fired"); //Too much. Need to be reduced
      setTimeout(() => {
        emitCursor = true;
        emitCursorPosition(lastCursorPosition);
      }, [50]);
    }

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
    if (
      tool === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement.type === toolTypes.PENCIL &&
      selectedElement
    ) {
      const { id } = selectedElement;

      const newPoints = selectedElement.points?.map((p, index) => ({
        x: clientX - selectedElement.xOffsets[index],
        y: clientY - selectedElement.yOffsets[index],
      }));

      const index = canvasElements.findIndex((el) => el.id === id);
      if (index !== -1) {
        updateEachPointPosition(newPoints, index, canvasElements, id);
      }
      return;
    }
    if (
      tool === toolTypes.SELECTION &&
      action === actions.MOVING &&
      selectedElement
    ) {
      const { id, x1, y1, x2, y2, offsetX, offsetY, text } = selectedElement;

      const width = x2 - x1;
      const height = y2 - y1;

      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;

      const index = canvasElements.findIndex((el) => el.id === id);

      if (index !== -1) {
        updateElement(
          {
            index,
            id,
            x1: newX1,
            y1: newY1,
            x2: newX1 + width,
            y2: newY1 + height,
            type: canvasElements[index].type,
            text,
          },
          canvasElements
        );
      }
    }

    if (
      tool === toolTypes.SELECTION &&
      action === actions.RESIZING &&
      selectedElement
    ) {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = getResizedCoordinate(
        clientX,
        clientY,
        position,
        coordinates
      );

      const index = canvasElements.findIndex((el) => el.id === id);

      if (index !== -1) {
        updateElement(
          {
            index,
            id,
            x1,
            y1,
            x2,
            y2,
            type: canvasElements[index].type,
          },
          canvasElements
        );
      }
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
        if (action === actions.DRAWING || action === actions.RESIZING) {
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
