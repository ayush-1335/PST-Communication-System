import { useEffect, useState } from "react";
import { useTeacher } from "../../../context/TeacherContext";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceTable from "./AttendanceTable";

const MarkAttendance = () => {
  const { students, classInfo, loading: teacherLoading } = useTeacher();

  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  const academicYear = "2026-2027";

  // 🔹 Fetch attendance when date changes
  useEffect(() => {

    if (!selectedDate || !classInfo || students.length === 0) {
      return
    };

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const response = await fetch(
          `http://localhost:5000/users/teacher/attendance?date=${selectedDate}&academicYear=${academicYear}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        // ✅ If attendance exists → Edit mode
        if (data.data && data.data.records.length > 0) {
          setAttendanceRecords(
            data.data.records.map((rec) => ({
              student: rec.student._id,
              status: rec.status,
            }))
          );
          setIsEditMode(true);
          setIsEditable(data.data.isEditable);
        } else {
          const defaultRecords = students.map((student) => ({
            student: student._id,
            status: "PRESENT",
          }));

          setAttendanceRecords(defaultRecords);
          setIsEditMode(false);
          setIsEditable(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedDate, classInfo, students]);

  // 🔹 Change status
  const handleStatusChange = (studentId, newStatus) => {
    if (!isEditable) return;

    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.student === studentId
          ? { ...record, status: newStatus }
          : record
      )
    );
  };

  // 🔹 Submit
  const handleSubmit = async () => {
    if (!selectedDate) {
      setError("Please select date");
      return;
    }

    if (!isEditable) {
      setError("Attendance editing window has expired.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const payload = {
        classId: classInfo._id,
        date: selectedDate,
        academicYear,
        records: attendanceRecords,
      };

      // console.log("payload :", payload)

      const response = await fetch("http://localhost:5000/users/teacher/attendance/mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(
        isEditMode
          ? "Attendance updated successfully"
          : "Attendance marked successfully"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (teacherLoading) return <p>Loading class information...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {classInfo?.className} - Attendance
      </h1>

      <AttendanceHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSubmit={handleSubmit}
        loading={loading}
        isEditMode={isEditMode}
        isEditable={isEditable}
      />

      {error && (
        <p className="mt-4 text-red-600 font-medium">{error}</p>
      )}

      {message && (
        <p className="mt-4 text-green-600 font-medium">{message}</p>
      )}

      {!loading && attendanceRecords.length > 0 && (
        <AttendanceTable
          students={students}
          attendanceRecords={attendanceRecords}
          onStatusChange={handleStatusChange}
          isEditable={isEditable}
        />
      )}
    </div>
  );
};

export default MarkAttendance;
