import AttendanceRow from "./AttendanceRow";

const AttendanceTable = ({ students, attendanceRecords, onStatusChange, isEditable }) => {

  const presentCount = attendanceRecords.filter((r) => r.status === "PRESENT").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "ABSENT").length;
  const leaveCount = attendanceRecords.filter((r) => r.status === "LEAVE").length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

      {/* Summary */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
        <span className="px-2.5 py-1 rounded-md bg-green-50 border border-green-200 text-green-600 text-xs font-medium">Present: {presentCount}</span>
        <span className="px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-500 text-xs font-medium">Absent: {absentCount}</span>
        <span className="px-2.5 py-1 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">Leave: {leaveCount}</span>
        <span className="ml-auto text-xs text-slate-400">{students.length} students</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Roll No</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Student Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, index) => {
              const record = attendanceRecords.find((r) => r.student === student._id);
              return (
                <AttendanceRow
                  key={student._id}
                  index={index}
                  student={student}
                  status={record?.status || "PRESENT"}
                  onStatusChange={onStatusChange}
                  isEditable={isEditable}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;