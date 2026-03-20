import { useEffect, useState } from "react";
import StopAutocomplete from "./StopAutocomplete";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const [routeName, setRouteName] = useState("");
  const [stops, setStops] = useState([
    { stopName: "", latitude: "", longitude: "" }
  ]);

  const [editingRouteId, setEditingRouteId] = useState(null);
  const [search, setSearch] = useState("");

  // FETCH ROUTES
  const fetchRoutes = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/users/admin/transport/routes",
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setRoutes(data.data);
        setFilteredRoutes(data.data);
      }
    } catch (error) {
      console.log("Error fetching routes", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // CREATE / UPDATE
  const handleSubmit = async () => {
    if (!routeName || stops.length === 0) {
      alert("Route name and stops required");
      return;
    }

    // ✅ Validate lat/lng
    for (let stop of stops) {
      if (!stop.latitude || !stop.longitude) {
        alert("Please select valid location for all stops");
        return;
      }
    }

    const url = editingRouteId
      ? `http://localhost:5000/users/admin/transport/update-route/${editingRouteId}`
      : "http://localhost:5000/users/admin/transport/create-route";

    const method = editingRouteId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ routeName, stops })
      });

      const data = await res.json();

      if (data.success) {
        resetForm();
        fetchRoutes();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error saving route", error);
    }
  };

  // EDIT
  const handleEdit = (route) => {
    setEditingRouteId(route._id);
    setRouteName(route.routeName);
    setStops(route.stops);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/users/admin/transport/delete-route/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchRoutes();
      }
    } catch (error) {
      console.log("Error deleting route", error);
    }
  };

  // SEARCH
  const handleSearch = (value) => {
    setSearch(value);

    const filtered = routes.filter((route) =>
      route.routeName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRoutes(filtered);
  };

  // STOP HANDLERS
  const handleAddStop = () => {
    setStops([...stops, { stopName: "", latitude: "", longitude: "" }]);
  };

  const handleRemoveStop = (index) => {
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
  };

  const handleStopChange = (index, field, value) => {
    const updated = [...stops];
    updated[index][field] = value;
    setStops(updated);
  };

  // RESET
  const resetForm = () => {
    setRouteName("");
    setStops([{ stopName: "", latitude: "", longitude: "" }]);
    setEditingRouteId(null);
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4">
        {editingRouteId ? "Update Route" : "Create Route"}
      </h2>

      {/* ROUTE NAME */}
      <input
        placeholder="Route Name"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      {/* STOPS */}
      <div className="space-y-3 mb-4">
        {stops.map((stop, index) => (
          <div key={index} className="flex gap-3 flex-wrap items-center">
            <StopAutocomplete
              index={index}
              stop={stop}
              handleStopChange={handleStopChange}
            />

            {/* Show lat/lng */}
            <p className="text-xs text-gray-500">
              {stop.latitude && stop.longitude
                ? `Lat: ${stop.latitude}, Lng: ${stop.longitude}`
                : "No location selected"}
            </p>

            <button
              onClick={() => handleRemoveStop(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddStop}
        className="bg-gray-200 px-3 py-1 rounded mb-3"
      >
        + Add Stop
      </button>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingRouteId ? "Update" : "Create"}
        </button>

        {editingRouteId && (
          <button
            onClick={resetForm}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search route..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Route Name</th>
            <th className="p-2 border">Stops</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredRoutes.map((route) => (
            <tr key={route._id}>
              <td className="p-2 border">{route.routeName}</td>

              <td className="p-2 border">{route.stops.length}</td>

              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(route)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(route._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteManagement;