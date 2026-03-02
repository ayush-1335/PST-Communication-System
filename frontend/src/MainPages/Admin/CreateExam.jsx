import ExamForm from "./ExamForm";
import ExamList from "./ExamsList";

const CreateExam = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Create Exam</h2>
        <p className="text-xs text-slate-500 mb-6">Schedule a new exam for a standard.</p>
        <ExamForm />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <ExamList />
      </div>

    </div>
  );
};

export default CreateExam;