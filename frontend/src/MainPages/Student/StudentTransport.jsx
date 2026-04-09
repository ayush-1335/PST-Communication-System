import { useEffect, useState } from "react";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const StudentTransport = () => {

  const [request, setRequest] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);

  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedStop, setSelectedStop] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [timeLeft, setTimeLeft] = useState("");

  // Fetch request
  const fetchRequest = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/users/student/transport/request",
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setRequest(data.data);
      }

    } catch (error) {
      console.log("Error fetching request", error);
    }
  };

  // Fetch routes
  const fetchRoutes = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/users/student/transport/routes",
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setRoutes(data.data);
      }

    } catch (error) {
      console.log("Error fetching routes", error);
    }
  };

  useEffect(() => {
    fetchRequest();
    fetchRoutes();
  }, []);

  // Fetch stops
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
    setSelectedStop("");
    setStops([]);

    if (routeId) fetchStops(routeId);
  };

  // Apply
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
          headers: { "Content-Type": "application/json" },
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
        fetchRequest(); // ⭐ refresh state
        setMessage("Request submitted");
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong");
    }
  };

  // Pay
  const handlePay = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/users/student/transport/pay",
        {
          method: "POST",
          credentials: "include"
        }
      );

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        fetchRequest();
      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setLoading(false);
      setMessage("Payment failed");
    }
  };

  // Countdown
  useEffect(() => {
    if (!request?.expiresAt) return;

    const interval = setInterval(() => {

      const diff = new Date(request.expiresAt) - new Date();

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m`);

    }, 1000);

    return () => clearInterval(interval);

  }, [request]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-xl">

      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Transport Service
      </h2>

      {message && (
        <div className="mb-4 text-sm text-blue-600">{message}</div>
      )}

      {!request && (
        <>
          <div className="mb-4 text-sm text-slate-500">
            Apply for transport service
          </div>

          {/* ROUTE */}
          <select value={selectedRoute} onChange={handleRouteChange} className={inputClass}>
            <option value="">Select route</option>
            {routes.map(r => (
              <option key={r._id} value={r._id}>{r.routeName}</option>
            ))}
          </select>

          {/* STOP */}
          <select
            value={selectedStop}
            onChange={(e) => setSelectedStop(e.target.value)}
            className={inputClass + " mt-3"}
            disabled={!stops.length}
          >
            <option value="">Select stop</option>
            {stops.map((s, i) => (
              <option key={i} value={s.stopName}>{s.stopName}</option>
            ))}
          </select>

          <button
            onClick={handleApply}
            className="w-full mt-4 py-2.5 bg-blue-500 text-white rounded-lg"
          >
            Apply
          </button>
        </>
      )}

      {request?.status === "PENDING" && (
        <div className="text-yellow-600 text-sm">
          Waiting for admin approval...
        </div>
      )}

      {request?.status === "APPROVED" && (
        <div>

          <div className="text-blue-600 text-sm mb-2">
            Approved! Pay within:
          </div>

          <div className="text-lg font-semibold mb-3">
            ⏳ {timeLeft}
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-2.5 bg-green-500 text-white rounded-lg"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

        </div>
      )}

      {request?.status === "ACTIVE" && (
        <div className="text-green-600 text-sm">
          Transport Active 🚍
        </div>
      )}

      {request?.status === "EXPIRED" && (
        <div>
          <div className="text-red-600 text-sm mb-3">
            Request expired. Apply again.
          </div>

          <button
            onClick={() => {
              setRequest(null);
              setMessage("");
            }}
            className="w-full py-2.5 bg-blue-500 text-white rounded-lg"
          >
            Reapply
          </button>
        </div>
      )}

      {request?.status === "REJECTED" && (
        <div>
          <div className="text-red-600 text-sm mb-3">
            Request rejected by admin.
          </div>

          <button
            onClick={() => {
              setRequest(null);
              setMessage("");
            }}
            className="w-full py-2.5 bg-blue-500 text-white rounded-lg"
          >
            Apply Again
          </button>
        </div>
      )}

    </div>
  );
};

export default StudentTransport;