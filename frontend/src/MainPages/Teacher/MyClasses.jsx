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

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading your classes...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        My Classes
      </h2>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {sortedClasses.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No classes assigned yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {sortedClasses.map((cls) => (
            <div
              key={cls._id}
              onClick={() => navigate(`/teacher/class/${cls._id}`)}
              className="border rounded-xl p-5 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold">
                Class {cls.standard}-{cls.section}
              </h3>

              <p className="mt-3 text-sm text-gray-600">
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
