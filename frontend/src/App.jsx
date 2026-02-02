import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { useAuth } from "./context/AuthContext"
import { PublicRoute } from "./Routes/PublicRoutes";
import { ProtectedRoute } from "./Routes/ProtectedRoutes";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";

function App() {

  const { user } = useAuth()

  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route
            path="/login"
            element={
              // <PublicRoute>
                <Login />
              // </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* ---------- Role Based Routes ---------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={[`${user?.role}`]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/" />} />
          <Route path="/about" element={<Navigate to="/about" />} />
          <Route path="/services" element={<Navigate to="/services" />} />
          <Route path="/contact" element={<Navigate to="/contact" />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
