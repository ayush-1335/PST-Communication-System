import { useEffect, useState } from "react";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [className, setClassName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyStudents();
  }, []);

  const fetchMyStudents = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/users/teacher/my-students",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch students");
      }

      setStudents(data.data.students || []);
      setClassName(data.data.class || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        Loading students...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            My Students
          </h2>
          <p className="text-sm text-gray-500">
            Class: <span className="font-medium">{className}</span>
          </p>
        </div>

        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          Total: {students.length}
        </span>
      </div>

      {/* Table */}
      {students.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No students assigned yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Standard</th>
                <th className="px-4 py-3 text-left">Roll No</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">
                    {student.user?.username}
                  </td>

                  <td className="px-4 py-3">
                    {student.user?.firstName}{" "}
                    {student.user?.lastName}
                  </td>

                  <td className="px-4 py-3">
                    {student.standard}
                  </td>

                  <td className="px-4 py-3">
                    {student.rollNumber || "-"}
                  </td>
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
