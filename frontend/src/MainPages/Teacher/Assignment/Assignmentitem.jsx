import { useState } from "react";
import AssignmentStatusPanel from "./AssignmentStatusPanel";

const AssignmentItem = ({ assignment }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded mb-4 shadow">
      {/* Header */}
      <div
        className="p-4 cursor-pointer bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <h3 className="font-semibold">
          {assignment.title}
        </h3>
        <p>Subject: {assignment.subject}</p>
        <p>
          Due:{" "}
          {new Date(
            assignment.dueDate
          ).toLocaleDateString()}
        </p>
      </div>

      {/* Expand Section */}
      {open && (
        <AssignmentStatusPanel
          assignmentId={assignment._id}
        />
      )}
    </div>
  );
};

export default AssignmentItem;
