import { useEffect, useState } from "react";
import AssignmentItem from "./AssignmentItem";

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/users/teacher/assignments",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch assignments");
    }

    const data = await res.json();
    setAssignments(data);
  } catch (error) {
    console.error(error.message);
  }
};

    fetchAssignments();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        My Assignments
      </h2>

      {assignments.map((assignment) => (
        <AssignmentItem
          key={assignment._id}
          assignment={assignment}
        />
      ))}
    </div>
  );
};

export default ViewAssignments;
