import axiosClient from "./axiosClient";
import { mapUser, type IApiUser, type IUser } from "@/models/IUser";
import type { LoginBackendResponse, LoginPayload, LoginResponse } from "@/models/IAuth";
import type { IApiResponse } from "@/models/IApi";


export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    if (payload.googleToken) {
      const { data } = await axiosClient.get<LoginBackendResponse>("/auth/verify", {
        headers: { Authorization: `Bearer ${payload.googleToken}` },
      });
      return {
        user: mapUser(data.usuario),
        token: data.token,
      };
    } else {
      const { data } = await axiosClient.post<LoginBackendResponse>("/empresas/login", {
        nit: payload.nit,
        password: payload.password,
      });
      return {
        user: mapUser(data.usuario),
        token: data.token,
      };
    }
  },

  loadUserFromToken: async (): Promise<{ user: IUser }> => {
    const { data } = await axiosClient.get<{ usuario: IApiUser }>("/auth/refresh");
    return { user: mapUser(data.usuario) };
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<string> => {
    const { data } = await axiosClient.patch<IApiResponse<string>>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data.data;
  },
};
