import rough from "roughjs/bundled/rough.esm";
import { store } from "../redux/store";
import { updateCanvasElementsArray } from "../redux/whiteboardSlice";
import { emitElementUpdate } from "../socketCon";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "./getSvgPathFromStroke";
const generator = rough.generator();

const generateRectTangle = (x1, y1, x2, y2) => {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};
const generateLine = (x1, y1, x2, y2) => {
  return generator.line(x1, y1, x2, y2);
};

export const createElement = ({ x1, y1, x2, y2, toolType, id, text }) => {
  let roughElement;
  switch (toolType) {
    case "RECTANGLE":
      roughElement = generateRectTangle(x1, y1, x2, y2);
      return {
        id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };
    case "LINE":
      roughElement = generateLine(x1, y1, x2, y2);
      return {
        id,
        roughElement,
        type: toolType,
        x1,
        y1,
        x2,
        y2,
      };
    case "PENCIL":
      //roughElement = generatePencil(x1, y1, x2, y2);
      return {
        id,
        type: toolType,
        points: [{ x: x1, y: y1 }],
      };
    case "TEXT":
      //roughElement = generatePencil(x1, y1, x2, y2);
      return {
        id,
        type: toolType,
        x1,
        y1,
        text: text || "",
      };
    default:
      throw new Error("Something went wrong with creating an element");
  }
};

export const updateElement = (
  { index, id, x1, y1, x2, y2, type, text },
  elements
) => {
  const elementsCopy = [...elements];
  //console.log(type);
  switch (type) {
    case "LINE":
    case "RECTANGLE":
      const updatedElement = createElement({
        x1,
        y1,
        x2,
        y2,
        toolType: type,
        id,
      });
      elementsCopy[index] = updatedElement;
      store.dispatch(updateCanvasElementsArray(elementsCopy));
      emitElementUpdate(updatedElement);
      break;
    case "PENCIL":
      elementsCopy[index] = {
        ...elementsCopy[index],
        points: [
          ...elementsCopy[index].points,
          {
            x: x2,
            y: y2,
          },
        ],
      };
      const updatedPencilElement = elementsCopy[index];
      store.dispatch(updateCanvasElementsArray(elementsCopy));
      emitElementUpdate(updatedPencilElement);
      break;
    case "TEXT":
      const textWidth = document
        .getElementById("canvas")
        .getContext("2d")
        .measureText(text).width;
      const textHeight = 24;
      elementsCopy[index] = {
        ...createElement({
          id,
          toolType: type,
          x1,
          y1,
          x2: x1 + textWidth,
          y2: y1 + textHeight,
          text,
        }),
      };
      store.dispatch(updateCanvasElementsArray(elementsCopy));
      emitElementUpdate(elementsCopy[index]);
      break;
    default:
      throw new Error("Something went wrong with updating an element");
  }
};

export const drawElement = ({ roughCanvas, context, el }) => {
  switch (el.type) {
    case "LINE":
    case "RECTANGLE":
      return roughCanvas.draw(el.roughElement);
    case "PENCIL":
      drawPencilElement(context, el);
      break;
    case "TEXT":
      drawTextElement(context, el);
      break;
    default:
      throw new Error("Something went wrong with drawing new element");
  }
};

//If the x2 or y2 are smaller than x1 or y1
export const adjustCoordinate = (el) => {
  const { x1, x2, y1, y2 } = el;
  if (el.type === "RECTANGLE") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  }
  if (el.type === "LINE") {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const drawPencilElement = (context, el) => {
  const myStroke = getStroke(el.points, {
    size: 8,
  });
  const pathData = getSvgPathFromStroke(myStroke);

  const myPath = new Path2D(pathData);
  context.fill(myPath);
};

const drawTextElement = (context, el) => {
  context.textBaseline = "top";
  context.font = "24px sans-serif";
  context.fillText(el.text, el.x1, el.y1);
};
