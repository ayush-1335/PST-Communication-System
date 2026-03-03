import { useNavigate } from "react-router-dom";
import { useTeacher } from "../../context/TeacherContext";

const MyClasses = () => {
  const { classes, loading, error } = useTeacher();
  const navigate = useNavigate();

  const sortedClasses = [...classes].sort((a, b) => {
    const stdDiff = Number(a.standard) - Number(b.standard);
    if (stdDiff !== 0) return stdDiff;
    return a.section.localeCompare(b.section);
  });

  if (loading) return (
    <div className="text-center py-10 text-slate-500 text-sm">Loading your classes...</div>
  );

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">My Classes</h2>
        <p className="text-sm text-slate-500 mt-0.5">{sortedClasses.length} class(es) assigned to you</p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>
      )}

      {sortedClasses.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-16 bg-white border border-slate-200 rounded-xl">
          No classes assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedClasses.map((cls) => (
            <div
              key={cls._id}
              onClick={() => navigate(`/teacher/class/${cls._id}`)}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all duration-150 group"
            >
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
                  Std {cls.standard}-{cls.section}
                </span>
                <span className="text-slate-300 group-hover:text-blue-400 text-lg transition-colors duration-150">→</span>
              </div>

              <h3 className="text-base font-semibold text-slate-800 mt-4">
                Class {cls.standard} — {cls.section}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Click to manage this class
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClasses;