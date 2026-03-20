import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const createEmptyUser = () => ({
  firstName: "",
  lastName: "",
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

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const selectClass = inputClass + " cursor-pointer";

const CreateUsers = () => {
  const [users, setUsers] = useState([createEmptyUser()]);
  const [result, setResult] = useState(null);

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
      if (!user.role) errors.role = "Required";

      if (user.role === "STUDENT" && !user.standard)
        errors.standard = "Required";

      if (user.role === "TEACHER" && !user.subject)
        errors.subject = "Required";

      if (user.role === "PARENT" && !user.phone)
        errors.phone = "Required";

      if (Object.keys(errors).length > 0) isValid = false;

      newUsers[index].errors = errors;
    });

    setUsers(newUsers);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateUsers()) return;

    const payload = users.map(({ errors, ...rest }) => rest);

    try {
      const res = await fetch(
        "http://localhost:5000/users/admin/bulk-register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ users: payload }),
        }
      );

      const data = await res.json();

      setResult({
        success: data.data?.createdUsers || [],
        failed: data.data?.failedUsers || [],
      });

      setUsers([createEmptyUser()]);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const formatSuccessData = () => {
    return result.success.map((u) => ({
      Username: u.username,
      Password: u.tempPassword,
      Name: `${u.firstName || ""} ${u.lastName || ""}`,
      Role: u.role || ""
    }));
  };

  // 📄 Excel Download
  const downloadExcel = () => {
    if (!result?.success?.length) return;

    const formatted = formatSuccessData();

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "created_users.xlsx");
  };

  // 📄 PDF Download
  const downloadPDF = () => {
    if (!result?.success?.length) return;

    const doc = new jsPDF();

    const formatted = formatSuccessData();

    const tableData = formatted.map((u) => [
      u.Name,
      u.Username,
      u.Password,
      u.Role
    ]);

    autoTable(doc, {
      head: [["Name", "Username", "Password", "Role"]], // ⭐ CHANGE
      body: tableData,
    });

    doc.save("created_users.pdf");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

      <h2 className="text-lg font-semibold mb-4">Create Multiple Users</h2>

      {/* RESULT */}
      {result && (
        <div className="mb-6 space-y-4">

          {result.success.length > 0 && (
            <div className="bg-green-50 border border-green-200 p-4 rounded">

              <p className="font-semibold text-green-700 mb-2">
                Created ({result.success.length})
              </p>

              {result.success.map((u, i) => (
                <div key={i} className="text-sm text-green-700">
                  {u.username} | {u.tempPassword} — {u.firstName} {u.lastName} ({u.role})
                </div>
              ))}

              <div className="flex gap-3 mt-4">

                <button
                  onClick={downloadExcel}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Download Excel
                </button>

                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Download PDF
                </button>

              </div>

            </div>
          )}

          {result.failed.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded">

              <p className="font-semibold text-red-600 mb-2">
                Failed ({result.failed.length})
              </p>

              {result.failed.map((u, i) => (
                <div key={i} className="text-sm text-red-600">
                  {u.username || "Unknown"} — {u.reason}
                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {/* FORM */}
      <div className="space-y-3">

        {users.map((user, index) => (
          <div
            key={index}
            className="grid grid-cols-[32px_1fr_1fr_1fr_1fr] gap-3 bg-slate-50 border p-3 rounded"
          >

            <button
              onClick={() => removeRow(index)}
              className="text-red-500"
            >
              ✕
            </button>

            <Field error={user.errors.firstName}>
              <input
                placeholder="First Name"
                value={user.firstName}
                onChange={(e) =>
                  updateUser(index, "firstName", e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field error={user.errors.lastName}>
              <input
                placeholder="Last Name"
                value={user.lastName}
                onChange={(e) =>
                  updateUser(index, "lastName", e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field error={user.errors.role}>
              <select
                value={user.role}
                onChange={(e) =>
                  updateUser(index, "role", e.target.value)
                }
                className={selectClass}
              >
                <option value="">Role</option>
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="PARENT">Parent</option>
                <option value="TRANSPORT_HANDLER">Bus Handler</option>
              </select>
            </Field>

            <div>
              {user.role === "STUDENT" && (
                <Field error={user.errors.standard}>
                  <input
                    placeholder="Standard"
                    value={user.standard}
                    onChange={(e) =>
                      updateUser(index, "standard", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              )}

              {user.role === "TEACHER" && (
                <Field error={user.errors.subject}>
                  <input
                    placeholder="Subject"
                    value={user.subject}
                    onChange={(e) =>
                      updateUser(index, "subject", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              )}

              {user.role === "PARENT" && (
                <Field error={user.errors.phone}>
                  <input
                    placeholder="Phone"
                    value={user.phone}
                    onChange={(e) =>
                      updateUser(index, "phone", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              )}

              {user.role === "TRANSPORT_HANDLER" && (
                <Field error={user.errors.phone}>
                  <input
                    placeholder="Phone"
                    value={user.phone}
                    onChange={(e) =>
                      updateUser(index, "phone", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              )}
            </div>

          </div>
        ))}

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={addRow}
          className="px-4 py-2 border rounded"
        >
          + Add Row
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Users
        </button>

      </div>

    </div>
  );
};

export default CreateUsers;