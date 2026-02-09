import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import { useAuth } from "./context/AuthContext"
import { ProtectedRoute } from "./Routes/ProtectedRoutes";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";

//Admin routes
import AdminDashboard from "./MainPages/Admin/AdminDashboard";
import Overview from "./MainPages/Admin/Overview"
import CreateUser from "./MainPages/Admin/CreateUser"
import Students from "./MainPages/Admin/Students"
import Parents from "./MainPages/Admin/Parents"
import Teachers from "./MainPages/Admin/Teachers"

//Teacher routes
import TeacherDashboard from "./MainPages/Teacher/TeacherDashboard";
import TeacherHome from "./MainPages/Teacher/TeacherHome";
import MyClasses from "./MainPages/Teacher/MyClasses";
import MyStudents from "./MainPages/Teacher/MyStudents";

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
            <Route path="overview" element={<Overview />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="parents" element={<Parents />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>

          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherHome />} />
            <Route path="classes" element={ <MyClasses /> } />
            <Route path="students" element={<MyStudents />} />
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
