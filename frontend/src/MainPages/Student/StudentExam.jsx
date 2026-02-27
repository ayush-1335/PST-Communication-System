import { useStudent } from "../../context/StudentContext";

const StudentExams = () => {
  const { exams, loading } = useStudent();

  if (loading) {
    return <div className="p-6">Loading exams...</div>;
  }

  if (!exams.length) {
    return <div className="p-6">No exams scheduled</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow">

      <h2 className="text-xl font-semibold mb-4">
        Upcoming Exams
      </h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Exam Title</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Total Marks</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id}>
              <td className="p-2 border">{exam.subject}</td>
              <td className="p-2 border">{exam.title}</td>
              <td className="p-2 border">
                {new Date(exam.examDate).toLocaleDateString("en-GB")}
              </td>
              <td className="p-2 border">{exam.maxMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default StudentExams;