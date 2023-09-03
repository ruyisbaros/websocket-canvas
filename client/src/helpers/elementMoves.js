import rough from "roughjs/bundled/rough.esm";
import { store } from "../redux/store";
import { updateCanvasElementsArray } from "../redux/whiteboardSlice";
import { emitElementUpdate } from "../socketCon";
import { cursorPositions } from "../constants/cursorPosition";

export const getElementAtPosition = (x, y, elements) => {
  //x and y are the position of mouse
  return elements
    .map((el) => ({
      ...el,
      position: isInPosition(x, y, el),
    }))
    .find((el) => el.position !== null && el.position !== undefined);
};

const isInPosition = (x, y, el) => {
  const { type, x1, y1, x2, y2 } = el;

  switch (type) {
    case "RECTANGLE":
      const topLeft =
        Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5
          ? cursorPositions.TOP_LEFT
          : null;
      const topRight =
        Math.abs(x - x2) < 5 && Math.abs(y - y1) < 5
          ? cursorPositions.TOP_RIGHT
          : null;
      const bottomLeft =
        Math.abs(x - x1) < 5 && Math.abs(y - y2) < 5
          ? cursorPositions.BOTTOM_LEFT
          : null;
      const bottomRight =
        Math.abs(x - x2) < 5 && Math.abs(y - y2) < 5
          ? cursorPositions.BOTTOM_RIGHT
          : null;
      const inside =
        x >= x1 && x <= x2 && y >= y1 && y <= y2
          ? cursorPositions.INSIDE
          : null;

      return topLeft || topRight || bottomLeft || bottomRight || inside;

    default:
      break;
  }
};

export const styleCursor = (position) => {
  switch (position) {
    case cursorPositions.TOP_LEFT:
    case cursorPositions.BOTTOM_RIGHT:
      return "nwse-resize";
    case cursorPositions.TOP_RIGHT:
    case cursorPositions.BOTTOM_LEFT:
      return "nesw-resize";
    default:
      return "move";
  }
};
