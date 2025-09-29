import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router";
import type { ReactElement } from "react";

interface PublicRouteProps {
  children: ReactElement;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};