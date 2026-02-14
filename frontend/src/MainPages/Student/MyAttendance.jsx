import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";

const MyAttendance = () => {
  const { user } = useAuth();
  const { attendance, loading } = useStudent();

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">My Attendance</h2>
        <p>Loading attendance...</p>
      </div>
    );
  }

  if (!attendance || !attendance.records || attendance.records.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">My Attendance</h2>
        <p>No attendance records found.</p>
      </div>
    );
  }

  const { summary, records } = attendance;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Attendance</h2>

      {/* 👤 Student Info + Summary */}
      <div className="mb-6 bg-gray-100 p-4 rounded shadow">
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Class:</strong> {records[0]?.className}</p>
        <hr className="my-3" />
        <p><strong>Total Days:</strong> {summary.totalDays}</p>
        <p><strong>Present:</strong> {summary.present}</p>
        <p><strong>Absent:</strong> {summary.absent}</p>
        <p><strong>Leave:</strong> {summary.leave}</p>
        <p><strong>Attendance %:</strong> {summary.percentage}%</p>
      </div>

      {/* 📅 Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Academic Year</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.attendanceId}>
                <td className="border p-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td
                  className={`border p-2 font-semibold ${
                    record.status === "PRESENT"
                      ? "text-green-600"
                      : record.status === "ABSENT"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {record.status}
                </td>
                <td className="border p-2">
                  {record.academicYear}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAttendance;
