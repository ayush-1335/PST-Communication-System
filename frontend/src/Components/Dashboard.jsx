import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../MainPages/Student/StudentDashboard";
import TeacherDashboard from "../MainPages/Teacher/TeacherDashboard";
import ParentDashboard from "../MainPages/Parent/ParentDashboard";
import AdminDashboard from "../Admin/AdminDashboard";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading dashboard...</p>;

  switch (user?.role) {
    case "STUDENT":
      return <StudentDashboard />;

    case "TEACHER":
      return <TeacherDashboard />;

    case "PARENT":
      return <ParentDashboard />;

    case "ADMIN":
      return <AdminDashboard />;

    default:
      return <p>Unauthorized</p>;
  }
};

export default Dashboard;
