import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ClassSubjectExams = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/users/teacher/class/${classId}/exams`,
        { credentials: "include" }
      );
      const result = await res.json();
      if (!res.ok) { console.error(result.message); return; }
      setExams(result.data);
      setClassName(result.class);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExams(); }, [classId]);

  if (loading) return (
    <div className="text-center py-10 text-slate-500 text-sm">Loading exams...</div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Exams for Class {className}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{exams.length} exam(s) scheduled</p>
        </div>
      </div>

      {/* Empty */}
      {exams.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl">
          No exams scheduled for this class.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Max Marks</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map((exam) => (
                <tr key={exam._id} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{exam.title}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{exam.subject}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{exam.maxMarks}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">
                    {new Date(exam.examDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => navigate(`/teacher/class/${classId}/add-marks/${exam._id}`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                    >
                      Enter Marks
                    </button>
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

export default ClassSubjectExams;