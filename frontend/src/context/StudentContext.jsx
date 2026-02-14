import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { user } = useAuth();   // ✅ get logged-in user
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/users/student/view-attendance",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        setAttendance(data.data);
      }
    } catch (error) {
      console.log("Attendance error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "STUDENT") {
      fetchAttendance();
    }
  }, [user]);

  return (
    <StudentContext.Provider
      value={{
        attendance,
        loading,
        fetchAttendance,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
