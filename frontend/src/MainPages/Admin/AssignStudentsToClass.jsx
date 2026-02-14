import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

function AssignStudentsToClass() {
  const { classes, students, refreshAdminData } = useAdmin();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 1️⃣ Toggle checkbox
  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // 2️⃣ Assign students
  const handleAssign = async () => {
    setError("");
    setSuccess("");

    if (!selectedClass || selectedStudents.length === 0) {
      setError("Please select a class and at least one student");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        "http://localhost:5000/users/admin/assign-class-students",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            classId: selectedClass,
            students: selectedStudents,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Students assigned successfully");
      setSelectedStudents([]);

      // 🔁 Refresh global admin data
      refreshAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        Assign Students to Class
      </h2>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 text-green-600 px-4 py-2 rounded">
          {success}
        </div>
      )}

      {/* Class Selector */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Select Class
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-64 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.standard}-{cls.section}
            </option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Select</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Standard</th>
              <th className="p-3 text-left">Current Class</th>
            </tr>
          </thead>

          <tbody>
            {
              [...students]
                .sort((a, b) => {
                  // If no class assigned, push to bottom
                  if (!a.class && !b.class) return 0;
                  if (!a.class) return 1;
                  if (!b.class) return -1;

                  // 1️⃣ Compare standard (number)
                  if (a.class.standard !== b.class.standard) {
                    return a.class.standard - b.class.standard;
                  }

                  // 2️⃣ Compare section (string)
                  return a.class.section.localeCompare(b.class.section);
                })
                .map((s) => (
                  <tr
                    key={s._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(s._id)}
                        onChange={() => toggleStudent(s._id)}
                      />
                    </td>

                    <td className="p-3">{s.user?.username}</td>

                    <td className="p-3">
                      {s.user?.firstName} {s.user?.lastName}
                    </td>

                    <td className="p-3">{s.standard}</td>

                    <td className="p-3">
                      {s.class
                        ? `${s.class.standard}-${s.class.section}`
                        : "Not Assigned"}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Assign Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleAssign}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Assigning..." : "Assign Students"}
        </button>
      </div>
    </div>
  );
}

export default AssignStudentsToClass;
