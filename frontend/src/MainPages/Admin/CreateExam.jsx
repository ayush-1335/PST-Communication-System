import ExamForm from "./ExamForm";
import ExamList from "./ExamsList";

const CreateExam = () => {

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

      <h2 className="text-2xl font-semibold mb-6">
        Create Exam
      </h2>

      <ExamForm />

      <ExamList />

    </div>
  );
};

export default CreateExam;