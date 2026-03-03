import { useParams, Outlet, NavLink } from "react-router-dom";

const ClassDashboard = () => {
  const { classId } = useParams();

  const linkClass = ({ isActive }) =>
    `px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-blue-50 text-blue-600 border border-blue-100"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 shrink-0">

        <div className="px-5 h-[60px] flex items-center border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-800">Class Management</span>
        </div>

        <nav className="px-3 py-4 flex flex-col gap-0.5">
          <NavLink to="create-assignment" className={linkClass}>Create Assignment</NavLink>
          <NavLink to="assignments" className={linkClass}>View Assignments</NavLink>
          <NavLink to="schedule-exam" className={linkClass}>Schedule Exam</NavLink>
          <NavLink to="add-marks" className={linkClass}>Add / Update Marks</NavLink>
          <NavLink to="students" className={linkClass}>View Students</NavLink>
        </nav>

      </aside>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default ClassDashboard;