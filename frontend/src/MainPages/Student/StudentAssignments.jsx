import { useStudent } from "../../context/StudentContext";

const statusConfig = {
  completed: { label: "Completed", style: "bg-green-50 border-green-200 text-green-600" },
  overdue:   { label: "Overdue",   style: "bg-red-50 border-red-200 text-red-500" },
  pending:   { label: "Pending",   style: "bg-yellow-50 border-yellow-200 text-yellow-600" },
};

const StudentAssignments = () => {
  const { assignments, loading } = useStudent();

  if (loading) return (
    <div className="text-center py-10 text-slate-500 text-sm">Loading assignments...</div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">My Assignments</h2>
        <p className="text-sm text-slate-500 mt-0.5">{assignments.length} assignment(s) found</p>
      </div>

      {/* Empty */}
      {assignments.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl">
          No assignments available.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Due Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((assignment) => {
                const config = statusConfig[assignment.status] || { label: assignment.status, style: "bg-slate-50 border-slate-200 text-slate-500" };
                return (
                  <tr key={assignment._id} className="hover:bg-slate-50 transition-colors duration-100">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{assignment.title}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{assignment.subject}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">
                      {new Date(assignment.dueDate).toLocaleDateString("en-GB")}
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

export default StudentAssignments;