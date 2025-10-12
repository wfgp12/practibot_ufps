import type { IUser, IApiUser } from "./IUser";

export interface LoginPayload {
    nit?: string;
    password?: string;
    googleToken?: string;
}

export interface LoginResponse {
    message?: string;
    user: IUser;
    token: string;
}

export interface LoginBackendResponse {
    message?: string;
    usuario: IApiUser;
    token: string;
}