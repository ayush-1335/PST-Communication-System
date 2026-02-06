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
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="text-white text-xl font-bold">
            MyApp
          </div>

          {/* Links */}
          <div className="flex space-x-5">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>

            <NavLink to="/services" className={linkClass}>
              Services
            </NavLink>

            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
            
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            

          </div>

          {/* Auth Button */}
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                

                <NavLink
                  to="/login"
                  className="bg-blue-600 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-blue-700"
                >
                  Login
                </NavLink>
              </>
            ) : (
              <>
                {/* Profile Button */}
                <NavLink
                  to={"/profile"  }
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition"
                >
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/40"}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  />
                  <span>{user?.firstName || "Profile"}</span>
                </NavLink>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
