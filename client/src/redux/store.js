import { configureStore } from "@reduxjs/toolkit";
import whiteboardSlice from "./whiteboardSlice";
import cursorSlice from "./cursorSlice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSlice,
    cursor: cursorSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["redux/updateCanvasElementsArray"],
        ignoredPaths: ["whiteboard.canvasElements"],
      },
    }),
});
