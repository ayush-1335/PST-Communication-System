import React, { useEffect, useState } from "react";

function AssignStudentsToClass() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchStudents = async () => {
        const res = await fetch("http://localhost:8000/users/students", {
            credentials: "include",
        });

        const data = await res.json();

        setStudents(
            (data.data || []).sort(
                (a, b) => Number(a.standard) - Number(b.standard)
            )
        );
    };

    // 1️⃣ Fetch classes & students
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classRes, studentRes] = await Promise.all([
                    fetch("http://localhost:8000/users/admin/class-info", {
                        credentials: "include",
                    }),
                    fetch("http://localhost:8000/users/students", {
                        credentials: "include",
                    }),
                ]);

                const classData = await classRes.json();
                const studentData = await studentRes.json();

                // console.log("ClassData:", classData);

                const sortedClasses = (classData.data || []).sort((a, b) => {
                    const stdDiff = Number(a.standard) - Number(b.standard);
                    if (stdDiff !== 0) return stdDiff;

                    return a.section.localeCompare(b.section);
                });

                setClasses(sortedClasses);
                setStudents(
                    (studentData.data || []).sort(
                        (a, b) => Number(a.standard) - Number(b.standard)
                    )
                );
            } catch {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 2️⃣ Toggle student checkbox
    const toggleStudent = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    // 3️⃣ Assign students
    const handleAssign = async () => {
        setError("");
        setSuccess("");

        if (!selectedClass || selectedStudents.length === 0) {
            setError("Please select a class and at least one student");
            return;
        }

        setSaving(true);

        try {
            console.log(selectedClass)
            console.log(selectedStudents)
            const res = await fetch(
                "http://localhost:8000/users/admin/assign-class-students",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        classId: selectedClass,
                        students: selectedStudents,
                    }),
                }
            );

            const data = await res.json();

            console.log(data)

            if (!res.ok) {
                throw new Error(data.message || "Assignment failed");
            }

            setSuccess("Students assigned successfully");
            setSelectedStudents([]);

            await fetchStudents();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-6">
                Assign Students to Class
            </h2>

            {/* Alerts */}
            {error && (
                <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-50 text-green-600 px-4 py-2 rounded">
                    {success}
                </div>
            )}

            {/* Class Selector */}
            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">
                    Select Class
                </label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-64 border rounded-lg px-3 py-2"
                >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                            {cls.standard} - {cls.section}
                        </option>
                    ))}
                </select>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Select</th>
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Standard</th>
                            <th className="p-3 text-left">Current Class</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((s) => (
                            <tr
                                key={s._id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(s._id)}
                                        onChange={() => toggleStudent(s._id)}
                                    />
                                </td>
                                <td className="p-3">{s.user.username}</td>
                                <td className="p-3">
                                    {s.user.firstName} {s.user.lastName}
                                </td>
                                <td className="p-3">{s.standard}</td>
                                <td className="p-3">
                                    {s.class
                                        ? `${s.class.standard}-${s.class.section}`
                                        : "Not Assigned"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assign Button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleAssign}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? "Assigning..." : "Assign Students"}
                </button>
            </div>
        </div>
    );
}

export default AssignStudentsToClass;
