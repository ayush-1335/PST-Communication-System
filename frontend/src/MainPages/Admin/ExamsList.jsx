import { useAdmin } from "../../context/AdminContext";

const ExamList = () => {
  const { exams, loading, refreshAdminData } = useAdmin();

  if (loading) return (
    <p className="text-slate-500 text-sm">Loading exams...</p>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Scheduled Exams</h2>
          <p className="text-xs text-slate-500 mt-0.5">{exams.length} exam(s) scheduled</p>
        </div>
        <button
          onClick={refreshAdminData}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors duration-150"
        >
          Refresh
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-10">
          No exams scheduled yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Standard</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Max Marks</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam) => (
                <tr key={exam._id} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{exam.title}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{exam.subject}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">Std {exam.standard}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{exam.maxMarks}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">
                    {new Date(exam.examDate).toLocaleDateString("en-GB").replaceAll("/", "-")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamList;