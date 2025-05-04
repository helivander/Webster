import { createSlice } from '@reduxjs/toolkit';

type IAuthState = {
  isLoggedIn: boolean;
  token: string | null;
  user: {
    name: string;
    avatar: string;
    email: string;
  } | null;
};

const initialState: IAuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, { payload }) {
      const { accessToken, user } = payload;
      state.token = accessToken;
      state.user = user;
      state.isLoggedIn = true;
    },
    // setToken(state, { payload }) {
    //   const { token } = payload;
    //   state.token = token;
    // },
    logout(state) {
      state.isLoggedIn = initialState.isLoggedIn;
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
