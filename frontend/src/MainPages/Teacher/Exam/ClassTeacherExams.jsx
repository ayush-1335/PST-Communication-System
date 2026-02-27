import { useEffect } from "react";
import { useTeacher } from "../../../context/TeacherContext";

const ClassTeacherExams = () => {
  const { classExams, loading } = useTeacher();

  

  if (loading) {
    return <div className="p-6">Loading exams...</div>;
  }

  if (!classExams || classExams.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No exams scheduled for your class.
      </div>
    );
  }

  return (
    <div className="p-6">

      <h2 className="text-xl font-semibold mb-4">
        Class Exams
      </h2>

      <div className="bg-white rounded shadow">

        {classExams.map((exam) => (
          <div
            key={exam._id}
            className="flex justify-between items-center border-b p-4 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{exam.title}</p>

              <p className="text-sm text-gray-500">
                Subject: {exam.subject}
              </p>

              <p className="text-sm text-gray-500">
                Standard: {exam.standard}
              </p>

              <p className="text-sm text-gray-500">
                Max Marks: {exam.maxMarks}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              {new Date(exam.examDate).toLocaleDateString("en-GB")}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default ClassTeacherExams;