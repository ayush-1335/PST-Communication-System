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

  useEffect(() => {
    if (!selectedDate || !classInfo || students.length === 0) return;

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const response = await fetch(
          `http://localhost:5000/users/teacher/attendance?date=${selectedDate}&academicYear=${academicYear}`,
          { credentials: "include" }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        if (data.data && data.data.records.length > 0) {
          setAttendanceRecords(data.data.records.map((rec) => ({ student: rec.student._id, status: rec.status })));
          setIsEditMode(true);
          setIsEditable(data.data.isEditable);
        } else {
          setAttendanceRecords(students.map((student) => ({ student: student._id, status: "PRESENT" })));
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

  const handleStatusChange = (studentId, newStatus) => {
    if (!isEditable) return;
    setAttendanceRecords((prev) =>
      prev.map((record) => record.student === studentId ? { ...record, status: newStatus } : record)
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate) { setError("Please select date"); return; }
    if (!isEditable) { setError("Attendance editing window has expired."); return; }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch("http://localhost:5000/users/teacher/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId: classInfo._id, date: selectedDate, academicYear, records: attendanceRecords }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(isEditMode ? "Attendance updated successfully" : "Attendance marked successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (teacherLoading) return <p className="text-slate-500 text-sm p-6">Loading class information...</p>;

  return (
    <div className="space-y-5">

      <div>
        <h1 className="text-base font-semibold text-slate-900">{classInfo?.className} — Attendance</h1>
        <p className="text-sm text-slate-500 mt-0.5">Mark or update daily attendance for your class</p>
      </div>

      <AttendanceHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onSubmit={handleSubmit}
        loading={loading}
        isEditMode={isEditMode}
        isEditable={isEditable}
      />

      {error && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
      {message && <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">{message}</div>}

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