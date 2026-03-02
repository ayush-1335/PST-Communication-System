import { useState } from "react";

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

const Field = ({ children, error }) => (
  <div>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const inputClass = "w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";
const selectClass = inputClass + " cursor-pointer";

const CreateUsers = () => {
  const [users, setUsers] = useState([createEmptyUser()]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const addRow = () => setUsers([...users, createEmptyUser()]);

  const removeRow = (index) => {
    if (users.length === 1) return;
    setUsers(users.filter((_, i) => i !== index));
  };

  const updateUser = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index] = {
      ...newUsers[index],
      [field]: value,
      errors: { ...newUsers[index].errors, [field]: "" },
    };
    setUsers(newUsers);
  };

  const validateUsers = () => {
    let isValid = true;
    const newUsers = [...users];
    newUsers.forEach((user, index) => {
      const errors = {};
      if (!user.firstName) errors.firstName = "Required";
      if (!user.lastName) errors.lastName = "Required";
      if (!user.username) errors.username = "Required";
      if (!user.password) errors.password = "Required";
      if (!user.role) errors.role = "Required";
      if (user.role === "STUDENT" && !user.standard) errors.standard = "Required";
      if (user.role === "TEACHER" && !user.subject) errors.subject = "Required";
      if (user.role === "PARENT" && !user.phone) errors.phone = "Required";
      if (Object.keys(errors).length > 0) isValid = false;
      newUsers[index].errors = errors;
    });
    setUsers(newUsers);
    return isValid;
  };

  const handleSubmit = async () => {
    setSuccess("");
    setError("");
    if (!validateUsers()) return;
    const payload = users.map(({ errors, ...rest }) => rest);
    try {
      const res = await fetch("http://localhost:5000/users/admin/bulk-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ users: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create users");
      setSuccess(`✓ ${payload.length} user(s) created successfully`);
      setUsers([createEmptyUser()]);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setUsers([createEmptyUser()]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Create Multiple Users</h2>
        <p className="text-sm text-slate-500 mt-0.5">Fill in the rows and submit to register users in bulk.</p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">{success}</div>
      )}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{error}</div>
      )}

      {/* Column Labels */}
      <div className="grid grid-cols-[32px_1fr_1fr_1fr_1fr_1fr_1fr] gap-3 mb-2 px-0.5">
        {["", "First Name", "Last Name", "Username", "Password", "Role", "Extra"].map((label, i) => (
          <span key={i} className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <div key={index} className="grid grid-cols-[32px_1fr_1fr_1fr_1fr_1fr_1fr] gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-3">

            {/* Remove */}
            <button
              onClick={() => removeRow(index)}
              disabled={users.length === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 text-sm mt-0.5"
            >
              ✕
            </button>

            <Field error={user.errors.firstName}>
              <input placeholder="First Name" value={user.firstName} onChange={(e) => updateUser(index, "firstName", e.target.value)} className={inputClass} />
            </Field>

            <Field error={user.errors.lastName}>
              <input placeholder="Last Name" value={user.lastName} onChange={(e) => updateUser(index, "lastName", e.target.value)} className={inputClass} />
            </Field>

            <Field error={user.errors.username}>
              <input placeholder="Username" value={user.username} onChange={(e) => updateUser(index, "username", e.target.value)} className={inputClass} />
            </Field>

            <Field error={user.errors.password}>
              <input placeholder="Password" value={user.password} onChange={(e) => updateUser(index, "password", e.target.value)} className={inputClass} />
            </Field>

            <Field error={user.errors.role}>
              <select value={user.role} onChange={(e) => updateUser(index, "role", e.target.value)} className={selectClass}>
                <option value="">Select Role</option>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="PARENT">Parent</option>
              </select>
            </Field>

            <div>
              {user.role === "STUDENT" && (
                <Field error={user.errors.standard}>
                  <input placeholder="Standard" value={user.standard} onChange={(e) => updateUser(index, "standard", e.target.value)} className={inputClass} />
                </Field>
              )}
              {user.role === "TEACHER" && (
                <Field error={user.errors.subject}>
                  <input placeholder="Subject" value={user.subject} onChange={(e) => updateUser(index, "subject", e.target.value)} className={inputClass} />
                </Field>
              )}
              {user.role === "PARENT" && (
                <Field error={user.errors.phone}>
                  <input placeholder="Phone" value={user.phone} onChange={(e) => updateUser(index, "phone", e.target.value)} className={inputClass} />
                </Field>
              )}
              {!user.role && (
                <div className="w-full h-[42px] rounded-lg bg-slate-100 border border-dashed border-slate-300" />
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={addRow}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors duration-150"
        >
          + Add Row
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-150"
        >
          Create Users
        </button>
      </div>

    </div>
  );
};

export default CreateUsers;