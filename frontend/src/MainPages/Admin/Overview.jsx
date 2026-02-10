import AssignClassTeacher from "./AssignClassTeacher";
import AssignStudentsToClass from "./AssignStudentsToClass";
import AssignTeacherClasses from "./AssignTeacherClasses";
import BulkCreateClasses from "./BulkCreateClasses";

const Overview = () => {
  return (
    <>
      <BulkCreateClasses />
      <br />
      <AssignClassTeacher />
      <br />
      <AssignTeacherClasses />
      <br />
      <AssignStudentsToClass />
    </>
  )

};

export default Overview;