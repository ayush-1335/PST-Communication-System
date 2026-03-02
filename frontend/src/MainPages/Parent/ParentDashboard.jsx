import { Outlet } from "react-router-dom";
import ParentSidebar from "./ParentSideBar";
import ParentTopbar from "./ParentTopbar";

const ParentDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <ParentSidebar />

      <div className="flex-1 flex flex-col">

        <ParentTopbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ParentDashboard;