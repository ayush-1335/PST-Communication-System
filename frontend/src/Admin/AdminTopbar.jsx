import { useAuth } from "../context/AuthContext"

const AdminTopbar = () => {
  const { user, logout, loading } = useAuth()

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      
      <h1 className="text-lg font-semibold">
        Welcome, {user?.firstName || "Admin"}
      </h1>

      <div className="flex items-center gap-4">
        {loading && (
          <span className="text-sm text-gray-500">Loading...</span>
        )}

        <img
          src={user?.profilePhoto?.url || "https://i.pravatar.cc/40"}
          alt="profile"
          className="w-9 h-9 rounded-full object-cover border"
        />

        <button
          onClick={logout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

    </header>
  )
}

export default AdminTopbar
