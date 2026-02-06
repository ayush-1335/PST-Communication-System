import React, { useEffect, useState } from "react";

const CLASSES = [1,2,3,4,5,6,7,8,9,10,11,12];
const SECTIONS = ["A", "B", "C", "D"];

function AssignTeacherSection() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assignments, setAssignments] = useState([
    { teacherId: "", standard: "", section: "" },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/teachers", {
          credentials: "include",
        });
        const data = await res.json();
        setTeachers(data.data || []);
      } catch {
        setError("Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const addRow = () => {
    setAssignments([
      ...assignments,
      { teacherId: "", standard: "", section: "" },
    ]);
  };

  const removeRow = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleAssignAll = async () => {
    setError("");
    setSuccess("");

    const payload = assignments.filter(
      (a) => a.teacherId && a.standard && a.section
    );

    if (!payload.length) {
      setError("Please fill at least one assignment");
      return;
    }

    console.log("BULK PAYLOAD:", payload);
    setSuccess("Teachers assigned successfully");
  };

  if (loading)
    return (
      <div className="flex justify-center py-10 text-gray-500">
        Loading teachers...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Assign Teachers to Sections
      </h2>

      {/* Alerts */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-green-600">
          {success}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-4">
        {assignments.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            {/* Teacher */}
            <select
              value={row.teacherId}
              onChange={(e) =>
                handleChange(index, "teacherId", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.user?.firstName} {t.user?.lastName}
                </option>
              ))}
            </select>

            {/* Class */}
            <select
              value={row.standard}
              onChange={(e) =>
                handleChange(index, "standard", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Class</option>
              {CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            {/* Section */}
            <select
              value={row.section}
              onChange={(e) =>
                handleChange(index, "section", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Section</option>
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            {/* Remove */}
            <div className="flex justify-end">
              {assignments.length > 1 && (
                <button
                  onClick={() => removeRow(index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 transition"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={addRow}
          className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200 transition"
        >
          + Add Row
        </button>

        <button
          onClick={handleAssignAll}
          className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 transition"
        >
          Assign All
        </button>
      </div>
    </div>
  );
}

export default AssignTeacherSection;
