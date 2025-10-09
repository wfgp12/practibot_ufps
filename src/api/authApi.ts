import type { AxiosError } from "axios";
import axiosClient from "./axiosClient";
import type { IUser } from "@/models/IUser";

interface LoginResponse {
  user: IUser;
  token: string;
}

interface LoginPayload {
  nit?: string;
  password?: string;
  googleToken?: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {

    try {
      if (payload.googleToken) {
        const { data } = await axiosClient.post("/auth/google-login", {
          token: payload.googleToken,
        });
        return data;
      } else {
        const { data } = await axiosClient.post("/auth/login", {
          nit: payload.nit,
          password: payload.password,
        });
        return data;
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else {
        throw new Error("Error al conectar con el servidor");
      }
    }
  },
  loadUserFromToken: async (): Promise<{ user: IUser }> => {
    try {
      const { data } = await axiosClient.get<{ user: IUser }>("/auth/me");
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else {
        throw new Error("Error al conectar con el servidor");
      }
    }
  },
};
