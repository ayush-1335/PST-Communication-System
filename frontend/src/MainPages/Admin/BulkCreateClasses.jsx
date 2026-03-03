import React, { useState } from "react";

const STANDARDS = [1,2,3,4,5,6,7,8,9,10,11,12];
const SECTIONS = ["A", "B", "C", "D"];

const selectClass = "px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer";

function BulkCreateClasses() {
  const [rows, setRows] = useState([{ standard: "", section: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const addRow = () => setRows([...rows, { standard: "", section: "" }]);

  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    const payload = rows.filter((r) => r.standard && r.section);
    if (!payload.length) { setError("Please add at least one valid class"); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/users/admin/create-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classes: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create classes");
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>
      )}

      {/* Rows */}
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-3">
            <select value={row.standard} onChange={(e) => handleChange(index, "standard", e.target.value)} className={selectClass}>
              <option value="">Select Standard</option>
              {STANDARDS.map((s) => <option key={s} value={s}>Standard {s}</option>)}
            </select>

            <select value={row.section} onChange={(e) => handleChange(index, "section", e.target.value)} className={selectClass}>
              <option value="">Select Section</option>
              {SECTIONS.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
            </select>

            {rows.length > 1 && (
              <button onClick={() => removeRow(index)} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all duration-150">
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-1">
        <button onClick={addRow} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors duration-150">
          + Add Row
        </button>
        <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors duration-150">
          {loading ? "Creating..." : "Create Classes"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-3 pt-2">
          <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-semibold text-green-700 mb-1">Created ({result.createdCount})</p>
            <ul className="text-sm text-green-700 space-y-0.5">
              {result.createdClasses.map((c) => <li key={c._id}>• Class {c.standard} - {c.section}</li>)}
            </ul>
          </div>
          {result.skippedCount > 0 && (
            <div className="px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-700 mb-1">Skipped ({result.skippedCount})</p>
              <ul className="text-sm text-yellow-700 space-y-0.5">
                {result.skippedClasses.map((s, i) => <li key={i}>• {s.standard}-{s.section}: {s.reason}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BulkCreateClasses;