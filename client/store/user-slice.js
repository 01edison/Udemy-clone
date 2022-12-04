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
    updateRole(state) {
      state.user.role.push("Instructor");
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
