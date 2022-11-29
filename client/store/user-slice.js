import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    login(state, action) {
      const userDetails = action.payload;
      state.user = userDetails;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const authActions = userSlice.actions;
export default userSlice;
