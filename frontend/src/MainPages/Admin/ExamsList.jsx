import { useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";

const ExamList = () => {

  const { exams, loading, refreshAdminData } = useAdmin();

  

//   useEffect(() => {
//     refreshAdminData();
//   }, []);

  if (loading) return <div>Loading exams...</div>;

  return (
    <div>

      <h2>Scheduled Exams</h2>

      {exams.length !==0 ? exams.map((exam) => (
        <div key={exam._id}>
          {exam.title} - {exam.subject} - {exam.standard} - {new Date(exam.examDate).toLocaleDateString('en-GB').replaceAll("/", "-")}
        </div>
      )) : "There no any exam sheduled"}

    </div>
  );
};

export default ExamList;