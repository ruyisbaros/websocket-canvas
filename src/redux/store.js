import { configureStore } from "@reduxjs/toolkit";
import whiteboardSlice from "./whiteboardSlice";

export const store = configureStore({
  reducer: {
    whiteboard: whiteboardSlice,
  },
});
