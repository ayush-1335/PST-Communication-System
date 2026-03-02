import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const inputClass = "w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer";

const ConfirmPopup = ({ message, details, onConfirm, onCancel, confirmLabel = "Confirm", confirmStyle = "bg-red-500 hover:bg-red-600" }) => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 w-80">
      <p className="text-sm font-semibold text-slate-800 mb-3">{message}</p>
      {details && (
        <div className="text-sm text-slate-600 space-y-1 mb-4">
          {details.map((d, i) => (
            <p key={i}><span className="text-slate-400">{d.label}:</span> {d.value}</p>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} className={`px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${confirmStyle}`}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

const AssignClassTeacher = () => {
  const { classes, teachers, refreshAdminData } = useAdmin();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassObj, setSelectedClassObj] = useState(null);
  const [selectedTeacherObj, setSelectedTeacherObj] = useState(null);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAssignClick = () => {
    setError(""); setSuccess("");
    if (!selectedClass || !selectedTeacher) { setError("Please select both class and teacher"); return; }
    if (selectedClassObj?.classTeacher) { setShowAssignConfirm(true); return; }
    assignClassTeacher();
  };

  const assignClassTeacher = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/admin/assign-class-teacher", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId: selectedClass, teacherId: selectedTeacher }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
      setSelectedClass(""); setSelectedTeacher(""); setSelectedClassObj(null); setSelectedTeacherObj(null);
      refreshAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); setShowAssignConfirm(false);
    }
  };

  const removeClassTeacher = async (classId) => {
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch("http://localhost:5000/users/admin/remove-class-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Class teacher removed successfully");
      refreshAdminData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); setConfirmRemoveId(null);
    }
  };

  const removeClass = classes.find((c) => c._id === confirmRemoveId);

  return (
    <div className="relative space-y-6">

      {/* Assign confirm popup */}
      {showAssignConfirm && (
        <ConfirmPopup
          message="This class already has a teacher. Replace?"
          details={[
            { label: "Class", value: `${selectedClassObj.standard}-${selectedClassObj.section}` },
            { label: "Current", value: `${selectedClassObj.classTeacher?.user.firstName} ${selectedClassObj.classTeacher?.user.lastName}` },
            { label: "New", value: `${selectedTeacherObj.user.firstName} ${selectedTeacherObj.user.lastName}` },
          ]}
          onConfirm={assignClassTeacher}
          onCancel={() => setShowAssignConfirm(false)}
          confirmLabel="Yes, Replace"
        />
      )}

      {/* Remove confirm popup */}
      {confirmRemoveId && (
        <ConfirmPopup
          message="Remove class teacher from this class?"
          details={[
            { label: "Class", value: `${removeClass?.standard}-${removeClass?.section}` },
            { label: "Teacher", value: `${removeClass?.classTeacher?.user.firstName} ${removeClass?.classTeacher?.user.lastName}` },
          ]}
          onConfirm={() => removeClassTeacher(confirmRemoveId)}
          onCancel={() => setConfirmRemoveId(null)}
          confirmLabel="Yes, Remove"
        />
      )}

      {error && <div className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
      {success && <div className="px-4 py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">{success}</div>}

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Select Class</label>
          <select value={selectedClass} onChange={(e) => { const id = e.target.value; setSelectedClass(id); setSelectedClassObj(classes.find((c) => c._id === id)); }} className={inputClass}>
            <option value="">-- Select Class --</option>
            {classes.map((cls) => <option key={cls._id} value={cls._id}>{cls.standard}-{cls.section}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Select Teacher</label>
          <select value={selectedTeacher} onChange={(e) => { const id = e.target.value; setSelectedTeacher(id); setSelectedTeacherObj(teachers.find((t) => t._id === id)); }} className={inputClass}>
            <option value="">-- Select Teacher --</option>
            {teachers.map((t) => <option key={t._id} value={t._id}>{t.user.firstName} {t.user.lastName} ({t.subject})</option>)}
          </select>
        </div>
      </div>

      <button onClick={handleAssignClick} disabled={loading} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors duration-150">
        {loading ? "Processing..." : "Assign Class Teacher"}
      </button>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Class</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Class Teacher</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.map((cls) => (
              <tr key={cls._id} className="hover:bg-slate-50 transition-colors duration-100">
                <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{cls.standard}-{cls.section}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">
                  {cls.classTeacher ? `${cls.classTeacher.user.firstName} ${cls.classTeacher.user.lastName}` : <span className="text-slate-400">Not Assigned</span>}
                </td>
                <td className="px-5 py-3.5">
                  {cls.classTeacher
                    ? <span className="px-2 py-0.5 rounded-md bg-green-50 border border-green-200 text-green-600 text-xs font-medium">Assigned</span>
                    : <span className="px-2 py-0.5 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">Pending</span>}
                </td>
                <td className="px-5 py-3.5">
                  {cls.classTeacher
                    ? <button onClick={() => setConfirmRemoveId(cls._id)} disabled={loading} className="px-3 py-1 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all duration-150">Remove</button>
                    : <span className="text-slate-300 text-sm">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignClassTeacher;