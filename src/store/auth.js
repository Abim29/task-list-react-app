import { createSlice } from "@reduxjs/toolkit";
import { getToken, removeToken, setToken } from "../utils/auth";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: getToken() },
  reducers: {
    login(state, action) {
      setToken(action.payload.token);
      state.token = action.payload.token;
    },
    logout(state) {
      removeToken();
      state.token = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
