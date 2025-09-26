// src/routes/PrivateRoute.jsx
import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router";
import type { ReactNode } from "react";


interface PrivateRouteProps {
  children: ReactNode;
}
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/" replace />;
}
