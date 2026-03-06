import { useState } from "react";
import AssignmentStatusPanel from "./AssignmentStatusPanel";

const AssignmentItem = ({ assignment }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-150 ${open ? "border-blue-200" : "border-slate-200"}`}>

      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors duration-150"
      >
        <div>
          <p className={`text-sm font-semibold ${open ? "text-blue-600" : "text-slate-800"}`}>
            {assignment.title}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">
              {assignment.subject}
            </span>
            <span className="text-xs text-slate-400">
              Due: {new Date(assignment.dueDate).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>
        <span className={`text-slate-400 text-lg mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {/* Expand */}
      {open && (
        <div className="border-t border-slate-100 px-5 py-5">
          <AssignmentStatusPanel assignmentId={assignment._id} />
        </div>
      )}

    </div>
  );
};

export default AssignmentItem;