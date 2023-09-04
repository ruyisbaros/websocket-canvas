import { io } from "socket.io-client";
import { store } from "./redux/store";
import {
  updateCanvasElements,
  updateCanvasElementsArray,
} from "./redux/whiteboardSlice";
import {
  reduxFilterDisconnectedUser,
  reduxUpdateCursorPosition,
} from "./redux/cursorSlice";
let socket;

export const connectToSocketServer = () => {
  socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("Connected to socket io server");
  });

  socket.on("Whiteboard-state", (elements) => {
    store.dispatch(updateCanvasElementsArray(elements));
  });
  socket.on("element-update", (el) => {
    store.dispatch(updateCanvasElements(el));
  });
  socket.on("clear-box", () => {
    store.dispatch(updateCanvasElementsArray([]));
  });
  socket.on("cursor-position", (data) => {
    store.dispatch(reduxUpdateCursorPosition(data));
  });
  socket.on("user-disconnected", (id) => {
    store.dispatch(reduxFilterDisconnectedUser(id));
  });
};

export const emitElementUpdate = (elementData) => {
  socket.emit("element-update", elementData);
};

export const emitClearCanvasBox = () => {
  socket.emit("clear-box");
};

export const emitCursorPosition = (cursorData) => {
  socket.emit("cursor-position", cursorData);
};
