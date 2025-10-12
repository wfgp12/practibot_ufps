import type { AxiosError } from "axios";
import axiosClient from "./axiosClient";
import { mapUser, type IUser } from "@/models/IUser";
import type { LoginBackendResponse, LoginPayload, LoginResponse } from "@/models/IAuth";


export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      if (payload.googleToken) {
        const { data } = await axiosClient.get<LoginBackendResponse>("/auth/verify", {
          headers: { Authorization: `Bearer ${payload.googleToken}` },
        });
        return {
          user: mapUser(data.usuario),
          token: data.token,
        };
      } else {
        const { data } = await axiosClient.post<LoginBackendResponse>("/auth/login", {
          nit: payload.nit,
          password: payload.password,
        });
        return {
          user: mapUser(data.usuario),
          token: data.token,
        };
      }

    } catch (error) {
      console.log('error', error)

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
      localStorage.removeItem("token");
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      } else {
        throw new Error("Error al conectar con el servidor");
      }
    }
  },
};
