import { useState } from "react";
import AssignClassTeacher from "./AssignClassTeacher";
import AssignStudentsToClass from "./AssignStudentsToClass";
import AssignTeacherClasses from "./AssignTeacherClasses";
import BulkCreateClasses from "./BulkCreateClasses";

const Accordion = ({ label, description, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden ${open ? "border-blue-200" : "border-slate-200"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors duration-150"
      >
        <div>
          <p className={`text-base font-semibold ${open ? "text-blue-600" : "text-slate-800"}`}>{label}</p>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
        <span className={`text-slate-400 text-xl transition-transform duration-200 ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="px-6 pb-6 pt-3 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

const AssignRelation = () => {
  return (
    <div className="space-y-3">

      <Accordion label="Bulk Create Classes" description="Create multiple classes at once">
        <BulkCreateClasses />
      </Accordion>

      <Accordion label="Assign Class Teacher" description="Assign a teacher to a class">
        <AssignClassTeacher />
      </Accordion>

      <Accordion label="Assign Teacher Classes" description="Assign multiple classes to a teacher">
        <AssignTeacherClasses />
      </Accordion>

      <Accordion label="Assign Students to Class" description="Add students into a class">
        <AssignStudentsToClass />
      </Accordion>

    </div>
  );
};

export default AssignRelation;