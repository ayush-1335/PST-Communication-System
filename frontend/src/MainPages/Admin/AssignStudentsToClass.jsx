import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

function AssignStudentsToClass() {
  const { classes, students, refreshAdminData } = useAdmin();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) => prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]);
  };

  const handleAssign = async () => {
    setError(""); setSuccess("");
    if (!selectedClass || selectedStudents.length === 0) { setError("Please select a class and at least one student"); return; }
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/users/admin/assign-class-students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId: selectedClass, students: selectedStudents }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Students assigned successfully");
      setSelectedStudents([]);
      refreshAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer";

  return (
    <div className="space-y-5">

      {error && <div className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
      {success && <div className="px-4 py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>}

      {/* Class Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Select Class</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className={inputClass + " w-64"}>
          <option value="">-- Select Class --</option>
          {classes.map((cls) => <option key={cls._id} value={cls._id}>{cls.standard}-{cls.section}</option>)}
        </select>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Select</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Username</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Standard</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Current Class</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...students]
              .sort((a, b) => {
                if (!a.class && !b.class) return 0;
                if (!a.class) return 1;
                if (!b.class) return -1;
                if (a.class.standard !== b.class.standard) return a.class.standard - b.class.standard;
                return a.class.section.localeCompare(b.class.section);
              })
              .map((s) => (
                <tr key={s._id} className={`hover:bg-slate-50 transition-colors duration-100 ${selectedStudents.includes(s._id) ? "bg-blue-50" : ""}`}>
                  <td className="px-5 py-3.5">
                    <input type="checkbox" checked={selectedStudents.includes(s._id)} onChange={() => toggleStudent(s._id)} className="accent-blue-500 w-4 h-4" />
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{s.user?.username}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{s.user?.firstName} {s.user?.lastName}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{s.standard}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">
                    {s.class
                      ? <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{s.class.standard}-{s.class.section}</span>
                      : <span className="text-slate-400">Not Assigned</span>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button onClick={handleAssign} disabled={saving} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors duration-150">
          {saving ? "Assigning..." : "Assign Students"}
        </button>
      </div>
    </div>
  );
}

export default AssignStudentsToClass;