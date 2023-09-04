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
    case "TEXT":
      const inside1 =
        x >= x1 && x <= x2 && y >= y1 && y <= y2
          ? cursorPositions.INSIDE
          : null;
      return inside1;
    case "LINE":
      const on = onLine({ x1, y1, x2, y2, x, y });
      const start =
        Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5
          ? cursorPositions.START
          : null;
      const end =
        Math.abs(x - x2) < 5 && Math.abs(y - y2) < 5
          ? cursorPositions.END
          : null;

      return on || start || end;
    default:
      break;
  }
};

const onLine = ({ x1, y1, x2, y2, x, y, maxDistance = 2 }) => {
  const a = { x: x1, y: y1 }; //start
  const b = { x: x2, y: y2 }; //end
  const c = { x, y }; //mouse

  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? cursorPositions.INSIDE : null;
};
const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); //distance between 2 points on canvas

export const styleCursor = (position) => {
  switch (position) {
    case cursorPositions.TOP_LEFT:
    case cursorPositions.BOTTOM_RIGHT:
      return "nwse-resize";
    case cursorPositions.TOP_RIGHT:
    case cursorPositions.BOTTOM_LEFT:
      return "nesw-resize";
    case cursorPositions.START:
    case cursorPositions.END:
      return "ew-resize";
    default:
      return "move";
  }
};

export const getResizedCoordinate = (
  clientX,
  clientY,
  position,
  coordinates
) => {
  const { x1, y1, x2, y2 } = coordinates;

  switch (position) {
    case cursorPositions.START:
    case cursorPositions.TOP_LEFT:
      return { x1: clientX, y1: clientY, x2, y2 };
    case cursorPositions.TOP_RIGHT:
      return { x2: clientX, y1: clientY, x1, y2 };
    case cursorPositions.BOTTOM_LEFT:
      return { x1: clientX, y2: clientY, x2, y1 };
    case cursorPositions.END:
    case cursorPositions.BOTTOM_RIGHT:
      return { x2: clientX, y2: clientY, x1, y1 };
    default:
      return null;
  }
};
