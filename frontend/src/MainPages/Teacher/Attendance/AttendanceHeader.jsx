const AttendanceHeader = ({
  selectedDate,
  setSelectedDate,
  onSubmit,
  loading,
  isEditMode,
  isEditable,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4 items-end">

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-md px-3 py-2"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !isEditable}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
      >
        {loading
          ? "Saving..."
          : isEditMode
            ? "Update Attendance"
            : "Mark Attendance"}
      </button>

      {!isEditable && (
        <span className="text-red-500 text-sm ml-4">
          Editing window expired
        </span>
      )}
    </div>
  );
};

export default AttendanceHeader;
