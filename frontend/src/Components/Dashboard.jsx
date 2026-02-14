import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../MainPages/Student/StudentDashboard";
import TeacherDashboard from "../MainPages/Teacher/TeacherDashboard";
import ParentDashboard from "../MainPages/Parent/ParentDashboard";
import AdminDashboard from "../MainPages/Admin/AdminDashboard";
import { AdminProvider } from "../context/AdminContext";
import { TeacherProvider } from "../context/TeacherContext";
import { StudentProvider } from "../context/StudentContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading dashboard...</p>;

  switch (user?.role) {
    case "STUDENT":
      return (
        <StudentProvider>
          <StudentDashboard />
        </StudentProvider>
      );

    case "TEACHER":
      return (
        <TeacherProvider >
          <TeacherDashboard />
        </TeacherProvider>
      );

    case "PARENT":
      return <ParentDashboard />;

    case "ADMIN":
      return (
        <AdminProvider>
          <AdminDashboard />;
        </AdminProvider>
      )

    default:
      return <p>Unauthorized</p>;
  }
};

export default Dashboard;
