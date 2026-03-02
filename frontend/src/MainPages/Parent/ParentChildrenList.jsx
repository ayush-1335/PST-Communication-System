import { useParent } from "../../context/ParentContext";

const ParentChildrenList = () => {

  const { childrenList, loading } = useParent();

  if (loading) {
    return <div className="text-center py-10">Loading children...</div>;
  }

  if (!childrenList || childrenList.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No children connected yet
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {childrenList.map((child) => (
        <div
          key={child._id}
          className="bg-white p-5 rounded-xl shadow border"
        >
          <h3 className="text-lg font-semibold mb-2">
            {child.firstName} {child.lastName}
          </h3>

          <p className="text-sm text-gray-600">
            Class: {child.standard}-{child.section}
          </p>

          <p className="text-sm text-gray-600">
            Student Code: {child.studentCode}
          </p>
        </div>
      ))}

    </div>
  );
};

export default ParentChildrenList;