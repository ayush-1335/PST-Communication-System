import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import TeacherTopbar from "./TeacherTopbar";

const TeacherDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <TeacherTopbar />

        <main className="flex-1 p-6">
          {/* 🔥 CHILD ROUTES RENDER HERE */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
