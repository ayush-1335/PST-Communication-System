const AttendanceHeader = ({ selectedDate, setSelectedDate, onSubmit, loading, isEditMode, isEditable }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-wrap gap-4 items-end">

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={loading || !isEditable}
          className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors duration-150"
        >
          {loading ? "Saving..." : isEditMode ? "Update Attendance" : "Mark Attendance"}
        </button>

        {!isEditable && (
          <span className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 text-xs font-medium">
            Editing window expired
          </span>
        )}

        {isEditMode && isEditable && (
          <span className="px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">
            Edit Mode
          </span>
        )}
      </div>

    </div>
  );
};

export default AttendanceHeader;