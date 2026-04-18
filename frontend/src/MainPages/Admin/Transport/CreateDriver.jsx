import { useEffect, useState } from "react";

const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";

const CreateDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDrivers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/admin/transport/drivers", { credentials: "include" });
      const data = await res.json();
      if (data.success) { setDrivers(data.data); setFilteredDrivers(data.data); }
    } catch (error) {
      console.log("Error fetching drivers", error);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleCreateDriver = async () => {
    setError(""); setSuccess("");
    if (!firstName || !lastName || !licenseNumber || !phone) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/users/admin/transport/create-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, licenseNumber, phone }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Driver created successfully");
        setFirstName(""); setLastName(""); setLicenseNumber(""); setPhone("");
        fetchDrivers();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const handleFilter = (value) => {
    setFilter(value);
    setFilteredDrivers(
      drivers.filter((d) =>
        `${d.firstName} ${d.lastName} ${d.licenseNumber} ${d.phone}`
          .toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-900">Create Driver</h2>
        <p className="text-sm text-slate-500 mt-0.5">Add a new driver to the transport system.</p>
      </div>

      {/* Messages */}
      {error && <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-500 text-sm">{error}</div>}
      {success && <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">✓ {success}</div>}

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</label>
          <input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</label>
          <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">License Number</label>
          <input placeholder="e.g. GJ05 20240001" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</label>
          <input type="tel" placeholder="e.g. 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCreateDriver}
          className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-150"
        >
          Create Driver
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          placeholder="Search by name, license or phone..."
          value={filter}
          onChange={(e) => handleFilter(e.target.value)}
          className={inputClass}
        />
        {filter && (
          <p className="text-xs text-slate-500 mt-2">
            Found <span className="font-semibold text-slate-700">{filteredDrivers.length}</span> driver(s)
          </p>
        )}
      </div>

      {/* Table */}
      {filteredDrivers.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-12 border border-dashed border-slate-200 rounded-xl">
          {filter ? "No drivers match your search." : "No drivers added yet."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">License Number</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrivers.map((driver) => (
                <tr key={driver._id} className="hover:bg-slate-50 transition-colors duration-100">
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{driver.firstName}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{driver.lastName}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono">{driver.licenseNumber}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{driver.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default CreateDriver;