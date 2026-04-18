import { useEffect, useMemo, useState } from "react";

const statusConfig = {
  PENDING:  { style: "bg-yellow-50 border-yellow-200 text-yellow-600" },
  APPROVED: { style: "bg-blue-50 border-blue-100 text-blue-600" },
  ACTIVE:   { style: "bg-green-50 border-green-200 text-green-600" },
  REJECTED: { style: "bg-red-50 border-red-200 text-red-500" },
  EXPIRED:  { style: "bg-slate-100 border-slate-200 text-slate-500" },
};

const inputClass = "px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";

const TransportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBus, setSelectedBus] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== "ALL"
        ? `http://localhost:5000/users/admin/transport/requests?status=${statusFilter}`
        : "http://localhost:5000/users/admin/transport/requests";
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (error) { console.log("Error fetching requests", error); }
    finally { setLoading(false); }
  };

  const fetchBuses = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/admin/transport/buses", { credentials: "include" });
      const data = await res.json();
      if (data.success) setBuses(data.data);
    } catch (err) { console.log("Error fetching buses", err); }
  };

  useEffect(() => { fetchRequests(); fetchBuses(); }, [statusFilter]);

  const filteredRequests = useMemo(() => {
    if (!search) return requests;
    const s = search.toLowerCase();
    return requests.filter((r) =>
      `${r.student?.user?.firstName} ${r.student?.user?.lastName} ${r.student?.user?.username} ${r.route?.routeName} ${r.stop?.stopName}`
        .toLowerCase().includes(s)
    );
  }, [requests, search]);

  const handleApprove = async (requestId) => {
    setError(""); setSuccess("");
    const busId = selectedBus[requestId];
    if (!busId) { setError("Please select a bus before approving"); return; }
    try {
      const res = await fetch(`http://localhost:5000/users/admin/transport/request/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "APPROVE", busId }),
      });
      const data = await res.json();
      if (data.success) { setSuccess("Request approved successfully"); fetchRequests(); fetchBuses(); }
      else { setError(data.message); }
    } catch (error) { setError("Something went wrong"); }
  };

  const handleReject = async (requestId) => {
    setError(""); setSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/users/admin/transport/request/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "REJECT" }),
      });
      const data = await res.json();
      if (data.success) { setSuccess("Request rejected"); fetchRequests(); }
      else { setError(data.message); }
    } catch (error) { setError("Something went wrong"); }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Transport Requests</h2>
          <p className="text-sm text-slate-500 mt-0.5">{requests.length} request(s) found</p>
        </div>
        <button
          onClick={() => { fetchRequests(); fetchBuses(); }}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors duration-150"
        >
          Refresh
        </button>
      </div>

      {/* Messages */}
      {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
      {success && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">✓ {success}</div>}

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, route or stop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass + " flex-1"}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass + " cursor-pointer"}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="ACTIVE">Active</option>
          <option value="REJECTED">Rejected</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-slate-500 text-sm">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-200 rounded-xl">
          No requests found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Route</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stop</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 transition-colors duration-100">

                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-slate-800">{r.student?.user?.firstName} {r.student?.user?.lastName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.student?.user?.username}</p>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">{r.route?.routeName || "—"}</span>
                  </td>

                  <td className="px-5 py-3.5 text-sm text-slate-700">{r.stop?.stopName || "—"}</td>

                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-md border text-xs font-medium ${statusConfig[r.status]?.style || "bg-slate-100 text-slate-500"}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    {r.status === "PENDING" ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={selectedBus[r._id] || ""}
                          onChange={(e) => setSelectedBus({ ...selectedBus, [r._id]: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all duration-150"
                        >
                          <option value="">Select Bus</option>
                          {buses
                            .filter((b) => b.route?._id === r.route?._id)
                            .map((bus) => (
                              <option key={bus._id} value={bus._id} disabled={bus.isFull}>
                                {bus.busNumber} ({bus.assignedCount}/{bus.capacity}){bus.isFull ? " — Full" : ""}
                              </option>
                            ))}
                        </select>

                        <button
                          onClick={() => handleApprove(r._id)}
                          disabled={!selectedBus[r._id]}
                          className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors duration-150"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(r._id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:border-red-200 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-sm">—</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default TransportRequests;