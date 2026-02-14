const AttendanceRow = ({
  index,
  student,
  status,
  onStatusChange,
  isEditable
}) => {
  return (
    
    <tr className="hover:bg-gray-50 transition">
      <td className="p-3 border">{index + 1}</td>

      <td className="p-3 border">
        {student.rollNumber || "-"}
      </td>

      <td className="p-3 border">
        {`${student.user?.firstName} ${student.user?.lastName} ` || "Unknown"}
      </td>

      <td className="p-3 border">
        <select
          value={status}
          disabled={!isEditable}
          onChange={(e) =>
            onStatusChange(student._id, e.target.value)
          }
          className="border rounded-md px-2 py-1"
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
