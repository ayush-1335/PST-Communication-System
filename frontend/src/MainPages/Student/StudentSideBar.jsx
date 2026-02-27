import { NavLink } from "react-router-dom";

const StudentSidebar = () => {

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition
     ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-200"}`

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Student Panel</h2>

      <nav className="flex flex-col gap-3">
        <NavLink to="/student" end className={linkClass}>
          Home
        </NavLink>

        <NavLink to="/student/view-attendance" className={linkClass}>
          My Attendance
        </NavLink>

        <NavLink to="/student/view-assignment" className={linkClass}>
          View Assignment
        </NavLink>

        <NavLink to="/student/view-exam" className={linkClass}>
          View Exam
        </NavLink>

      </nav>
    </aside>
  );
};

export default StudentSidebar;
