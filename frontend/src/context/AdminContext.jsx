import React, { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch students
      const studentRes = await fetch(
        "http://localhost:5000/users/admin/students",
        { credentials: "include" }
      );
      const studentData = await studentRes.json();
      if (!studentRes.ok) throw new Error(studentData.message);
      setStudents(studentData.data || []);

      // Fetch parents
      const parentRes = await fetch(
        "http://localhost:5000/users/admin/parents",
        { credentials: "include" }
      );
      const parentData = await parentRes.json();
      if (!parentRes.ok) throw new Error(parentData.message);
      setParents(parentData.data || []);

      // Fetch teachers
      const teacherRes = await fetch(
        "http://localhost:5000/users/admin/teachers",
        { credentials: "include" }
      );
      const teacherData = await teacherRes.json();
      if (!teacherRes.ok) throw new Error(teacherData.message);
      setTeachers(teacherData.data || []);

      // Fetch classes
      const classRes = await fetch(
        "http://localhost:5000/users/admin/class-info",
        { credentials: "include" }
      );
      const classData = await classRes.json();
      if (!classRes.ok) throw new Error(classData.message);
      setClasses(classData.data || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        students,
        parents,
        teachers,
        classes,
        loading,
        error,
        refreshAdminData: fetchAdminData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
