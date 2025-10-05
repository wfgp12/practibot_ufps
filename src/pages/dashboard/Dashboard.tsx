import { useAppSelector } from "@/store/hooks"
import { AdminDashboard } from "./components/AdminDashboard";
import { CompanyDashboard } from "./components/CompanyDashboard";
import { StudentDashboard } from "./components/StudentDashboard";

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
