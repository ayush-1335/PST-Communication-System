import { useAuth } from "../../context/AuthContext"

const AdminTopbar = () => {
  const { user, logout, loading } = useAuth()

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      
      <h1 className="text-lg font-semibold">
        Welcome, {user?.firstName || "Admin"}
      </h1>
      
    </header>
  )
}

export default AdminTopbar
