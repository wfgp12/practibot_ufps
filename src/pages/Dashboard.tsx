import { useAppSelector } from "@/store/hooks"
import { AdminDashboard } from "./dashboard/AdminDashboard";
import { CompanyDashboard } from "./dashboard/CompanyDashboard";
import { StudentDashboard } from "./dashboard/StudentDashboard";

export const Dashboard = () => {
  const { user } = useAppSelector(state => state.auth)

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
