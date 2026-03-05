import { useAuth } from "../../context/AuthContext";
import { useParent } from "../../context/ParentContext";

const ParentTopbar = () => {
  const { user } = useAuth();
  const { childrenList, selectedChild, setSelectedChild } = useParent();


  return (
    <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">

      {/* Welcome */}
      <p className="text-sm text-slate-500">
        Welcome back, <span className="font-semibold text-slate-700">{user?.firstName}</span>
      </p>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Child selector */}
        {childrenList.length > 0 && (
          <select
            value={selectedChild?._id || ""}
            onChange={(e) => {
              const child = childrenList.find((c) => c._id === e.target.value);
              setSelectedChild(child);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150 cursor-pointer"
          >
            {childrenList.map((child) => (
              <option key={child._id} value={child._id}>
                {child.firstName} {child.lastName} — {child.standard}-{child.section}
              </option>
            ))}
          </select>
        )}
        
      </div>

    </header>
  );
};

export default ParentTopbar;