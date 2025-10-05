import { useAppSelector } from "@/store/hooks"
import { AdminDashboard } from "./dashboard/AdminDashboard";
import { CompanyDashboard } from "./dashboard/CompanyDashboard";
import { StudentDashboard } from "./dashboard/StudentDashboard";

export const Dashboard = () => {
  const { user } = useAppSelector(state => state.auth)

  if (!user) return <div>No autorizado</div>;

   switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "company":
      return <CompanyDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <div>Rol no reconocido</div>;
  }
}
