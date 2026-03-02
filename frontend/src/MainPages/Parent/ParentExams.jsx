import { useParent } from "../../context/ParentContext";
import { useEffect } from "react";

const ParentExams = ({ studentId }) => {
  const { exams, fetchChildExams, loading } = useParent();

  useEffect(() => {
    if (studentId) {
      fetchChildExams(studentId);
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-blue-600 text-lg font-semibold animate-pulse">
          Loading exams...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Upcoming Exams
      </h2>

      {exams.length === 0 ? (
        <div className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg">
          No upcoming exams available.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition duration-300"
            >
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {exam.title}
              </p>

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Subject:</span>{" "}
                  {exam.subject}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Date:</span>{" "}
                  {new Date(exam.examDate).toLocaleDateString("en-gb")}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Max Marks:</span>{" "}
                  {exam.maxMarks}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentExams;