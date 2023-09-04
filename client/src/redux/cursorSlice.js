import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cursors: [],
};

const crSlice = createSlice({
  name: "cursor",
  initialState,
  reducers: {
    reduxUpdateCursorPosition: (state, action) => {
      const { x, y, userId } = action.payload;

      const index = state.cursors.findIndex((c) => c.userId === userId);

      if (index !== -1) {
        state.cursors[index] = {
          userId,
          x,
          y,
        };
      } else {
        state.cursors.push({
          userId,
          x,
          y,
        });
      }
    },
    reduxFilterDisconnectedUser: (state, action) => {
      state.cursors = state.cursors.filter(
        (usr) => usr.userId !== action.payload
      );
    },
  },
});

export const { reduxUpdateCursorPosition, reduxFilterDisconnectedUser } =
  crSlice.actions;

export default crSlice.reducer;
