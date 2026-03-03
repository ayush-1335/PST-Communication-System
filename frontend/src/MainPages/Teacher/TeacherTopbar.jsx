import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TeacherTopbar = () => {
  const { user } = useAuth();


  return (
    <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">

      {/* Welcome */}
      <p className="text-sm text-slate-500">
        Welcome back, <span className="font-semibold text-slate-700">{user?.firstName || "Teacher"}</span>
      </p>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
          <img
            src={user?.avatar || "https://i.pravatar.cc/40"}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover border border-slate-200"
          />
          <span className="text-sm font-medium text-slate-600">{user?.firstName || "Teacher"}</span>
        </div>

      </div>

    </header>
  );
};

export default TeacherTopbar;