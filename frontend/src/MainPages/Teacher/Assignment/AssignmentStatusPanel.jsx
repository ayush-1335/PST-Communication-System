import { useEffect, useState } from "react";

const AssignmentStatusPanel = ({ assignmentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/users/teacher/assignment/${assignmentId}/status`,
        { credentials: "include" }
      );

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      fetchStatus();
    }
  }, [assignmentId]);

  const updateStatus = async (studentId) => {
    try {
      await fetch(
        `http://localhost:5000/users/teacher/assignment/${assignmentId}/mark-complete`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId }),
        }
      );

      fetchStatus(); // refresh after update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderStudents = (studentsList, type) =>
    studentsList.map((student) => (
      <div
        key={student._id}
        className="flex justify-between items-center p-2 border-b"
      >
        <span>
          {student.user.firstName} {student.user.lastName}
        </span>

        {type !== "completed" && (
          <button
            className="text-green-600 text-sm hover:underline"
            onClick={() => updateStatus(student._id)}
          >
            Mark Complete
          </button>
        )}
      </div>
    ));

  if (loading) {
    return <div className="p-4">Loading assignment status...</div>;
  }

  if (!data) {
    return (
      <div className="p-4 text-red-500">
        Failed to load assignment status
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">

      {/* Summary */}
      <div className="flex gap-6 mb-4 font-medium">
        <div>✅ Completed: {data.completedCount}</div>
        <div>⏳ Pending: {data.pendingCount}</div>
        <div>❌ Overdue: {data.overdueCount}</div>
      </div>

      {/* Completed */}
      <h4 className="font-semibold mt-4">Completed</h4>
      {data.completed.length > 0 ? (
        renderStudents(data.completed, "completed")
      ) : (
        <p className="text-gray-500 text-sm">No students completed yet</p>
      )}

      {/* Pending */}
      <h4 className="font-semibold mt-4">Pending</h4>
      {data.pending.length > 0 ? (
        renderStudents(data.pending, "pending")
      ) : (
        <p className="text-gray-500 text-sm">No pending students</p>
      )}

      {/* Overdue */}
      <h4 className="font-semibold mt-4">Overdue</h4>
      {data.overdue.length > 0 ? (
        renderStudents(data.overdue, "overdue")
      ) : (
        <p className="text-gray-500 text-sm">No overdue students</p>
      )}
    </div>
  );
};

export default AssignmentStatusPanel;
