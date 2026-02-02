import { NavLink } from "react-router-dom"

const AdminSidebar = () => {

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition
     ${isActive 
       ? "bg-blue-600 text-white" 
       : "text-gray-700 hover:bg-gray-200"}`

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-5 text-xl font-bold text-blue-600">
        Admin Panel
      </div>

      <nav className="px-3 space-y-2">
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/students" className={linkClass}>
          Students
        </NavLink>

        <NavLink to="/admin/parents" className={linkClass}>
          Parents
        </NavLink>

        <NavLink to="/admin/teachers" className={linkClass}>
          Teachers
        </NavLink>
      </nav>
    </aside>
  )
}

export default AdminSidebar
