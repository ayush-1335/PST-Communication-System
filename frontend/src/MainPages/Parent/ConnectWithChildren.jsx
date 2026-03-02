import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const ConnectWithChildren = () => {
  const { user, loading } = useAuth();

  const [studentCode, setStudentCode] = useState("");
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/users/parent/parent-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ studentCode }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setError("");
      setStudentCode("");

    } catch (error) {
      console.log("Error in connect student-parent:", error);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.firstName} 👋
        </h1>

        <p className="text-gray-600">
          Link your child using the student code
        </p>
      </div>

      {/* Card */}
      <div className="max-w-md rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-lg font-semibold">
          Connect With Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Enter Student Code"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 transition"
          >
            Add Student
          </button>

        </form>
      </div>
    </div>
  );
};

export default ConnectWithChildren;