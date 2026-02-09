import { useEffect, useState } from "react";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyClasses();
  }, []);

  const fetchMyClasses = async () => {
  try {
    const res = await fetch(
      "http://localhost:8000/users/teacher/my-classes",
      { credentials: "include" }
    );

    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(data.message);

    const sorted = (data.data || []).sort((a, b) => {
      const stdDiff = Number(a.standard) - Number(b.standard);
      if (stdDiff !== 0) return stdDiff;
      return a.section.localeCompare(b.section);
    });

    setClasses(sorted);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading your classes...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">
        My Classes
      </h2>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {classes.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No classes assigned yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="border rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Class {cls.standard}-{cls.section}
                </h3>

                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  Assigned
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600">
                You teach your subject in this class
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClasses;
