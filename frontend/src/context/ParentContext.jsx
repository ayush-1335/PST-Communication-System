import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ParentContext = createContext();

export const ParentProvider = ({ children }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([])

  const fetchChildren = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/users/parent/children",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      // console.log("ChildrenList in Parent Context:", data.data)

      setChildrenList(data.data);

      // default select first child
      if (data.data.length > 0) {
        setSelectedChild(data.data[0]);
      }

    } catch (error) {
      console.log("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildAttendance = async (studentId) => {
    try {
      if (!studentId) return;
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/users/parent/student/${studentId}/attendance`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setAttendance(data.data);

    } catch (error) {
      console.error("Attendance fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildExams = async (studentId) => {
  try {
    if (!studentId) return;
      setLoading(true);

    const res = await fetch(
      `http://localhost:5000/users/parent/student/${studentId}/exams`,
      {
        credentials: "include"
      }
    );

    const data = await res.json();

    setExams(data.data);

  } catch (error) {
    console.log("Exam fetch error:", error);
  }
};

  useEffect(() => {
    if (selectedChild?._id) {
      fetchChildAttendance(selectedChild._id);
      fetchChildExams(selectedChild._id);
    }
  }, [selectedChild]);

  useEffect(() => {
    if (user?.role === "PARENT") {
      fetchChildren();
      fetchChildAttendance();
      fetchChildExams();
    }
  }, [user]);

  return (
    <ParentContext.Provider
      value={{
        loading,
        childrenList,
        selectedChild,
        setSelectedChild,
        fetchChildren,
        attendance,
        fetchChildAttendance,
        exams,
        fetchChildExams
      }}
    >
      {children}
    </ParentContext.Provider>
  );
};

export const useParent = () => useContext(ParentContext);