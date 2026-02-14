import AttendanceRow from "./AttendanceRow";

const AttendanceTable = ({
  students,
  attendanceRecords,
  onStatusChange,
  isEditable
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">#</th>
            <th className="p-3 border">Roll No</th>
            <th className="p-3 border">Student Name</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => {
            const record = attendanceRecords.find(
              (r) => r.student === student._id
            );

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
  );
};

export default AttendanceTable;
