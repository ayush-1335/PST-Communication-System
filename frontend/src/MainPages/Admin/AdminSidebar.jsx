import { NavLink } from "react-router-dom"

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-blue-50 text-blue-600 border border-blue-100"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    }`

  return (
    <aside className="w-60 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0">

      {/* Logo */}
      <div className="px-5 h-[60px] flex items-center border-b border-slate-100">
        <span className="text-[17px] font-semibold text-slate-800 tracking-tight">
          My<span className="text-blue-500">App</span>
        </span>
        <span className="ml-2 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-500 text-[10px] font-semibold uppercase tracking-wider">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <NavLink to="/admin/overview" end className={linkClass}>Overview</NavLink>
        <NavLink to="/admin/create-user" className={linkClass}>Create User</NavLink>
        <NavLink to="/admin/assign-relation" className={linkClass}>Assign Relation</NavLink>
        <NavLink to="/admin/students" className={linkClass}>Students</NavLink>
        <NavLink to="/admin/parents" className={linkClass}>Parents</NavLink>
        <NavLink to="/admin/teachers" className={linkClass}>Teachers</NavLink>
        <NavLink to="/admin/exams" className={linkClass}>Exam Scheduled</NavLink>

        <NavLink to="/admin/transport" className={linkClass}>Transport</NavLink>
      </nav>

    </aside>
  )
}

export default AdminSidebar