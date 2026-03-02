import { useEffect } from "react";
import { useParent } from "../../context/ParentContext";

const ParentAttendance = ({ studentId }) => {

  const { attendance, fetchChildAttendance, loading } = useParent();

  useEffect(() => {
    if (studentId) {
      fetchChildAttendance(studentId);
    }
  }, [studentId]);

  if (loading) {
    return <div>Loading attendance...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        Attendance
      </h2>

      {attendance.length === 0 ? (
        <p className="text-gray-500">
          No attendance found
        </p>
      ) : (
        <table className="w-full border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">
                  {new Date(item.date).toLocaleDateString("en-gb")}
                </td>

                <td className="p-2 border">
                  {item.status === "PRESENT"
                    ? "✅ Present"
                    : item.status === "ABSENT"
                      ? "❌ Absent"
                      : item.status === "LEAVE"
                        ? "🟡 Leave"
                        : "—"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
};

export default ParentAttendance;