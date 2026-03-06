import { useEffect, useState } from "react";

const StudentRow = ({ student, type, onMarkComplete }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-700">
      {student.user.firstName} {student.user.lastName}
    </span>
    {type !== "completed" && (
      <button
        onClick={() => onMarkComplete(student._id)}
        className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-green-200 hover:text-green-600 hover:bg-green-50 transition-all duration-150"
      >
        Mark Complete
      </button>
    )}
  </div>
);

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
    if (assignmentId) fetchStatus();
  }, [assignmentId]);

  const updateStatus = async (studentId) => {
    try {
      await fetch(
        `http://localhost:5000/users/teacher/assignment/${assignmentId}/mark-complete`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId }),
        }
      );
      fetchStatus();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return (
    <div className="text-center py-6 text-slate-500 text-sm">Loading assignment status...</div>
  );

  if (!data) return (
    <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">
      Failed to load assignment status.
    </div>
  );

  const sections = [
    { key: "completed", label: "Completed", style: "bg-green-50 border-green-200 text-green-600", count: data.completedCount },
    { key: "pending",   label: "Pending",   style: "bg-yellow-50 border-yellow-200 text-yellow-600", count: data.pendingCount },
    { key: "overdue",   label: "Overdue",   style: "bg-red-50 border-red-200 text-red-500", count: data.overdueCount },
  ];

  return (
    <div className="space-y-5">

      {/* Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        {sections.map((s) => (
          <span key={s.key} className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${s.style}`}>
            {s.label}: {s.count}
          </span>
        ))}
      </div>

      {/* Student Lists */}
      {sections.map((s) => (
        <div key={s.key}>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">{s.label}</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4">
            {data[s.key].length > 0 ? (
              data[s.key].map((student) => (
                <StudentRow
                  key={student._id}
                  student={student}
                  type={s.key}
                  onMarkComplete={updateStatus}
                />
              ))
            ) : (
              <p className="text-sm text-slate-400 py-3">No {s.label.toLowerCase()} students</p>
            )}
          </div>
        </div>
      ))}

    </div>
  );
};

export default AssignmentStatusPanel;