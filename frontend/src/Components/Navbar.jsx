import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${
       isActive
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
          </div>

          {/* Auth Button */}
          <NavLink
            to="/login"
            className="bg-blue-600 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-blue-700"
          >
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
