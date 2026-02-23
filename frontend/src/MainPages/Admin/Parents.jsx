import React, { useState, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";

function Parents() {
  const { parents, loading, error, refreshAdminData } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  // Filter parents based on search
  const filteredParents = useMemo(() => {
    if (!searchTerm) return parents;

    return parents.filter((parent) => {
      const searchLower = searchTerm.toLowerCase();

      switch (searchField) {
        case "username":
          return parent.user?.username?.toLowerCase().includes(searchLower);
        case "firstName":
          return parent.user?.firstName?.toLowerCase().includes(searchLower);
        case "lastName":
          return parent.user?.lastName?.toLowerCase().includes(searchLower);
        case "phone":
          return parent.phone?.toLowerCase().includes(searchLower);
        case "all":
        default:
          return (
            parent.user?.username?.toLowerCase().includes(searchLower) ||
            parent.user?.firstName?.toLowerCase().includes(searchLower) ||
            parent.user?.lastName?.toLowerCase().includes(searchLower) ||
            parent.phone?.toLowerCase().includes(searchLower)
          );
      }
    });
  }, [parents, searchTerm, searchField]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg">Loading parents...</p>
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
        <h3 className="text-2xl font-bold text-gray-800">View All Parents</h3>
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
            placeholder="Search parents..."
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
            <option value="phone">Phone</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredParents.length} parent(s)
        </div>
      )}

      {filteredParents.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          {searchTerm ? "No parents found matching your search." : "No parents found."}
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
                  Phone
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredParents.map((parent) => (
                <tr
                  key={parent.user?.username}
                  className="hover:bg-gray-100 border-b border-gray-300"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {parent.user?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {parent.user?.firstName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {parent.user?.lastName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {parent.phone || "N/A"}
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

export default Parents;