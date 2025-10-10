import type { Role } from "@/models/IUser";

interface NavItem {
  label: string;
  href: string; // puede ser #id o ruta
}

export const navItems: Record<Role, NavItem[]> = {
  guest: [
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Vacantes", href: "#vacantes" },
    { label: "Para empresas", href: "#empresas" },
    { label: "FAQ", href: "#faq" },
  ],
  ESTUDIANTE: [
    { label: "Mi perfil", href: "/dashboard/profile" },
    { label: "Vacantes", href: "/dashboard/vacantes" },
    { label: "Mis postulaciones", href: "/dashboard/postulaciones" },
  ],
  EMPRESA: [
    { label: "Mis vacantes", href: "/dashboard/mis-vacantes" },
    { label: "Postulaciones recibidas", href: "/dashboard/postulaciones" },
  ],
  DIRECTOR: [
    { label: "Convenios", href: "#convenios" },
    { label: "Vacantes", href: "#vacantes" },
    { label: "Estudiantes", href: "#estudiantes" },
    { label: "Documentación", href: "#documentos" },
    { label: "Reportes", href: "#reportes" },
  ],
  ADMIN: [
    { label: "Convenios", href: "#convenios" },
    { label: "Vacantes", href: "#vacantes" },
    { label: "Estudiantes", href: "#estudiantes" },
    { label: "Documentación", href: "#documentos" },
    { label: "Reportes", href: "#reportes" },
  ],
};
