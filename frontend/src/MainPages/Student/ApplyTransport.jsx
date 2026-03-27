import { useEffect, useState } from "react";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const ApplyTransport = () => {

  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);

  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedStop, setSelectedStop] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔵 Fetch all routes
  const fetchRoutes = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/users/student/transport/routes",
        { credentials: "include" }
      );

      const data = await res.json();
      console.log(data.data)

      if (data.success) {
        setRoutes(data.data);
      }

    } catch (error) {
      console.log("Error fetching routes", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // 🔵 Fetch stops when route changes
  const fetchStops = async (routeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/users/student/transport/${routeId}/stops`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setStops(data.data);
      }

    } catch (error) {
      console.log("Error fetching stops", error);
    }
  };

  const handleRouteChange = (e) => {
    const routeId = e.target.value;

    setSelectedRoute(routeId);
    setSelectedStop(""); // reset stop
    setStops([]);

    if (routeId) {
      fetchStops(routeId);
    }
  };

  // 🔵 Apply request
  const handleApply = async () => {

    if (!selectedRoute || !selectedStop) {
      setMessage("Please select route and stop");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/users/student/transport/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            routeId: selectedRoute,
            stopName: selectedStop
          })
        }
      );

      const data = await res.json();

      setLoading(false);

      if (data.success) {
        setMessage("✅ Transport request submitted");
        setSelectedRoute("");
        setSelectedStop("");
        setStops([]);
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      console.log("Apply error", error);
      setLoading(false);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-xl">

      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Apply for Transport
      </h2>

      {/* MESSAGE */}
      {message && (
        <div className="mb-4 text-sm text-blue-600">
          {message}
        </div>
      )}

      {/* ROUTE SELECT */}
      <div className="mb-4">
        <label className="text-xs text-slate-500 mb-1 block">
          Select Route
        </label>
        <select
          value={selectedRoute}
          onChange={handleRouteChange}
          className={inputClass}
        >
          <option value="">Select route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>
      </div>

      {/* STOP SELECT */}
      <div className="mb-5">
        <label className="text-xs text-slate-500 mb-1 block">
          Select Stop
        </label>
        <select
          value={selectedStop}
          onChange={(e) => setSelectedStop(e.target.value)}
          className={inputClass}
          disabled={!stops.length}
        >
          <option value="">Select stop</option>
          {stops.map((stop, i) => (
            <option key={i} value={stop.stopName}>
              {stop.stopName}
            </option>
          ))}
        </select>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Applying..." : "Apply for Transport"}
      </button>

    </div>
  );
};

export default ApplyTransport;