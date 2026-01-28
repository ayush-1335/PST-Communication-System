import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import {useAuth} from "./context/AuthContext"
import { PublicRoute } from "./Routes/PublicRoutes";
import { ProtectedRoute } from "./Routes/ProtectedRoutes";
import StudentDashboard from "./MainPages/StudentDashboard"
import AdminDashboard from "./MainPages/AdminDashboard"
import ParentDashboard from "./MainPages/ParentDashboard"
import TeacherDashboard from "./MainPages/TeacherDashboard"

function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
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
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["TEACHER"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={["PARENT"]}>
              <ParentDashboard />
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
