import { configureStore } from "@reduxjs/toolkit";
import whiteboardSlice from "./whiteboardSlice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["redux/updateCanvasElementsArray"],
        ignoredPaths: ["whiteboard.canvasElements"],
      },
    }),
});
