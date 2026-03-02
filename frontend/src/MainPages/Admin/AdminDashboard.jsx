import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <AdminTopbar />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminDashboard