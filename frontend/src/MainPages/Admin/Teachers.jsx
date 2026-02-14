import React from "react";
import { useAdmin } from "../../context/AdminContext";

function Teachers() {
  const { teachers, loading, error, refreshAdminData } = useAdmin();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading teachers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          View All Teachers
        </h3>

        <button
          onClick={refreshAdminData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {teachers.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No teachers found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Subject
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr
                  key={teacher.user?.username}
                  className="hover:bg-gray-50 transition"
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
