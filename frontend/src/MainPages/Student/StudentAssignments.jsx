import { useStudent } from "../../context/StudentContext";

const StudentAssignments = () => {
  const { assignments, loading } = useStudent();

  const getStatusColor = (status) => {
    if (status === "completed") return "text-green-600";
    if (status === "overdue") return "text-red-600";
    return "text-yellow-600";
  };

  if (loading) {
    return <div className="p-4">Loading assignments...</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">My Assignments</h2>

      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments available</p>
      ) : (
        assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="border p-4 rounded mb-3 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{assignment.title}</h3>

              <p className="text-sm text-gray-500">
                Subject: {assignment.subject}
              </p>

              <p className="text-sm text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`font-semibold ${getStatusColor(
                assignment.status
              )}`}
            >
              {assignment.status.toUpperCase()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentAssignments;
