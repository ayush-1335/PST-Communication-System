import React, { useState } from "react";

const STANDARDS = [1,2,3,4,5,6,7,8,9,10,11,12];
const SECTIONS = ["A", "B", "C", "D"];

function BulkCreateClasses() {
  const [rows, setRows] = useState([
    { standard: "", section: "" }
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Add new row
  const addRow = () => {
    setRows([...rows, { standard: "", section: "" }]);
  };

  // Remove row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // Submit to backend
  const handleSubmit = async () => {
    setError("");
    setResult(null);

    const payload = rows.filter(
      (r) => r.standard && r.section
    );

    if (!payload.length) {
      setError("Please add at least one valid class");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/users/admin/create-class",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ classes: payload }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create classes");
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        Bulk Create Classes
      </h2>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            {/* Standard */}
            <select
              value={row.standard}
              onChange={(e) =>
                handleChange(index, "standard", e.target.value)
              }
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Select Class</option>
              {STANDARDS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Section */}
            <select
              value={row.section}
              onChange={(e) =>
                handleChange(index, "section", e.target.value)
              }
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Select Section</option>
              {SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            {/* Remove */}
            <div>
              {rows.length > 1 && (
                <button
                  onClick={() => removeRow(index)}
                  className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={addRow}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
        >
          + Add Row
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Classes"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-4">
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-700">
              Created ({result.createdCount})
            </h4>
            <ul className="list-disc ml-5">
              {result.createdClasses.map((c) => (
                <li key={c._id}>
                  Class {c.standard} - {c.section}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-yellow-700">
              Skipped ({result.skippedCount})
            </h4>
            <ul className="list-disc ml-5">
              {result.skippedClasses.map((s, i) => (
                <li key={i}>
                  {s.standard}-{s.section}: {s.reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkCreateClasses;
