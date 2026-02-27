import { useState } from "react";

const ExamForm = () => {

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [standard, setStandard] = useState("");
  const [examDate, setExamDate] = useState("");
  const [maxMarks, setMaxMarks] = useState()
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

      const res = await fetch(
        "http://localhost:5000/users/admin/create-exam",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            subject,
            standard,
            examDate,maxMarks
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      alert("Exam created successfully ✅");

      setTitle("");
      setSubject("");
      setStandard("");
      setExamDate("");
      setMaxMarks(0)

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded">
          {error}
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Subject */}
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Standard */}
      <select
        value={standard}
        onChange={(e) => setStandard(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Standard</option>
        {[...Array(12)].map((_, i) => (
          <option key={i+1} value={String(i+1)}>
            Standard {i+1}
          </option>
        ))}
      </select>
    
      {/* Max Marks */}
      <input
        type="number"
        placeholder="Max Marks"
        value={maxMarks}
        onChange={(e) => setMaxMarks(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Exam Date */}
      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Creating..." : "Create Exam"}
      </button>

    </form>
  );
};

export default ExamForm;