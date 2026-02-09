import { NavLink } from "react-router-dom";

const TeacherSidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Teacher Panel</h2>

      <nav className="flex flex-col gap-3">
        <NavLink to="/teacher" end>
          Home
        </NavLink>

        <NavLink to="/teacher/classes">
          My Classes
        </NavLink>

        <NavLink to="/teacher/students">
          My Students
        </NavLink>
      </nav>
    </aside>
  );
};

export default TeacherSidebar;
