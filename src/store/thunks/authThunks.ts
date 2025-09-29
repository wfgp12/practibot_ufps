import { createAsyncThunk } from "@reduxjs/toolkit"
import type { IUser } from "@/models/IUser"
import { loginSuccess } from "../slices/authSlice"

interface LoginPayload {
  nit?: string
  password?: string
  institutional?: boolean
}

// thunk de login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { dispatch }) => {
    // TODO: implementar la lógica de login
    const response = await new Promise<{ user: IUser; token: string }>((resolve) => {
      setTimeout(() => {
        let user: IUser
        const token = "fake-jwt-token"

        if (payload.institutional) {
          user = {
            id: "1",
            name: "Estudiante UFPS",
            email: "user@ufps.edu.co",
            role: "admin",
          }
        } else {
          user = {
            id: "2",
            name: "Empresa demo",
            email: "empresa@demo.com",
            role: "company",
          }
        }

        resolve({ user, token })
      }, 1200) // 1.2 seg de delay
    })

    // 🔹 cuando termine la simulación, actualizamos redux
    dispatch(loginSuccess(response))
    return response
  }
)
