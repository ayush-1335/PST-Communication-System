import React, { createContext, useContext, useEffect, useState } from "react";

const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);

      // Fetch Classes
      const classRes = await fetch(
        "http://localhost:5000/users/teacher/my-classes",
        {
          credentials: "include",
        }
      );

      const classData = await classRes.json();

    //   console.log("My Classes Teacher Context :", classData)

      if (!classRes.ok) {
        throw new Error(classData.message);
      }

      setClasses(classData.data);

      // Fetch Students (Class Teacher)
      const studentRes = await fetch(
        "http://localhost:5000/users/teacher/my-students",
        {
          credentials: "include",
        }
      );

      const studentData = await studentRes.json();

      // console.log("My Students Teacher Context :", studentData)

      if (!studentRes.ok) {
        throw new Error(studentData.message);
      }

      setStudents(studentData.data.students);
      setClassInfo({
        class: studentData.data.class,
        _id: studentData.data.classId
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  return (
    <TeacherContext.Provider value={{ classes, students, classInfo, loading, error, refreshTeacherData: fetchTeacherData, }}>
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacher = () => useContext(TeacherContext);
