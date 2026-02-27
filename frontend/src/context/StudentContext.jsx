import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch Attendance
      const attendanceRes = await fetch(
        "http://localhost:5000/users/student/view-attendance",
        { credentials: "include" }
      );
      const attendanceData = await attendanceRes.json();
      if (!attendanceRes.ok) {
        throw new Error(attendanceData.message);
      }
      setAttendance(attendanceData.data);

      // Fetch Assignments
      const assignmentRes = await fetch(
        "http://localhost:5000/users/student/assignments",
        { credentials: "include" }
      );
      const assignmentData = await assignmentRes.json();
      if (!assignmentRes.ok) {
        throw new Error(assignmentData.message);
      }
      setAssignments(assignmentData.data || []);

      // Fetch Exams
      const examRes = await fetch(
        "http://localhost:5000/users/student/exams",
        { credentials: "include" }
      );
      const examData = await examRes.json();
      if (!examRes.ok) {
        throw new Error(examData.message);
      }
      setExams(examData.data || []);

    } catch (err) {
      console.error("StudentContext error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "STUDENT") {
      fetchStudentData();
    }
  }, [user]);

  return (
    <StudentContext.Provider
      value={{
        attendance,
        assignments,
        exams,
        loading,
        error,
        fetchStudentData
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);