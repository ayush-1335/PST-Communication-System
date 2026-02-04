import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Info = ({ label, value, editable, onChange }) => (
  <div className="flex items-center justify-between border-b border-gray-200 py-3">
    <span className="text-sm font-medium text-gray-600">{label}</span>

    {editable ? (
      <input
        className="text-sm text-gray-900 border rounded-md px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <span className="text-sm text-gray-900 break-all">
        {value || "-"}
      </span>
    )}
  </div>
);


const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      {title}
    </h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const Profile = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    subject: user?.subject || "",
    address: user?.address || {
      houseNo: "",
      street: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  if (loading) return <div className="flex justify-center h-64">Loading...</div>;
  if (!user) return <div className="text-center text-red-500">Not logged in</div>;

  const handleUpdate = () => {
    console.log("Updated data:", formData);
    // 🔥 Call update profile API here
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow border">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      <Section title="Basic Information">
        <Info
          label="First Name"
          value={formData.firstName}
          editable={isEditing}
          onChange={(v) => setFormData({ ...formData, firstName: v })}
        />

        <Info
          label="Last Name"
          value={formData.lastName}
          editable={isEditing}
          onChange={(v) => setFormData({ ...formData, lastName: v })}
        />

        <Info label="Email" value={user.email} />
        <Info label="Username" value={user.username} />
        <Info label="Role" value={user.role} />
      </Section>

      {/* STUDENT */}
      {user.role === "STUDENT" && (
        <Section title="Student Information">
          <div className="grid grid-cols-2 gap-4">
            {["houseNo", "street", "city", "state", "pincode"].map((field) => (
              <input
                key={field}
                disabled={!isEditing}
                value={formData.address[field]}
                placeholder={field}
                className="border px-3 py-2 rounded-md text-sm"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      [field]: e.target.value
                    }
                  })
                }
              />
            ))}
          </div>
        </Section>
      )}

      {/* TEACHER */}
      {user.role === "TEACHER" && (
        <Section title="Teacher Information">
          <Info
            label="Subject"
            value={formData.subject}
            editable={isEditing}
            onChange={(v) => setFormData({ ...formData, subject: v })}
          />
        </Section>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 mt-8">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile