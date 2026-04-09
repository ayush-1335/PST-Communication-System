import { useEffect, useState } from "react";

const BusListWithStudents = () => {

  const [buses, setBuses] = useState([]);
  const [expandedBus, setExpandedBus] = useState(null);
  const [busStudentsMap, setBusStudentsMap] = useState({});
  const [loadingBusId, setLoadingBusId] = useState(null);

  // ✅ Fetch all buses
  const fetchBuses = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/users/admin/transport/buses",
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Failed to fetch buses");

      const data = await res.json();

      if (data.success) {
        setBuses(data.data);
      }

    } catch (err) {
      console.error("Error fetching buses", err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // ✅ Handle expand
  const handleExpand = async (busId) => {

    // collapse
    if (expandedBus === busId) {
      setExpandedBus(null);
      return;
    }

    setExpandedBus(busId);

    // already fetched
    if (busStudentsMap[busId]) return;

    try {
      setLoadingBusId(busId);

      const res = await fetch(
        `http://localhost:5000/users/admin/transport/single-bus/${busId}`,
        { credentials: "include" } // 🔥 IMPORTANT FIX
      );

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();

      console.log("single bus:", data);

      if (data.success) {
        setBusStudentsMap((prev) => ({
          ...prev,
          [busId]: data.data.students || []
        }));
      }

    } catch (err) {
      console.error("Error fetching students", err);
    } finally {
      setLoadingBusId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bus List</h2>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 w-10"></th>
            <th className="p-2">Bus No</th>
            <th className="p-2">Route</th>
            <th className="p-2">Seats</th>
          </tr>
        </thead>

        <tbody>
          {buses.map((bus) => (
            <tr key={bus._id}>
              <td colSpan="4" className="p-0">

                {/* 🔹 Main Row */}
                <div
                  onClick={() => handleExpand(bus._id)}
                  className="grid grid-cols-4 cursor-pointer border-t hover:bg-gray-100 p-2"
                >
                  <div>
                    {expandedBus === bus._id ? "▼" : "▶"}
                  </div>

                  <div>{bus.busNumber}</div>

                  <div>{bus.route?.routeName}</div>

                  <div>
                    {bus.assignedCount}/{bus.capacity}
                  </div>
                </div>

                {/* 🔹 Expanded Section */}
                {expandedBus === bus._id && (
                  <div className="bg-gray-50 p-3 border-t">

                    {loadingBusId === bus._id ? (
                      <p>Loading students...</p>
                    ) : (
                      <>
                        <p className="font-semibold mb-2">
                          Students ({busStudentsMap[bus._id]?.length || 0})
                        </p>

                        {busStudentsMap[bus._id]?.length === 0 ? (
                          <p>No students assigned</p>
                        ) : (
                          <ul className="list-disc pl-5">
                            {busStudentsMap[bus._id]?.map((item) => (
                              <li key={item._id}>
                                {item.student?.user.firstName}{" "}
                                {item.student?.user.lastName}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}

                  </div>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusListWithStudents;