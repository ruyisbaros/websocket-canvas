import rough from "roughjs/bundled/rough.esm";
import { store } from "../redux/store";
import { updateCanvasElementsArray } from "../redux/whiteboardSlice";
import { emitElementUpdate } from "../socketCon";
const generator = rough.generator();

const generateRectTangle = (x1, y1, x2, y2) => {
  return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};
const generateLine = (x1, y1, x2, y2) => {
  return generator.line(x1, y1, x2, y2);
};

export const createElement = ({ x1, y1, x2, y2, toolType, id }) => {
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
    default:
      throw new Error("Something went wrong with creating an element");
  }
};

export const updateElement = (
  { index, id, x1, y1, x2, y2, type },
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
    default:
      throw new Error("Something went wrong with updating an element");
  }
};

export const drawElement = ({ roughCanvas, context, el }) => {
  switch (el.type) {
    case "LINE":
    case "RECTANGLE":
      return roughCanvas.draw(el.roughElement);
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
