import { NavLink } from "react-router-dom";

const TeacherSidebar = () => {

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition
     ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-200"}`

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Teacher Panel</h2>

      <nav className="flex flex-col gap-3">
        <NavLink to="/teacher" end className={linkClass}>
          Home
        </NavLink>

        <NavLink to="/teacher/classes" className={linkClass}>
          My Classes
        </NavLink>

        <NavLink to="/teacher/students" className={linkClass}>
          My Students
        </NavLink>

        <NavLink to="/teacher/attendance" className={linkClass}>
          Attendance
        </NavLink>

      </nav>
    </aside>
  );
};

export default TeacherSidebar;
