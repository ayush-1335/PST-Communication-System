import { useAuth } from "../../context/AuthContext";
import { useParent } from "../../context/ParentContext";

const ParentTopbar = () => {

  const { user } = useAuth();
  const { childrenList, selectedChild, setSelectedChild } = useParent();

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      <h1 className="text-lg font-semibold">
        Welcome {user?.firstName}
      </h1>

      {/* Child Toggle */}
      {childrenList.length > 0 && (
        <select
          value={selectedChild?._id || ""}
          onChange={(e) => {
            const child = childrenList.find(
              (c) => c._id === e.target.value
            );
            setSelectedChild(child);
          }}
          className="border rounded-md px-3 py-1 text-sm"
        >
          {childrenList.map((child) => (
            <option key={child._id} value={child._id}>
              {child.firstName} {child.lastName} — {child.standard}-{child.section}
            </option>
          ))}
        </select>
      )}

    </div>
  );
};

export default ParentTopbar;