import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tool: null,
  canvasElements: [],
  loading: false,
  error: null,
};

const whiteBoard = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setToolType: (state, action) => {
      state.tool = action.payload;
    },
    updateCanvasElements: (state, action) => {
      const { id } = action.payload;
      const index = state.canvasElements.findIndex((el) => el.id === id);
      if (index === -1) {
        state.canvasElements.push(action.payload);
      } else {
        state.canvasElements[index] = action.payload;
      }
    },
    updateCanvasElementsArray: (state, action) => {
      state.canvasElements = action.payload;
    },
    clearCanvasElementsArray: (state, action) => {
      state.canvasElements = [];
    },
  },
});

export const {
  setToolType,
  updateCanvasElements,
  updateCanvasElementsArray,
  clearCanvasElementsArray,
} = whiteBoard.actions;

export default whiteBoard.reducer;
