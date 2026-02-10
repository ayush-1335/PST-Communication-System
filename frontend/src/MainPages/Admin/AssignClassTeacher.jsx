import { useEffect, useState } from "react";

const AssignClassTeacher = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [selectedClassObj, setSelectedClassObj] = useState(null);
  const [selectedTeacherObj, setSelectedTeacherObj] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    const res = await fetch("http://localhost:3000/users/admin/class-info", {
      credentials: "include",
    });
    const data = await res.json();
    setClasses(data.data || []);
  };

  const fetchTeachers = async () => {
    const res = await fetch("http://localhost:3000/users/admin/teachers", {
      credentials: "include",
    });
    const data = await res.json();
    setTeachers(data.data || []);
  };

  /* ================= ASSIGN LOGIC ================= */

  const handleAssignClick = () => {
    setError("");
    setSuccess("");

    if (!selectedClass || !selectedTeacher) {
      setError("Please select both class and teacher");
      return;
    }

    if (selectedClassObj?.classTeacher) {
      setShowConfirm(true);
      return;
    }

    assignClassTeacher();
  };

  const assignClassTeacher = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/users/admin/assign-class-teacher",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            classId: selectedClass,
            teacherId: selectedTeacher,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(data.message);
      setSelectedClass("");
      setSelectedTeacher("");
      setSelectedClassObj(null);
      setSelectedTeacherObj(null);

      fetchClasses(); // 🔁 refresh table
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const removeClassTeacher = async (classId) => {
  if (!window.confirm("Remove class teacher from this class?")) return;

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch(
      "http://localhost:3000/users/admin/remove-class-teacher",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setSuccess("Class teacher removed successfully");
    fetchClasses(); // 🔁 refresh table
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
  };


  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        Assign Class Teacher
      </h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      {/* ================= FORM ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* CLASS */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Class
          </label>
          <select
            value={selectedClass}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedClass(id);
              setSelectedClassObj(classes.find((c) => c._id === id));
            }}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.standard}-{cls.section}
              </option>
            ))}
          </select>
        </div>

        {/* TEACHER */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Teacher
          </label>
          <select
            value={selectedTeacher}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedTeacher(id);
              setSelectedTeacherObj(
                teachers.find((t) => t._id === id)
              );
            }}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Select Teacher --</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.user.firstName} {t.user.lastName} ({t.subject})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleAssignClick}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Assigning..." : "Assign Class Teacher"}
      </button>

      {/* ================= CONFIRM MODAL ================= */}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Change Class Teacher?
            </h3>

            <div className="text-sm space-y-2">
              <p>
                <b>Class:</b> {selectedClassObj.standard}-
                {selectedClassObj.section}
              </p>
              <p>
                <b>Current:</b>{" "}
                {selectedClassObj.classTeacher.user.firstName}{" "}
                {selectedClassObj.classTeacher.user.lastName}
              </p>
              <p>
                <b>New:</b>{" "}
                {selectedTeacherObj.user.firstName}{" "}
                {selectedTeacherObj.user.lastName}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={assignClassTeacher}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 🟢 CLASS TABLE ================= */}

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">
          Class & Class Teacher List
        </h3>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Class</th>
                <th className="px-4 py-3 text-left">Class Teacher</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => (
                <tr
                  key={cls._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {cls.standard}-{cls.section}
                  </td>

                  <td className="px-4 py-3">
                    {cls.classTeacher ? (
                      <>
                        {cls.classTeacher.user.firstName}{" "}
                        {cls.classTeacher.user.lastName}
                      </>
                    ) : (
                      <span className="text-gray-400">
                        Not Assigned
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {cls.classTeacher ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        Assigned
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {cls.classTeacher ? (
                      <button
                        onClick={() => removeClassTeacher(cls._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs hover:bg-red-200"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        -
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignClassTeacher;
