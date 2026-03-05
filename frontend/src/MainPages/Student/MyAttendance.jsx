import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";

const statusConfig = {
  PRESENT: { label: "Present", style: "bg-green-50 border-green-200 text-green-600" },
  ABSENT:  { label: "Absent",  style: "bg-red-50 border-red-200 text-red-500" },
  LEAVE:   { label: "Leave",   style: "bg-yellow-50 border-yellow-200 text-yellow-600" },
};

const MyAttendance = () => {
  const { user } = useAuth();
  const { attendance, loading } = useStudent();

  if (loading) return (
    <div className="text-center py-10 text-slate-500 text-sm">Loading attendance...</div>
  );

  if (!attendance || !attendance.records || attendance.records.length === 0) return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-1">My Attendance</h2>
      <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl mt-4">
        No attendance records found.
      </div>
    </div>
  );

  const { summary, records } = attendance;

  const percentage = Number(summary.percentage);
  const percentageColor = percentage >= 75 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-500";

  return (
    <div className="space-y-5">

      {/* Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">My Attendance</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {user?.firstName} {user?.lastName} &mdash; {records[0]?.className}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${percentageColor}`}>{summary.percentage}%</p>
            <p className="text-xs text-slate-400 mt-0.5">Attendance</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
            Total Days: <span className="font-semibold">{summary.totalDays}</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-600 text-xs font-medium">
            Present: {summary.present}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs font-medium">
            Absent: {summary.absent}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">
            Leave: {summary.leave}
          </span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Attendance Records</h3>
          <p className="text-xs text-slate-500 mt-0.5">{records.length} records total</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Academic Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record) => {
                const config = statusConfig[record.status] || { label: record.status, style: "bg-slate-50 border-slate-200 text-slate-500" };
                return (
                  <tr key={record.attendanceId} className="hover:bg-slate-50 transition-colors duration-100">
                    <td className="px-5 py-3.5 text-sm text-slate-700">
                      {new Date(record.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${config.style}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{record.academicYear}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MyAttendance;