const statusStyles = {
  PRESENT: "bg-green-50 border-green-200 text-green-600",
  ABSENT: "bg-red-50 border-red-200 text-red-500",
  LEAVE: "bg-yellow-50 border-yellow-200 text-yellow-600",
};

const AttendanceRow = ({ index, student, status, onStatusChange, isEditable }) => {
  return (
    <tr className="hover:bg-slate-50 transition-colors duration-100">
      <td className="px-5 py-3.5 text-sm text-slate-500">{index + 1}</td>
      <td className="px-5 py-3.5 text-sm text-slate-700">{student.rollNumber || "—"}</td>
      <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
        {student.user?.firstName} {student.user?.lastName}
      </td>
      <td className="px-5 py-3.5">
        <select
          value={status}
          disabled={!isEditable}
          onChange={(e) => onStatusChange(student._id, e.target.value)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium outline-none cursor-pointer disabled:cursor-not-allowed transition-all duration-150 ${statusStyles[status] || statusStyles.PRESENT}`}
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
          <option value="LEAVE">Leave</option>
        </select>
      </td>
    </tr>
  );
};

export default AttendanceRow;