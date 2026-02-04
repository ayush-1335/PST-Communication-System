import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { useAuth } from "./context/AuthContext"
import { PublicRoute } from "./Routes/PublicRoutes";
import { ProtectedRoute } from "./Routes/ProtectedRoutes";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import AdminDashboard from "./Admin/AdminDashboard";
import Overview from "./MainPages/Admin/Overview"
import CreateUser from "./MainPages/Admin/CreateUser"
import Students from "./MainPages/Admin/Students"
import Parents from "./MainPages/Admin/Parents"
import Teachers from "./MainPages/Admin/Teachers"

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
              user ? <Navigate to="/dashboard" /> : <Login />
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

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            {/* <Route path="users" element={<AdminUsers />} /> */}
            <Route path="create-user" element={<CreateUser />} />
            <Route path="parents" element={<Parents />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>



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
