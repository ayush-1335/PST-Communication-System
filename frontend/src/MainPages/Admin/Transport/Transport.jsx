import { NavLink, Outlet } from "react-router-dom"

const Transport = () => {

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded text-sm ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-600 hover:bg-slate-100"
    }`

  return (
    <div className="flex h-full">

      {/* Transport Sidebar */}

      <div className="w-52 border-r bg-white p-3 space-y-2">

        <NavLink to="drivers" className={linkClass}>
          Drivers
        </NavLink>

        <NavLink to="routes" className={linkClass}>
          Routes
        </NavLink>

        <NavLink to="buses" className={linkClass}>
          Buses
        </NavLink>

        <NavLink to="transport-request" className={linkClass}>
          Transport Request
        </NavLink>

        <NavLink to="bus-info" className={linkClass}>
          Bus Info
        </NavLink>

      </div>

      {/* Page Content */}

      <div className="flex-1 p-6 bg-slate-50 overflow-auto">
        <Outlet />
      </div>

    </div>
  )
}

export default Transport