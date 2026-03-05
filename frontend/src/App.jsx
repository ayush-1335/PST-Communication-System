import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import { useAuth } from "./context/AuthContext"
import { ProtectedRoute } from "./Routes/ProtectedRoutes";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import About from "./Components/About";
import Services from "./Components/Services";
import Contact from "./Components/Contact";

//Admin routes
import AdminDashboard from "./MainPages/Admin/AdminDashboard";
import Overview from "./MainPages/Admin/Overview"
import CreateUser from "./MainPages/Admin/CreateUser"
import Students from "./MainPages/Admin/Students"
import Parents from "./MainPages/Admin/Parents"
import Teachers from "./MainPages/Admin/Teachers"
import AssignRelation from "./MainPages/Admin/AssignRelation"
import { AdminProvider } from "./context/AdminContext"

//Teacher routes
import TeacherDashboard from "./MainPages/Teacher/TeacherDashboard";
import TeacherHome from "./MainPages/Teacher/TeacherHome";
import MyClasses from "./MainPages/Teacher/MyClasses";
import MyStudents from "./MainPages/Teacher/MyStudents";
import { TeacherProvider } from "./context/TeacherContext";
import MarkAttendance from "./MainPages/Teacher/Attendance/MarkAttendance";
import ClassDashboard from "./MainPages/Teacher/ClassDashboard";
import CreateAssignment from "./MainPages/Teacher/Assignment/CreateAssignment";
import ViewAssignments from "./MainPages/Teacher/Assignment/ViewAssignment"

//Student routes
import StudentDashboard from "./MainPages/Student/StudentDashboard";
import StudentHome from "./MainPages/Student/StudentHome";
import MyAttendance from "./MainPages/Student/MyAttendance";
import { StudentProvider } from "./context/StudentContext";
import StudentAssignments from "./MainPages/Student/StudentAssignments";
import CreateExam from "./MainPages/Admin/CreateExam";
import ClassTeacherExams from "./MainPages/Teacher/Exam/ClassTeacherExams";
import ClassSubjectExams from "./MainPages/Teacher/Exam/ClassSubjectExam";
import StudentExams from "./MainPages/Student/StudentExam";

//Parent routes
import ParentDashboard from "./MainPages/Parent/ParentDashboard";
import ParentHome from "./MainPages/Parent/ParentHome";
import ConnectWithChildren from "./MainPages/Parent/ConnectWithChildren";
import { ParentProvider, useParent } from "./context/ParentContext";
import ParentAttendance from "./MainPages/Parent/ParentAttendance";
import ParentExams from "./MainPages/Parent/ParentExams";

function App() {

  const { user } = useAuth()
  const { selectedChild } = useParent()
  // console.log(selectedChild)

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

          //Admin routes
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminProvider>
                  <AdminDashboard />;
                </AdminProvider>
              </ProtectedRoute>
            }
          >
            <Route path="overview" index element={<Overview />} />
            <Route path="assign-relation" element={<AssignRelation />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="parents" element={<Parents />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="exams" element={<CreateExam />} />
          </Route>

          // Teacher routes
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <TeacherProvider>
                  <TeacherDashboard />
                </TeacherProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherHome />} />
            <Route path="classes" element={<MyClasses />} />

            <Route path="class/:classId" element={<ClassDashboard />}>
              {/* <Route index element={<ClassOverview />} /> */}
              <Route path="create-assignment" element={<CreateAssignment />} />
              <Route path="assignments" element={<ViewAssignments />} />
              <Route path="schedule-exam" element={<ClassSubjectExams /> } />    // Todo
            </Route>

            <Route path="students" element={<MyStudents />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="exams" element={<ClassTeacherExams />} />
          </Route>

          // Student routes
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentProvider>
                  <StudentDashboard />
                </StudentProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentHome />} />
            <Route path="view-attendance" element={<MyAttendance />} />
            <Route path="view-assignment" element={<StudentAssignments />} />
            <Route path="view-exam" element={<StudentExams />} />
          </Route>

          // Parent routes
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={["PARENT"]}>
                <ParentProvider>
                  <ParentDashboard />
                </ParentProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<ParentHome />} />
            <Route path="connect-child" element={<ConnectWithChildren />} />
            <Route path="attendance" element={ <ParentAttendance studentId={selectedChild?._id}/> } />
            <Route path="exams" element={ <ParentExams studentId={selectedChild?._id}/> } />

          </Route>



          {/* Default route */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
