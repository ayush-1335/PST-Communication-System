import { useEffect, useState } from "react";

const CreateDriver = () => {

  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [username, setUsername] = useState("");

  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");

  const [filter, setFilter] = useState("");

  const fetchDrivers = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/users/admin/transport/drivers",
        {
          credentials: "include"
        }
      );

      const data = await res.json();
      console.log(data.data)

      if (data.success) {
        setDrivers(data.data);
        setFilteredDrivers(data.data);
      }

    } catch (error) {
      console.log("Error fetching drivers", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleCreateDriver = async () => {

    // ⭐ UPDATED VALIDATION
    if (!firstName || !lastName || !licenseNumber || !phone) {
      alert("First name, last name, license number and phone number required");
      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/users/admin/transport/create-driver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            firstName,
            lastName,
            // username,
            licenseNumber,
            phone
          })
        }
      );

      const data = await res.json();

      if (data.success) {

        setFirstName("");
        setLastName("");
        // setUsername("")
        setLicenseNumber("");
        setPhone("");

        fetchDrivers();
      }

      else {
        alert(data.message);
      }

    } catch (error) {
      console.log("Error creating driver", error);
    }

  };

  const handleFilter = (value) => {

    setFilter(value);

    const filtered = drivers.filter((driver) =>
      `${driver.firstName || ""} ${driver.lastName || ""} ${driver.username || ""} ${driver.licenseNumber || ""} ${driver.phone || ""}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredDrivers(filtered);
  };

  return (
    <div className="bg-white border rounded-xl p-6">

      <h2 className="text-lg font-semibold mb-4">Create Driver</h2>

      {/* Create Driver Form */}

      <div className="flex gap-3 mb-6 flex-wrap">

        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        />

        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        />

        <input
          placeholder="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className="border px-3 py-2 rounded w-44"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border px-3 py-2 rounded w-44"
        />

        <button
          onClick={handleCreateDriver}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>

      </div>

      {/* Filter */}

      <input
        placeholder="Search driver..."
        value={filter}
        onChange={(e) => handleFilter(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      {/* Driver List */}

      <table className="w-full border">

        <thead className="bg-gray-100">
          <tr>
            {/* <th className="p-2 border">Username</th> */}
            <th className="p-2 border">First Name</th>
            <th className="p-2 border">Last Name</th>
            <th className="p-2 border">License Number</th>
            <th className="p-2 border">Phone Number</th>
          </tr>
        </thead>

        <tbody>

          {filteredDrivers.map((driver) => (
            <tr key={driver._id}>

              {/* <td className="p-2 border">{driver.username}</td> */}
              <td className="p-2 border">{driver.firstName}</td>
              <td className="p-2 border">{driver.lastName}</td>
              <td className="p-2 border">{driver.licenseNumber}</td>
              <td className="p-2 border">{driver.phone}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default CreateDriver;