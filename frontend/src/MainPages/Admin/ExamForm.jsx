import { useState } from "react";

const ExamForm = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [standard, setStandard] = useState("");
  const [examDate, setExamDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !subject || !standard || !examDate || !maxMarks) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/users/admin/create-exam", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, standard, examDate, maxMarks }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert("Exam created successfully ✅");
      setTitle("");
      setSubject("");
      setStandard("");
      setExamDate("");
      setMaxMarks("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Exam Title</label>
          <input
            type="text"
            placeholder="e.g. Mid-Term Exam"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
          <input
            type="text"
            placeholder="e.g. Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Standard</label>
          <select
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            className={inputClass + " cursor-pointer"}
          >
            <option value="">Select Standard</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>Standard {i + 1}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Max Marks</label>
          <input
            type="number"
            placeholder="e.g. 100"
            value={maxMarks}
            onChange={(e) => setMaxMarks(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Exam Date</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors duration-150"
        >
          {loading ? "Creating..." : "Create Exam"}
        </button>
      </div>

    </form>
  );
};

export default ExamForm;