import { createAsyncThunk } from "@reduxjs/toolkit"

import { loginSuccess } from "../slices/authSlice"
import { hideLoader, showLoader } from "../slices/uiSlice"

import { authApi } from "@/api/authApi"
import { reconnectSocket } from "@/lib/socket"

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
      dispatch(showLoader());
      const response = await authApi.login(payload);
      localStorage.setItem("token", response.token);
      dispatch(loginSuccess(response));
      reconnectSocket();
      return response;
    } catch (error) {
      // error ya es string seguro
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Error desconocido");
    } finally {
      dispatch(hideLoader());
    }
  }
);

export const loadUserThunk = createAsyncThunk(
  "auth/loadUser",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token found");
    try {
      dispatch(showLoader());
      const response = await authApi.loadUserFromToken();
      dispatch(loginSuccess({ user: response.user, token }));
      return response;
    } catch (error) {
      localStorage.removeItem("token");
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Error desconocido");
    } finally {
      dispatch(hideLoader());
    }
  }
);
