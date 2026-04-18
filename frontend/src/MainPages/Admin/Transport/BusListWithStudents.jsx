import { useEffect, useState } from "react";

const BusListWithStudents = () => {
  const [buses, setBuses] = useState([]);
  const [expandedBus, setExpandedBus] = useState(null);
  const [busStudentsMap, setBusStudentsMap] = useState({});
  const [loadingBusId, setLoadingBusId] = useState(null);

  const fetchBuses = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/admin/transport/buses", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch buses");
      const data = await res.json();
      if (data.success) setBuses(data.data);
    } catch (err) { console.error("Error fetching buses", err); }
  };

  useEffect(() => { fetchBuses(); }, []);

  const handleExpand = async (busId) => {
    if (expandedBus === busId) { setExpandedBus(null); return; }
    setExpandedBus(busId);
    if (busStudentsMap[busId]) return;
    try {
      setLoadingBusId(busId);
      const res = await fetch(`http://localhost:5000/users/admin/transport/single-bus/${busId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      if (data.success) setBusStudentsMap((prev) => ({ ...prev, [busId]: data.data.students || [] }));
    } catch (err) { console.error("Error fetching students", err); }
    finally { setLoadingBusId(null); }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Bus List</h2>
        <p className="text-sm text-slate-500 mt-0.5">{buses.length} bus(es) registered — click to view assigned students</p>
      </div>

      {buses.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl">
          No buses registered yet.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_1fr_100px] bg-slate-50 border-b border-slate-200 px-5 py-3">
            <span />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bus No</span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Route</span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Seats</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {buses.map((bus) => {
              const isOpen = expandedBus === bus._id;
              const students = busStudentsMap[bus._id] || [];
              const isLoading = loadingBusId === bus._id;

              return (
                <div key={bus._id}>
                  {/* Main Row */}
                  <button
                    onClick={() => handleExpand(bus._id)}
                    className={`w-full grid grid-cols-[40px_1fr_1fr_100px] items-center px-5 py-3.5 text-left transition-colors duration-100 ${isOpen ? "bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <span className={`text-slate-400 text-sm transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>▶</span>

                    <span className="text-sm font-medium text-slate-800">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">{bus.busNumber}</span>
                    </span>

                    <span className="text-sm text-slate-700">
                      {bus.route?.routeName
                        ? <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{bus.route.routeName}</span>
                        : <span className="text-slate-400">—</span>}
                    </span>

                    <span className="text-sm text-slate-700">
                      <span className={`font-semibold ${bus.assignedCount >= bus.capacity ? "text-red-500" : "text-slate-800"}`}>
                        {bus.assignedCount}
                      </span>
                      <span className="text-slate-400">/{bus.capacity}</span>
                    </span>
                  </button>

                  {/* Expanded Students */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                      {isLoading ? (
                        <p className="text-sm text-slate-500">Loading students...</p>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                            Students ({students.length})
                          </p>

                          {students.length === 0 ? (
                            <p className="text-sm text-slate-400">No students assigned to this bus.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {students.map((item) => (
                                <div key={item._id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center shrink-0">
                                    {item.student?.user.firstName?.[0]}
                                  </div>
                                  <span className="text-sm text-slate-700">
                                    {item.student?.user.firstName} {item.student?.user.lastName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default BusListWithStudents;