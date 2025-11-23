import { useAppSelector } from "@/store/hooks"
import { AdminDashboard } from "./dashboard/AdminDashboard";
import { CompanyDashboard } from "./dashboard/CompanyDashboard";
import { StudentDashboard } from "./dashboard/StudentDashboard";
import { useEffect } from "react";

const DashboardPage = () => {
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (location.hash) {
      // Espera un tick para que el DOM se renderice
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [location]);

  if (!user) return <div>No autorizado</div>;

   switch (user.role) {
    case "DIRECTOR":
      return <AdminDashboard />;
    case "EMPRESA":
      return <CompanyDashboard />;
    case "ESTUDIANTE":
      return <StudentDashboard />;
    default:
      return <div>Rol no reconocido</div>;
  }
}


export default DashboardPage;