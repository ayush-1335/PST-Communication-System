import { useEffect, useState } from "react";
import StopAutocomplete from "./StopAutocomplete";

const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [stops, setStops] = useState([{ stopName: "", latitude: "", longitude: "" }]);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchRoutes = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/admin/transport/routes", { credentials: "include" });
      const data = await res.json();
      if (data.success) { setRoutes(data.data); setFilteredRoutes(data.data); }
    } catch (error) { console.log("Error fetching routes", error); }
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!routeName || stops.length === 0) { setError("Route name and stops are required"); return; }
    for (let stop of stops) {
      if (!stop.latitude || !stop.longitude) { setError("Please select a valid location for all stops"); return; }
    }
    const url = editingRouteId
      ? `http://localhost:5000/users/admin/transport/update-route/${editingRouteId}`
      : "http://localhost:5000/users/admin/transport/create-route";
    try {
      const res = await fetch(url, {
        method: editingRouteId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ routeName, stops }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(editingRouteId ? "Route updated successfully" : "Route created successfully");
        resetForm(); fetchRoutes();
      } else { setError(data.message); }
    } catch (error) { setError("Something went wrong"); }
  };

  const handleEdit = (route) => {
    setEditingRouteId(route._id);
    setRouteName(route.routeName);
    setStops(route.stops);
    setError(""); setSuccess("");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/users/admin/transport/delete-route/${id}`, {
        method: "DELETE", credentials: "include",
      });
      const data = await res.json();
      if (data.success) { setSuccess("Route deleted"); fetchRoutes(); }
    } catch (error) { setError("Error deleting route"); }
    finally { setConfirmDeleteId(null); }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setFilteredRoutes(routes.filter((r) => r.routeName.toLowerCase().includes(value.toLowerCase())));
  };

  const handleAddStop = () => setStops([...stops, { stopName: "", latitude: "", longitude: "" }]);
  const handleRemoveStop = (index) => setStops(stops.filter((_, i) => i !== index));
  const handleStopChange = (index, field, value) => {
    const updated = [...stops];
    updated[index][field] = value;
    setStops(updated);
  };

  const resetForm = () => {
    setRouteName(""); setStops([{ stopName: "", latitude: "", longitude: "" }]); setEditingRouteId(null);
  };

  return (
    <div className="space-y-6">

      {/* Form Card */}
      <div className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

        {/* Inline confirm popup for delete */}
        {confirmDeleteId && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 w-72">
              <p className="text-sm font-semibold text-slate-800 mb-1">Delete this route?</p>
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
            <h2 className="text-base font-semibold text-slate-900">
              {editingRouteId ? "Update Route" : "Create Route"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {editingRouteId ? "Edit route name and stops." : "Add a new transport route with stops."}
            </p>
          </div>
          {editingRouteId && (
            <span className="px-2.5 py-1 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-medium">Edit Mode</span>
          )}
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">✓ {success}</div>}

        {/* Route Name */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Route Name</label>
          <input placeholder="e.g. Varachha - School" value={routeName} onChange={(e) => setRouteName(e.target.value)} className={inputClass} />
        </div>

        {/* Stops */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Stops</label>
          <div className="space-y-3">
            {stops.map((stop, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex-1">
                  <StopAutocomplete index={index} stop={stop} handleStopChange={handleStopChange} />
                  {stop.latitude && stop.longitude && (
                    <p className="text-xs text-slate-400 mt-1.5">
                      📍 {parseFloat(stop.latitude).toFixed(5)}, {parseFloat(stop.longitude).toFixed(5)}
                    </p>
                  )}
                </div>
                {stops.length > 1 && (
                  <button
                    onClick={() => handleRemoveStop(index)}
                    className="mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all duration-150 text-sm shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button onClick={handleAddStop} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors duration-150">
            + Add Stop
          </button>
          <div className="flex gap-3">
            {editingRouteId && (
              <button onClick={resetForm} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors duration-150">
                Cancel
              </button>
            )}
            <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-150">
              {editingRouteId ? "Update Route" : "Create Route"}
            </button>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">All Routes</h3>
            <p className="text-xs text-slate-500 mt-0.5">{routes.length} route(s) total</p>
          </div>
        </div>

        <input
          placeholder="Search by route name..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className={inputClass}
        />
        {search && (
          <p className="text-xs text-slate-500">Found <span className="font-semibold text-slate-700">{filteredRoutes.length}</span> route(s)</p>
        )}

        {filteredRoutes.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl">
            {search ? "No routes match your search." : "No routes created yet."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Route Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stops</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoutes.map((route) => (
                  <tr key={route._id} className="hover:bg-slate-50 transition-colors duration-100">
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{route.routeName}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{route.stops.length} stops</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(route._id)}
                          className="px-3 py-1 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
                        >
                          Delete
                        </button>
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

export default RouteManagement;