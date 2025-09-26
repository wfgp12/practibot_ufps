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
  student: [
    { label: "Mi perfil", href: "/dashboard/profile" },
    { label: "Vacantes", href: "/dashboard/vacantes" },
    { label: "Mis postulaciones", href: "/dashboard/postulaciones" },
  ],
  company: [
    { label: "Mis vacantes", href: "/dashboard/mis-vacantes" },
    { label: "Postulaciones recibidas", href: "/dashboard/postulaciones" },
  ],
  admin: [
    { label: "Usuarios", href: "/dashboard/usuarios" },
    { label: "Empresas", href: "/dashboard/empresas" },
    { label: "Vacantes", href: "/dashboard/vacantes" },
  ],
};
