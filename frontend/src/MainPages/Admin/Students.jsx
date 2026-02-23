import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";

function Students() {
  const { students, loading, error, refreshAdminData } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;

    return students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();

      switch (searchField) {
        case "username":
          return student.user?.username?.toLowerCase().includes(searchLower);
        case "firstName":
          return student.user?.firstName?.toLowerCase().includes(searchLower);
        case "lastName":
          return student.user?.lastName?.toLowerCase().includes(searchLower);
        case "class":
          return student.standard?.toLowerCase().includes(searchLower);
        case "all":
        default:
          return (
            student.user?.username?.toLowerCase().includes(searchLower) ||
            student.user?.firstName?.toLowerCase().includes(searchLower) ||
            student.user?.lastName?.toLowerCase().includes(searchLower) ||
            student.standard?.toLowerCase().includes(searchLower)
          );
      }
    });
  }, [students, searchTerm, searchField]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">View All Students</h3>
        <button
          onClick={refreshAdminData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Search Section */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Fields</option>
            <option value="username">Username</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="class">Class</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredStudents.length} student(s)
        </div>
      )}

      {filteredStudents.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          {searchTerm ? "No students found matching your search." : "No students found."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-b border-gray-300">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-b border-gray-300">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-b border-gray-300">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-b border-gray-300">
                  Class
                </th>
              </tr>
            </thead>

            <tbody>
              {[...filteredStudents]
                .sort((a, b) => {
                  if (!a.class && !b.class) return 0;
                  if (!a.class) return 1;
                  if (!b.class) return -1;

                  if (a.class.standard !== b.class.standard) {
                    return a.class.standard - b.class.standard;
                  }

                  return a.class.section.localeCompare(b.class.section);
                })
                .map((student) => (
                  <tr
                    key={student.user?.username}
                    className="hover:bg-gray-100 border-b border-gray-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.user?.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.user?.firstName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.user?.lastName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.standard || "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Students;