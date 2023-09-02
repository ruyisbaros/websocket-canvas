import { io } from "socket.io-client";
import { store } from "./redux/store";
import {
  updateCanvasElements,
  updateCanvasElementsArray,
} from "./redux/whiteboardSlice";
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
};

export const emitElementUpdate = (elementData) => {
  socket.emit("element-update", elementData);
};
