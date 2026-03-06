import { useEffect, useState } from "react";
import AssignmentItem from "./AssignmentItem";

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("http://localhost:5000/users/teacher/assignments", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        setAssignments(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) return (
    <div className="text-center py-10 text-slate-500 text-sm">Loading assignments...</div>
  );

  return (
    <div className="space-y-4">

      <div>
        <h2 className="text-base font-semibold text-slate-900">My Assignments</h2>
        <p className="text-sm text-slate-500 mt-0.5">{assignments.length} assignment(s) created</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12 bg-white border border-dashed border-slate-200 rounded-xl">
          No assignments created yet.
        </div>
      ) : (
        assignments.map((assignment) => (
          <AssignmentItem key={assignment._id} assignment={assignment} />
        ))
      )}

    </div>
  );
};

export default ViewAssignments;