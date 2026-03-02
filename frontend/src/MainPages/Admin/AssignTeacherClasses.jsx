import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const AssignTeacherClasses = () => {
  const { teachers, classes, refreshAdminData } = useAdmin();
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedClasses = [...classes].sort((a, b) => {
    if (Number(a.standard) !== Number(b.standard)) return Number(a.standard) - Number(b.standard);
    return a.section.localeCompare(b.section);
  });

  const toggleClassSelection = (classId) => {
    setSelectedClasses((prev) => prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]);
  };

  const handleAssign = async () => {
    setError(""); setSuccess("");
    if (!selectedTeacher || selectedClasses.length === 0) { setError("Please select a teacher and at least one class"); return; }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/users/admin/assign-teacher-classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teacherId: selectedTeacher, classIds: selectedClasses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign classes");
      setSuccess(data.message || "Classes assigned successfully");
      refreshAdminData();
      setSelectedTeacher(""); setSelectedClasses([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer";

  return (
    <div className="space-y-5">

      {error && <div className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
      {success && <div className="px-4 py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>}

      {/* Teacher Select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Select Teacher</label>
        <select
          value={selectedTeacher}
          onChange={(e) => {
            const teacherId = e.target.value;
            setSelectedTeacher(teacherId);
            const teacherObj = teachers.find((t) => t._id === teacherId);
            setSelectedClasses(teacherObj?.classes?.map((c) => typeof c === "string" ? c : c._id) || []);
          }}
          className={inputClass}
        >
          <option value="">-- Select Teacher --</option>
          {teachers.map((t) => <option key={t._id} value={t._id}>{t.user.firstName} {t.user.lastName} ({t.subject})</option>)}
        </select>
      </div>

      {/* Class Multi Select */}
      <div>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Select Classes</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {sortedClasses.map((cls) => (
            <label
              key={cls._id}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-all duration-150 ${
                selectedClasses.includes(cls._id)
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <input type="checkbox" checked={selectedClasses.includes(cls._id)} onChange={() => toggleClassSelection(cls._id)} className="accent-blue-500" />
              {cls.standard}-{cls.section}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleAssign} disabled={loading} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors duration-150">
          {loading ? "Saving..." : selectedTeacher ? "Update Teacher Classes" : "Assign Classes"}
        </button>
      </div>
    </div>
  );
};

export default AssignTeacherClasses;