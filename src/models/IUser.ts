export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type Role = "guest" | "student" | "company" | "admin";