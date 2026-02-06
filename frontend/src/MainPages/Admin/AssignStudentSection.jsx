import React, { useEffect, useState } from "react";

const SECTIONS = ["A", "B", "C", "D"];

function AssignStudentSection() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/students", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();

        // console.log("Section :",data.data)

        const studentsWithMeta = (data.data || []).map((s) => ({
          ...s,
          originalSection: s.section || "",
        }));

        setStudents(studentsWithMeta);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSectionChange = (id, section) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, section } : s))
    );
  };

  const handleUpdateAll = async () => {
    const payload = students
      .filter((s) => s.section !== s.originalSection && s.section)
      .map((s) => ({
        studentId: s._id,
        section: s.section,
      }));

    setSaving(true);

    // console.log(payload)

    try {
      const res = await fetch("http://localhost:8000/users/admin/assign-sections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ students: payload }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      // alert("Sections updated successfully");

      setStudents((prev) =>
        prev.map((s) => ({ ...s, originalSection: s.section }))
      );

      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10 text-gray-600">
        Loading students...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Assign Sections to Students
        </h3>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleUpdateAll}
            disabled={saving}
            className={`px-4 py-2 rounded-lg text-white transition
              ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {saving ? "Updating..." : "Update All"}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Section</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-800">
                  {student.user.username}
                </td>

                <td className="px-4 py-3 text-gray-800">
                  {student.user.firstName} {student.user.lastName}
                </td>

                <td className="px-4 py-3 text-gray-800">
                  {student.standard}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={student.section || ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handleSectionChange(student._id, e.target.value)
                    }
                    className={`w-28 px-3 py-2 border rounded-md focus:outline-none
                      ${
                        isEditing
                          ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                  >
                    <option value="">Select</option>
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignStudentSection;
