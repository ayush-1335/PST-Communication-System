import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClassSubjectExams = () => {
  const { classId } = useParams();

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

      if (!res.ok) {
        console.error(result.message);
        return;
      }

      setExams(result.data);
      setClassName(result.class);

    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [classId]);

  if (loading) {
    return <div className="p-6">Loading exams...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">

      <h2 className="text-xl font-semibold mb-4">
        Exams for Class {className}
      </h2>

      {exams.length === 0 ? (
        <p className="text-gray-500">No exams scheduled</p>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{exam.title}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(exam.examDate).toLocaleDateString()}
                </p>
              </div>

              <button
                className="text-blue-600 text-sm"
              >
                Enter Marks
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassSubjectExams;