import { useEffect, useState } from "react";

const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";
const selectClass = inputClass + " cursor-pointer";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [handlers, setHandlers] = useState([]);

  const [busNumber, setBusNumber] = useState("");
  const [busRegistrationNumber, setBusRegistrationNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [driver, setDriver] = useState("");
  const [route, setRoute] = useState("");
  const [handler, setHandler] = useState("");

  const [editingBusId, setEditingBusId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [busRes, driverRes, routeRes, handlerRes] = await Promise.all([
        fetch("http://localhost:5000/users/admin/transport/buses", { credentials: "include" }),
        fetch("http://localhost:5000/users/admin/transport/drivers", { credentials: "include" }),
        fetch("http://localhost:5000/users/admin/transport/routes", { credentials: "include" }),
        fetch("http://localhost:5000/users/admin/bus-handlers", { credentials: "include" }),
      ]);
      const [busData, driverData, routeData, handlerData] = await Promise.all([
        busRes.json(), driverRes.json(), routeRes.json(), handlerRes.json(),
      ]);
      if (busData.success) { setBuses(busData.data); setFilteredBuses(busData.data); }
      if (driverData.success) setDrivers(driverData.data);
      if (routeData.success) setRoutes(routeData.data);
      if (handlerData.success) setHandlers(handlerData.data);
    } catch (error) { console.log("Error fetching data", error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!busNumber || !busRegistrationNumber || !driver || !route || !handler) {
      setError("All required fields must be filled"); return;
    }
    const url = editingBusId
      ? `http://localhost:5000/users/admin/transport/update-bus/${editingBusId}`
      : "http://localhost:5000/users/admin/transport/create-bus";
    try {
      const res = await fetch(url, {
        method: editingBusId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ busNumber, busRegistrationNumber, capacity, driver, route, handler }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(editingBusId ? "Bus updated successfully" : "Bus created successfully");
        resetForm(); fetchData();
      } else { setError(data.message); }
    } catch (error) { setError("Something went wrong"); }
  };

  const handleEdit = (bus) => {
    setEditingBusId(bus._id);
    setBusNumber(bus.busNumber);
    setBusRegistrationNumber(bus.busRegistrationNumber);
    setCapacity(bus.capacity || "");
    setDriver(bus.driver?._id || "");
    setRoute(bus.route?._id || "");
    setHandler(bus.handler?._id || "");
    setError(""); setSuccess("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/users/admin/transport/delete-bus/${id}`, {
        method: "DELETE", credentials: "include",
      });
      const data = await res.json();
      if (data.success) { setSuccess("Bus deleted successfully"); fetchData(); }
      else { setError(data.message); }
    } catch (error) { setError("Error deleting bus"); }
    finally { setConfirmDeleteId(null); }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setFilteredBuses(buses.filter((bus) =>
      `${bus.busNumber} ${bus.busRegistrationNumber} ${bus.driver?.firstName || ""} ${bus.route?.routeName || ""} ${bus.handler?.firstName || ""}`
        .toLowerCase().includes(value.toLowerCase())
    ));
  };

  const resetForm = () => {
    setBusNumber(""); setBusRegistrationNumber(""); setCapacity("");
    setDriver(""); setRoute(""); setHandler(""); setEditingBusId(null);
  };

  return (
    <div className="space-y-6">

      {/* Form Card */}
      <div className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        {/* Delete confirm popup */}
        {confirmDeleteId && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 w-72">
              <p className="text-sm font-semibold text-slate-800 mb-1">Delete this bus?</p>
              <p className="text-xs text-slate-500 mb-4">This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(confirmDeleteId)} className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{editingBusId ? "Update Bus" : "Create Bus"}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{editingBusId ? "Edit bus details below." : "Register a new bus to the transport system."}</p>
          </div>
          {editingBusId && (
            <span className="px-2.5 py-1 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">Edit Mode</span>
          )}
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">✓ {success}</div>}

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bus Number</label>
            <input placeholder="e.g. GJ-01-AB-1234" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Registration Number</label>
            <input placeholder="e.g. GJ05 2024 0001" value={busRegistrationNumber} onChange={(e) => setBusRegistrationNumber(e.target.value)} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Capacity</label>
            <input type="number" placeholder="e.g. 40" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Driver</label>
            <select value={driver} onChange={(e) => setDriver(e.target.value)} className={selectClass}>
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>{d.firstName} {d.lastName} ({d.licenseNumber})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bus Handler</label>
            <select value={handler} onChange={(e) => setHandler(e.target.value)} className={selectClass}>
              <option value="">Select Handler</option>
              {handlers.map((h) => (
                <option key={h.user._id} value={h.user._id}>{h.user.firstName} {h.user.lastName} ({h.user.username})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Route</label>
            <select value={route} onChange={(e) => setRoute(e.target.value)} className={selectClass}>
              <option value="">Select Route</option>
              {routes.map((r) => (
                <option key={r._id} value={r._id}>{r.routeName}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {editingBusId && (
            <button onClick={resetForm} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors duration-150">
              Cancel
            </button>
          )}
          <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-150">
            {editingBusId ? "Update Bus" : "Create Bus"}
          </button>
        </div>

      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">All Buses</h3>
            <p className="text-xs text-slate-500 mt-0.5">{buses.length} bus(es) registered</p>
          </div>
        </div>

        <input
          placeholder="Search by bus number, driver, route, handler..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className={inputClass}
        />
        {search && (
          <p className="text-xs text-slate-500">Found <span className="font-semibold text-slate-700">{filteredBuses.length}</span> bus(es)</p>
        )}

        {filteredBuses.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl">
            {search ? "No buses match your search." : "No buses registered yet."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Bus No</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Reg No</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Driver</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Handler</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Route</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBuses.map((bus) => (
                  <tr key={bus._id} className="hover:bg-slate-50 transition-colors duration-100">
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium">{bus.busNumber}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{bus.busRegistrationNumber}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">
                      {bus.driver ? `${bus.driver.firstName} ${bus.driver.lastName}` : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">
                      {bus.handler ? `${bus.handler.firstName} ${bus.handler.lastName}` : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {bus.route?.routeName
                        ? <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{bus.route.routeName}</span>
                        : <span className="text-slate-400 text-sm">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(bus)} className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150">Edit</button>
                        <button onClick={() => setConfirmDeleteId(bus._id)} className="px-3 py-1 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all duration-150">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default BusManagement;