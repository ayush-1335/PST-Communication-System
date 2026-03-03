import { useState, useMemo } from "react";
import { useTeacher } from "../../context/TeacherContext";

const MyStudents = () => {
  const { students, classInfo, loading, error } = useTeacher();
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("all");

  const filtered = useMemo(() => {
    if (!search) return students;
    const s = search.toLowerCase();
    switch (searchField) {
      case "username": return students.filter((st) => st.user?.username?.toLowerCase().includes(s));
      case "firstName": return students.filter((st) => st.user?.firstName?.toLowerCase().includes(s));
      case "lastName": return students.filter((st) => st.user?.lastName?.toLowerCase().includes(s));
      case "standard": return students.filter((st) => String(st.standard).includes(s));
      case "rollNumber": return students.filter((st) => String(st.rollNumber).includes(s));
      default:
        return students.filter((st) =>
          st.user?.username?.toLowerCase().includes(s) ||
          st.user?.firstName?.toLowerCase().includes(s) ||
          st.user?.lastName?.toLowerCase().includes(s) ||
          String(st.standard).includes(s) ||
          String(st.rollNumber).includes(s)
        );
    }
  }, [students, search, searchField]);

  if (loading) return (
    <div className="text-center py-10 text-slate-500 text-sm">Loading students...</div>
  );

  if (error) return (
    <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">My Students</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Class: <span className="font-medium text-slate-700">{classInfo.class}</span>
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">
          {students.length} Students
        </span>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
        />
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer"
        >
          <option value="all">All Fields</option>
          <option value="username">Username</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="standard">Standard</option>
          <option value="rollNumber">Roll No</option>
        </select>
      </div>
      {search && (
        <p className="text-xs text-slate-500 -mt-3 mb-4">
          Found <span className="font-semibold text-slate-700">{filtered.length}</span> student(s)
        </p>
      )}

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12">
          {search ? "No students match your search." : "No students assigned yet."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Username</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Standard</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Roll No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((student, index) => (
                <tr key={student._id} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-5 py-3.5 text-sm text-slate-500">{index + 1}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{student.user?.username}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{student.user?.firstName} {student.user?.lastName}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{student.standard}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{student.rollNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyStudents;