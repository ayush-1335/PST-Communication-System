import { useState } from "react";

const UploadMaterial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [standard, setStandard] = useState("");
  const [type, setType] = useState("NOTE");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("subject", subject);
      formData.append("standard", standard);
      formData.append("type", type); // NEW
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:5000/users/teacher/upload-material",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess("Material uploaded successfully");

      setTitle("");
      setDescription("");
      setSubject("");
      setStandard("");
      setType("NOTE");
      setFile(null);

      document.getElementById("file-input").value = "";
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";

  return (
    <div className="max-w-xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Upload Study Material
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Share notes, PDFs or documents with your students.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Title
          </label>
          <input
            type="text"
            placeholder="e.g. Chapter 3 Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Description
          </label>
          <textarea
            placeholder="Brief description of the material..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass + " resize-none"}
          />
        </div>

        {/* Subject + Standard */}
        <div className="grid grid-cols-2 gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Standard
            </label>
            <input
              type="number"
              placeholder="e.g. 10"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              required
              className={inputClass}
            />
          </div>

        </div>

        {/* TYPE SELECT (NEW) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Material Type
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          >
            <option value="NOTE">Note</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="ANSWER_SHEET">Answer Sheet</option>
            <option value="QUESTION_PAPER">Question Paper</option>
            <option value="WORKSHEET">Worksheet</option>
            <option value="DIAGRAM">Diagram</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            File
          </label>

          <div className="relative">

            <input
              id="file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                file
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 bg-slate-50 border-dashed"
              }`}
            >
              <span className="text-lg">{file ? "📄" : "📁"}</span>

              <span
                className={`text-sm truncate ${
                  file ? "text-blue-600 font-medium" : "text-slate-400"
                }`}
              >
                {file ? file.name : "Click to select a file"}
              </span>

            </div>

          </div>

          {file && (
            <p className="text-xs text-slate-400">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          )}

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-1">

          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              setSubject("");
              setStandard("");
              setType("NOTE");
              setFile(null);
              document.getElementById("file-input").value = "";
            }}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium"
          >
            {loading ? "Uploading..." : "Upload Material"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default UploadMaterial;