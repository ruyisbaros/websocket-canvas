import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tool: null,
  loading: false,
};

const whiteBoard = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setToolType: (state, action) => {
      state.tool = action.payload;
    },
  },
});

export const { setToolType } = whiteBoard.actions;

export default whiteBoard.reducer;
