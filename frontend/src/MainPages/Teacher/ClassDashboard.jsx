import { useParams, Outlet, NavLink } from "react-router-dom";

const ClassDashboard = () => {
  const { classId } = useParams();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition
     ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-200"}`

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-5 border-r">
        <h2 className="text-lg font-semibold mb-4">
          Class Management
        </h2>

        <div className="flex flex-col gap-3 text-sm">
          <NavLink
            to="create-assignment"
            className={linkClass}
          >
            Create Assignment
          </NavLink>

          <NavLink
            to="assignments"
            className={linkClass}
          >
            View Assignment
          </NavLink>

          <NavLink
            to="schedule-exam"
            className={linkClass}
          >
            Schedule Exam
          </NavLink>

          <NavLink
            to="add-marks"
            className={linkClass}
          >
            Add / Update Marks
          </NavLink>

          <NavLink
            to="students"
            className={linkClass}
          >
            View Students
          </NavLink>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ClassDashboard;
