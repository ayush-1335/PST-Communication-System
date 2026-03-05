import { useEffect } from "react";
import { useParent } from "../../context/ParentContext";

const statusConfig = {
  PRESENT: { label: "Present", style: "bg-green-50 border-green-200 text-green-600" },
  ABSENT:  { label: "Absent",  style: "bg-red-50 border-red-200 text-red-500" },
  LEAVE:   { label: "Leave",   style: "bg-yellow-50 border-yellow-200 text-yellow-600" },
};

const ParentAttendance = ({ studentId }) => {
  const { attendance, fetchChildAttendance, loading } = useParent();

  useEffect(() => {
    if (studentId) fetchChildAttendance(studentId);
  }, [studentId]);

  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const absentCount  = attendance.filter((a) => a.status === "ABSENT").length;
  const leaveCount   = attendance.filter((a) => a.status === "LEAVE").length;

  if (loading) return (
    <div className="text-center py-10 text-slate-500 text-sm">Loading attendance...</div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Attendance</h2>
          <p className="text-sm text-slate-500 mt-0.5">{attendance.length} record(s) found</p>
        </div>

        {attendance.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-green-50 border border-green-200 text-green-600 text-xs font-medium">Present: {presentCount}</span>
            <span className="px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-500 text-xs font-medium">Absent: {absentCount}</span>
            <span className="px-2.5 py-1 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">Leave: {leaveCount}</span>
          </div>
        )}
      </div>

      {/* Empty */}
      {attendance.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl">
          No attendance records found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendance.map((item, index) => {
                const config = statusConfig[item.status] || { label: "—", style: "bg-slate-50 border-slate-200 text-slate-500" };
                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors duration-100">
                    <td className="px-5 py-3.5 text-sm text-slate-700">
                      {new Date(item.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${config.style}`}>
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ParentAttendance;