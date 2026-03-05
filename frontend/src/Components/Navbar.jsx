import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-blue-500/15 text-blue-400"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-white/[0.07] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="/" className="text-white text-[17px] font-semibold tracking-tight shrink-0">
          Smart<span className="text-blue-400">EduNet</span>
        </a>

        {/* Links */}
        <div className="flex items-center gap-0.5">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!user ? (
            <NavLink
              to="/login"
              className="px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-150"
            >
              Login
            </NavLink>
          ) : (
            <>
              {/* Profile */}
              <NavLink
                to="/profile"
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/5 border border-white/[0.08] text-gray-300 hover:bg-white/10 hover:border-white/15 hover:text-white text-sm font-medium transition-all duration-150"
              >
                <img
                  src={user?.avatar || "https://i.pravatar.cc/40"}
                  alt="profile"
                  className="w-7 h-7 rounded-full object-cover border border-white/15"
                />
                <span>{user?.firstName || "Profile"}</span>
              </NavLink>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/[0.07] text-sm font-medium transition-all duration-150"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;