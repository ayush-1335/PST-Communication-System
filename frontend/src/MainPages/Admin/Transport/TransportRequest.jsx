import { useEffect, useMemo, useState } from "react";

const TransportRequests = () => {

  const [requests, setRequests] = useState([]);
  const [buses, setBuses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedBus, setSelectedBus] = useState({}); // ⭐ per request

  // 🔵 Fetch Requests
  const fetchRequests = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5000/users/admin/transport/requests";

      if (statusFilter !== "ALL") {
        url += `?status=${statusFilter}`;
      }

      const res = await fetch(url, {
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        setRequests(data.data);
      }

      setLoading(false);

    } catch (error) {
      console.log("Error fetching requests", error);
      setLoading(false);
    }
  };

  // 🔵 Fetch Buses
  const fetchBuses = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/users/admin/transport/buses",
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setBuses(data.data);
      }

    } catch (err) {
      console.log("Error fetching buses", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchBuses();
  }, [statusFilter]);

  // 🔵 Search Filter
  const filteredRequests = useMemo(() => {
    if (!search) return requests;

    const s = search.toLowerCase();

    return requests.filter((r) =>
      `${r.student?.user?.firstName} 
       ${r.student?.user?.lastName} 
       ${r.student?.user?.username} 
       ${r.route?.routeName} 
       ${r.stop?.stopName}`
        .toLowerCase()
        .includes(s)
    );
  }, [requests, search]);

  // 🔵 Approve
  const handleApprove = async (requestId) => {
    const busId = selectedBus[requestId];

    if (!busId) {
      alert("Please select a bus");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/users/admin/transport/request/${requestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "APPROVE",
            busId
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchRequests();
        fetchBuses(); // refresh seat count
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log("Approve error", error);
    }
  };

  // 🔵 Reject
  const handleReject = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/users/admin/transport/request/${requestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "REJECT"
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchRequests();
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log("Reject error", error);
    }
  };

  const inputClass =
    "px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Transport Requests
        </h2>
        <button
          onClick={() => {
            fetchRequests();
            fetchBuses();
          }}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass + " flex-1"}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass + " cursor-pointer"}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="ACTIVE">Active</option>
          <option value="REJECTED">Rejected</option>
          <option value="EXPIRED">Expired</option>
        </select>

      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-slate-500 text-sm">
          Loading requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm">
          No requests found
        </div>
      ) : (

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Student</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Route</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Stop</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredRequests.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50">

                  <td className="px-4 py-3 text-sm text-slate-800">
                    {r.student?.user?.firstName} {r.student?.user?.lastName}
                    <div className="text-xs text-slate-400">
                      {r.student?.user?.username}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {r.route?.routeName}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-600">
                    {r.stop?.stopName}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium
                      ${r.status === "PENDING" && "bg-yellow-50 text-yellow-600 border border-yellow-100"}
                      ${r.status === "APPROVED" && "bg-blue-50 text-blue-600 border border-blue-100"}
                      ${r.status === "ACTIVE" && "bg-green-50 text-green-600 border border-green-100"}
                      ${r.status === "REJECTED" && "bg-red-50 text-red-600 border border-red-100"}
                      ${r.status === "EXPIRED" && "bg-gray-100 text-gray-600 border border-gray-200"}
                    `}>
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">

                    {r.status === "PENDING" ? (
                      <div className="flex gap-2 items-center">

                        {/* Bus Dropdown */}
                        <select
                          value={selectedBus[r._id] || ""}
                          onChange={(e) =>
                            setSelectedBus({
                              ...selectedBus,
                              [r._id]: e.target.value
                            })
                          }
                          className="px-2 py-1 border rounded text-xs"
                        >
                          <option value="">Select Bus</option>

                          {buses
                            .filter(b => b.route?._id === r.route?._id) // ⭐ route match
                            .map((bus) => (
                              <option
                                key={bus._id}
                                value={bus._id}
                                disabled={bus.isFull} // ⭐ disable full bus
                              >
                                {bus.busNumber} ({bus.assignedCount}/{bus.capacity})
                              </option>
                            ))}
                        </select>

                        {/* Approve */}
                        <button
                          onClick={() => handleApprove(r._id)}
                          disabled={!selectedBus[r._id]}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded disabled:opacity-50"
                        >
                          Approve
                        </button>

                        {/* Reject */}
                        <button
                          onClick={() => handleReject(r._id)}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                        >
                          Reject
                        </button>

                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
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