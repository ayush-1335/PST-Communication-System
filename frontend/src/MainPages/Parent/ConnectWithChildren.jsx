import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const ConnectWithChildren = () => {
  const { user, loading } = useAuth();
  const [studentCode, setStudentCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/users/parent/parent-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ studentCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong"); return; }
      setSuccess("Student linked successfully");
      setStudentCode("");
    } catch (error) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Welcome, {user?.firstName} 👋</h1>
        <p className="text-sm text-slate-500 mt-0.5">Link your child using their student code</p>
      </div>

      {/* Card */}
      <div className="max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        <h2 className="text-base font-semibold text-slate-900 mb-1">Connect With Student</h2>
        <p className="text-sm text-slate-500 mb-5">Enter the unique student code provided by the school.</p>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Student Code</label>
            <input
              type="text"
              placeholder="Enter student code"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-150"
          >
            Add Student
          </button>
        </form>

      </div>
    </div>
  );
};

export default ConnectWithChildren;