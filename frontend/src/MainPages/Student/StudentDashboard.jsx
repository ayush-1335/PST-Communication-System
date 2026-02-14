import { Outlet } from "react-router-dom";
import StudentSideBar from "./StudentSideBar";
import StudentTopbar from "./StudentTopbar";

const StudentDashboard = () => {

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <StudentSideBar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <StudentTopbar />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* Header Row */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
            
            <h2 className="text-2xl font-semibold text-gray-800">
              Dashboard
            </h2>

            <button
              // onClick={refreshTeacherData}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 active:scale-95"
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* Child Routes */}
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[300px]">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
