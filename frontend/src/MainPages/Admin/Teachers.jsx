import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";

function Teachers() {
  const { teachers, loading, error, refreshAdminData } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  // Filter teachers based on search
  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;

    return teachers.filter((teacher) => {
      const searchLower = searchTerm.toLowerCase();

      switch (searchField) {
        case "username":
          return teacher.user?.username?.toLowerCase().includes(searchLower);
        case "firstName":
          return teacher.user?.firstName?.toLowerCase().includes(searchLower);
        case "lastName":
          return teacher.user?.lastName?.toLowerCase().includes(searchLower);
        case "subject":
          return teacher.subject?.toLowerCase().includes(searchLower);
        case "all":
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg">Loading teachers...</p>
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
        <h3 className="text-2xl font-bold text-gray-800">View All Teachers</h3>
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
            placeholder="Search teachers..."
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
            <option value="subject">Subject</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredTeachers.length} teacher(s)
        </div>
      )}

      {filteredTeachers.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          {searchTerm ? "No teachers found matching your search." : "No teachers found."}
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
                  Subject
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.user?.username}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {teacher.user?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {teacher.user?.firstName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {teacher.user?.lastName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {teacher.subject || "N/A"}
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

export default Teachers;