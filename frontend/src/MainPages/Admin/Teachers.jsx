import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";

function Teachers() {
  const { teachers, loading, error, refreshAdminData } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resetResult, setResetResult] = useState(null);

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    return teachers.filter((teacher) => {
      const searchLower = searchTerm.toLowerCase();
      switch (searchField) {
        case "username": return teacher.user?.username?.toLowerCase().includes(searchLower);
        case "firstName": return teacher.user?.firstName?.toLowerCase().includes(searchLower);
        case "lastName": return teacher.user?.lastName?.toLowerCase().includes(searchLower);
        case "subject": return teacher.subject?.toLowerCase().includes(searchLower);
        default:
          return (
            teacher.user?.username?.toLowerCase().includes(searchLower) ||
            teacher.user?.firstName?.toLowerCase().includes(searchLower) ||
            teacher.user?.lastName?.toLowerCase().includes(searchLower) ||
            teacher.subject?.toLowerCase().includes(searchLower)
          );
      }
    });
  }, [teachers, searchTerm, searchField]);

  const resetPassword = async () => {
    if (!selectedTeacher) return;

    try {
      const res = await fetch(
        `http://localhost:5000/users/admin/reset-password/${selectedTeacher.user._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setResetResult(data.data);
      setShowConfirmModal(false);

    } catch (err) {
      console.error("Reset failed");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <p className="text-slate-600 text-sm">Loading teachers...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-500 text-sm p-4 rounded-xl">
      Error: {error}
    </div>
  );

  const inputClass = "px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900">All Teachers</h3>
          <p className="text-xs text-slate-500 mt-0.5">{teachers.length} total teachers</p>
        </div>
        <button
          onClick={refreshAdminData}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors duration-150"
        >
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputClass + " flex-1"}
        />
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className={inputClass + " cursor-pointer"}
        >
          <option value="all">All Fields</option>
          <option value="username">Username</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="subject">Subject</option>
        </select>
      </div>

      {/* Results count */}
      {searchTerm && (
        <p className="text-xs text-slate-500 mb-3">
          Found <span className="font-semibold text-slate-700">{filteredTeachers.length}</span> teacher(s)
        </p>
      )}

      {/* Empty state */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12">
          {searchTerm ? "No teachers found matching your search." : "No teachers found."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Username</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.user?.username} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{teacher.user?.username || "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{teacher.user?.firstName || "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{teacher.user?.lastName || "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">
                    {teacher.subject
                      ? <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{teacher.subject}</span>
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-sm">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowConfirmModal(true);
                        }}
                        className="text-red-500 hover:text-red-600 font-medium"
                      >
                        Reset Password
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirmModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-lg w-[360px] p-6">

            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Confirm Password Reset
            </h3>

            <p className="text-sm text-slate-600 mb-5">
              Are you sure you want to reset password for
              <span className="font-medium text-slate-800"> {selectedTeacher.user?.username}</span> ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={resetPassword}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Reset Password
              </button>
            </div>

          </div>

        </div>
      )}

      {resetResult && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-lg w-[380px] p-6">

            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Password Reset Successful
            </h3>

            <div className="text-sm text-slate-600 space-y-2 mb-5">
              <p>
                <span className="font-medium text-slate-800">Username:</span>{" "}
                {resetResult.username}
              </p>

              <p>
                <span className="font-medium text-slate-800">Temp Password:</span>{" "}
                <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                  {resetResult.tempPassword}
                </span>
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setResetResult(null)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Teachers;