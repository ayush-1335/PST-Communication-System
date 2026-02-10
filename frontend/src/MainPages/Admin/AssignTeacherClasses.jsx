import { useEffect, useState } from "react";

const AssignTeacherClasses = () => {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);

    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedClasses, setSelectedClasses] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* ================= FETCH DATA ================= */

    useEffect(() => {
        fetchTeachers();
        fetchClasses();
    }, []);

    const fetchTeachers = async () => {
        const res = await fetch("http://localhost:8000/users/teachers", {
            credentials: "include",
        });
        const data = await res.json();
        setTeachers(data.data || []);
    };

    const fetchClasses = async () => {
        const res = await fetch("http://localhost:8000/users/admin/class-info", {
            credentials: "include",
        });
        const data = await res.json();
        setClasses(data.data || []);
    };

    /* ================= SORT CLASSES ================= */

    const sortedClasses = [...classes].sort((a, b) => {
        if (Number(a.standard) !== Number(b.standard)) {
            return Number(a.standard) - Number(b.standard);
        }
        return a.section.localeCompare(b.section);
    });

    /* ================= HANDLERS ================= */

    const toggleClassSelection = (classId) => {
        setSelectedClasses((prev) =>
            prev.includes(classId)
                ? prev.filter((id) => id !== classId)
                : [...prev, classId]
        );
    };

    const handleAssign = async () => {
        setError("");
        setSuccess("");

        if (!selectedTeacher || selectedClasses.length === 0) {
            setError("Please select a teacher and at least one class");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                "http://localhost:8000/users/admin/assign-teacher-classes",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        teacherId: selectedTeacher,
                        classIds: selectedClasses, // ✅ ARRAY of class IDs
                    }),
                }
            );

            const data = await res.json();

            console.log(data)

            if (!res.ok) {
                throw new Error(data.message || "Failed to assign classes");
            }

            setSuccess(data.message || "Classes assigned to teacher successfully");
            await fetchTeachers()

            setSelectedTeacher("");
            setSelectedClasses([]);
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">
                Assign Classes to Teacher
            </h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {success && <p className="text-green-600 mb-4">{success}</p>}

            {/* ================= TEACHER SELECT ================= */}

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Select Teacher
                </label>
                <select
                    value={selectedTeacher}
                    onChange={(e) => {
                        const teacherId = e.target.value;
                        setSelectedTeacher(teacherId);

                        const teacherObj = teachers.find(t => t._id === teacherId);

                        // 🔥 preload assigned classes
                        setSelectedClasses(teacherObj?.classes || []);
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

            {/* ================= CLASS MULTI SELECT ================= */}

            <div className="mb-6">
                <p className="text-sm font-medium mb-3">
                    Select Classes (Multiple)
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {sortedClasses.map((cls) => (
                        <label
                            key={cls._id}
                            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer
                ${selectedClasses.includes(cls._id)
                                    ? "bg-blue-50 border-blue-400"
                                    : "hover:bg-gray-50"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedClasses.includes(cls._id)}
                                onChange={() => toggleClassSelection(cls._id)}
                                className="accent-blue-600"
                            />
                            <span className="text-sm">
                                {cls.standard}-{cls.section}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* ================= ACTION BUTTON ================= */}

            <button
                onClick={handleAssign}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
                {loading
                    ? "Saving..."
                    : selectedTeacher
                        ? "Update Teacher Classes"
                        : "Assign Classes"}
            </button>
        </div>
    );
};

export default AssignTeacherClasses;
