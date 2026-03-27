import { useEffect, useState } from "react";

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

    const fetchData = async () => {
        try {

            const [busRes, driverRes, routeRes, handlerRes] = await Promise.all([
                fetch("http://localhost:5000/users/admin/transport/buses", { credentials: "include" }),
                fetch("http://localhost:5000/users/admin/transport/drivers", { credentials: "include" }),
                fetch("http://localhost:5000/users/admin/transport/routes", { credentials: "include" }),
                fetch("http://localhost:5000/users/admin/bus-handlers", { credentials: "include" })
            ]);

            const busData = await busRes.json();
            const driverData = await driverRes.json();
            const routeData = await routeRes.json();
            const handlerData = await handlerRes.json();

            if (busData.success) {
                setBuses(busData.data);
                setFilteredBuses(busData.data);
            }

            if (driverData.success) setDrivers(driverData.data);
            if (routeData.success) setRoutes(routeData.data);
            if (handlerData.success) setHandlers(handlerData.data); // ⭐ NEW

        } catch (error) {
            console.log("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {

        if (!busNumber || !busRegistrationNumber || !driver || !route || !handler) {
            alert("All required fields must be filled");
            return;
        }

        const url = editingBusId
            ? `http://localhost:5000/users/admin/transport/update-bus/${editingBusId}`
            : "http://localhost:5000/users/admin/transport/create-bus";

        const method = editingBusId ? "PUT" : "POST";

        try {

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    busNumber,
                    busRegistrationNumber,
                    capacity,
                    driver,
                    route,
                    handler
                })
            });

            const data = await res.json();

            if (data.success) {
                resetForm();
                fetchData();
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Error saving bus", error);
        }
    };

    const handleEdit = (bus) => {
        setEditingBusId(bus._id);
        setBusNumber(bus.busNumber);
        setBusRegistrationNumber(bus.busRegistrationNumber);
        setCapacity(bus.capacity || "");
        setDriver(bus.driver?._id || "");
        setRoute(bus.route?._id || "");
        setHandler(bus.handler?._id || "");
    };

    const handleDelete = async (id) => {

        if (!confirm("Are you sure you want to delete this bus?")) return;

        try {

            const res = await fetch(
                `http://localhost:5000/users/admin/transport/delete-bus/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await res.json();

            if (data.success) fetchData();

        } catch (error) {
            console.log("Error deleting bus", error);
        }
    };

    const handleSearch = (value) => {

        setSearch(value);

        const filtered = buses.filter((bus) =>
            `${bus.busNumber} ${bus.busRegistrationNumber} ${bus.driver?.firstName || ""} ${bus.route?.routeName || ""} ${bus.handler?.firstName || ""}`
                .toLowerCase()
                .includes(value.toLowerCase())
        );

        setFilteredBuses(filtered);
    };

    const resetForm = () => {
        setBusNumber("");
        setBusRegistrationNumber("");
        setCapacity("");
        setDriver("");
        setRoute("");
        setHandler("");
        setEditingBusId(null);
    };

    return (
        <div className="bg-white border rounded-xl p-6">

            <h2 className="text-lg font-semibold mb-4">
                {editingBusId ? "Update Bus" : "Create Bus"}
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-4">

                <input
                    placeholder="Bus Number"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="border px-3 py-2 rounded"
                />

                <input
                    placeholder="Registration Number"
                    value={busRegistrationNumber}
                    onChange={(e) => setBusRegistrationNumber(e.target.value)}
                    className="border px-3 py-2 rounded"
                />

                <input
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="border px-3 py-2 rounded"
                />

                <select value={driver} onChange={(e) => setDriver(e.target.value)} className="border px-3 py-2 rounded">
                    <option value="">Select Driver</option>
                    {drivers.map((d) => (
                        <option key={d._id} value={d._id}>
                            {d.firstName} {d.lastName} ({d.licenseNumber})
                        </option>
                    ))}
                </select>

                <select
                    value={handler}
                    onChange={(e) => setHandler(e.target.value)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="">Select Handler</option>

                    {handlers.map((h) => (
                        <option key={h.user._id} value={h.user._id}> {/* ✅ FIX */}
                            {h.user.firstName} {h.user.lastName} ({h.user.username})
                        </option>
                    ))}

                </select>

                <select value={route} onChange={(e) => setRoute(e.target.value)} className="border px-3 py-2 rounded">
                    <option value="">Select Route</option>
                    {routes.map((r) => (
                        <option key={r._id} value={r._id}>
                            {r.routeName}
                        </option>
                    ))}
                </select>

            </div>

            <div className="flex gap-3 mb-6">

                <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                    {editingBusId ? "Update" : "Create"}
                </button>

                {editingBusId && (
                    <button onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                )}

            </div>

            <input
                placeholder="Search bus..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="border px-3 py-2 rounded mb-4 w-full"
            />

            {/* TABLE */}
            <table className="w-full border">

                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Bus No</th>
                        <th className="p-2 border">Reg No</th>
                        <th className="p-2 border">Driver</th>
                        <th className="p-2 border">Handler</th>
                        <th className="p-2 border">Route</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredBuses.map((bus) => (
                        <tr key={bus._id}>

                            <td className="p-2 border">{bus.busNumber}</td>
                            <td className="p-2 border">{bus.busRegistrationNumber}</td>

                            <td className="p-2 border">
                                {bus.driver
                                    ? `${bus.driver.firstName} ${bus.driver.lastName}`
                                    : "—"}
                            </td>

                            <td className="p-2 border">
                                {bus.handler
                                    ? `${bus.handler.firstName} ${bus.handler.lastName}`
                                    : "—"}
                            </td>

                            <td className="p-2 border">
                                {bus.route?.routeName || "—"}
                            </td>

                            <td className="p-2 border flex gap-2">

                                <button
                                    onClick={() => handleEdit(bus)}
                                    className="bg-yellow-400 px-2 py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(bus._id)}
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

export default BusManagement;