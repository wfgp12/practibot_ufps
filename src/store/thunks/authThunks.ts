import { createAsyncThunk } from "@reduxjs/toolkit"
import { loginSuccess } from "../slices/authSlice"
import { authApi } from "@/api/authApi"

interface LoginPayload {
  nit?: string
  password?: string
  googleToken?: string;
}

// thunk de login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      localStorage.setItem("token", response.token);
      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      // error ya es string seguro
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Error desconocido");
    }
  }
);

export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token found");

    try {
      const response = await authApi.loadUserFromToken();
      dispatch(loginSuccess({ user: response.user, token }));
      return response;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Error desconocido");
    }
  }
);
