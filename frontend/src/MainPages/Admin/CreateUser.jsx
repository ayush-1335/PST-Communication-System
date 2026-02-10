import { useState } from "react";

// Create fresh empty user
const createEmptyUser = () => ({
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  role: "",
  standard: "",
  subject: "",
  phone: "",
  errors: {},
});

const CreateUsers = () => {

  const [users, setUsers] = useState([createEmptyUser()]);

  const addRow = () => {
    setUsers([...users, createEmptyUser()]);
  };

  // Remove row
  const removeRow = (index) => {
    if (users.length === 1) return;
    setUsers(users.filter((_, i) => i !== index));
  };

  // Update field
  const updateUser = (index, field, value) => {
    const newUsers = [...users];

    newUsers[index] = {
      ...newUsers[index],
      [field]: value,
      errors: {
        ...newUsers[index].errors,
        [field]: "", // clear error on typing
      },
    };

    setUsers(newUsers);
  };

  // Validate all rows
  const validateUsers = () => {
    let isValid = true;
    const newUsers = [...users];

    newUsers.forEach((user, index) => {
      const errors = {};

      // Common required fields
      if (!user.firstName) errors.firstName = "Required";
      if (!user.lastName) errors.lastName = "Required";
      if (!user.username) errors.username = "Required";
      if (!user.password) errors.password = "Required";
      if (!user.role) errors.role = "Required";

      // Role-based required fields
      if (user.role === "STUDENT" && !user.standard) {
        errors.standard = "Required";
      }

      if (user.role === "TEACHER" && !user.subject) {
        errors.subject = "Required";
      }

      if (user.role === "PARENT" && !user.phone) {
        errors.phone = "Required";
      }

      if (Object.keys(errors).length > 0) {
        isValid = false;
      }

      newUsers[index].errors = errors;
    });

    setUsers(newUsers);
    return isValid;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateUsers()) return;

    // Remove errors before sending to backend
    const payload = users.map(({ errors, ...rest }) => rest);

    // console.log("VALID USERS:", payload);

    try {

      const res = await fetch("http://localhost:3000/users/admin/bulk-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          users: payload
        })
      })

      const data = await res.json()
      console.log("data", data)

    } catch (error) {
      console.log("Error in Bulk Register :", error)
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Create Multiple Users
      </h2>

      {users.map((user, index) => (
        <div
          key={index}
          className="grid grid-cols-7 gap-3 mb-4 items-start"
        >
          {/* Remove */}
          <button
            onClick={() => removeRow(index)}
            disabled={users.length === 1}
            className="bg-red-500 text-white py-1 rounded disabled:opacity-50 h-10.5 w-10"
          >
            ✕
          </button>

          {/* First Name */}
          <div>
            <input
              placeholder="First Name"
              value={user.firstName}
              onChange={(e) =>
                updateUser(index, "firstName", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            {user.errors.firstName && (
              <p className="text-red-500 text-xs">
                {user.errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <input
              placeholder="Last Name"
              value={user.lastName}
              onChange={(e) =>
                updateUser(index, "lastName", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            {user.errors.lastName && (
              <p className="text-red-500 text-xs">
                {user.errors.lastName}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              placeholder="Username"
              value={user.username}
              onChange={(e) =>
                updateUser(index, "username", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            {user.errors.username && (
              <p className="text-red-500 text-xs">
                {user.errors.username}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <input
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                updateUser(index, "password", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
            {user.errors.password && (
              <p className="text-red-500 text-xs">
                {user.errors.password}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <select
              value={user.role}
              onChange={(e) =>
                updateUser(index, "role", e.target.value)
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select Role</option>
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="PARENT">Parent</option>
            </select>
            {user.errors.role && (
              <p className="text-red-500 text-xs">
                {user.errors.role}
              </p>
            )}
          </div>

          {/* Role Fields */}
          <div>
            {user.role === "STUDENT" && (
              <>
                <input
                  placeholder="Standard"
                  value={user.standard}
                  onChange={(e) =>
                    updateUser(index, "standard", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
                {user.errors.standard && (
                  <p className="text-red-500 text-xs">
                    {user.errors.standard}
                  </p>
                )}
              </>
            )}

            {user.role === "TEACHER" && (
              <>
                <input
                  placeholder="Subject"
                  value={user.subject}
                  onChange={(e) =>
                    updateUser(index, "subject", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
                {user.errors.subject && (
                  <p className="text-red-500 text-xs">
                    {user.errors.subject}
                  </p>
                )}
              </>
            )}

            {user.role === "PARENT" && (
              <>
                <input
                  placeholder="Phone"
                  value={user.phone}
                  onChange={(e) =>
                    updateUser(index, "phone", e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
                {user.errors.phone && (
                  <p className="text-red-500 text-xs">
                    {user.errors.phone}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        <button
          onClick={addRow}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          + Add Row
        </button>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Create Users
        </button>
      </div>
    </div>
  );
};

export default CreateUsers;
