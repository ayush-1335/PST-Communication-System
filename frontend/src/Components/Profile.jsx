import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Info = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    <span className="text-sm text-slate-700 break-all">{value || "—"}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{title}</h2>
    <div className="bg-white border border-slate-200 rounded-xl px-5 shadow-sm">{children}</div>
  </div>
);

const Profile = () => {
  const { user, loading } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <span className="text-slate-400 text-sm">Loading...</span>
    </div>
  );
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <span className="text-red-400 text-sm">Not logged in</span>
    </div>
  );

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      console.log("Data:", data.data)

      if (!res.ok) {
        setMessage(data.message || "Failed to change password");
        return;
      }

      setMessage("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });

    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <img
            src={user?.avatar || "https://i.pravatar.cc/80"}
            alt="avatar"
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-500 text-xs font-medium">
              {user.role}
            </span>
          </div>
        </div>

        {/* Basic Info */}
        <Section title="Basic Information">
          <Info label="First Name" value={user.firstName} />
          <Info label="Last Name" value={user.lastName} />
          <Info label="Username" value={user.username} />
          <Info label="Role" value={user.role} />
        </Section>

        {/* STUDENT */}
        {user.role === "STUDENT" && (
          <>
            <Section title="Student Details">
              <Info label="Standard" value={user.standard} />
              <Info label="Student Code" value={user.studentCode} />
            </Section>

            <Section title="Address">
              <Info label="House No" value={user.address?.houseNo} />
              <Info label="Street" value={user.address?.street} />
              <Info label="City" value={user.address?.city} />
              <Info label="State" value={user.address?.state} />
              <Info label="Pincode" value={user.address?.pincode} />
            </Section>
          </>
        )}

        {/* PARENT */}
        {user.role === "PARENT" && (
          <Section title="Parent Information">
            <Info label="Phone" value={user.phone} />
          </Section>
        )}

        {/* TEACHER */}
        {user.role === "TEACHER" && (
          <Section title="Teacher Information">
            <Info label="Subject" value={user.subject} />
          </Section>
        )}

      </div>

      <Section title="Security">

        {message && (
          <div className="text-sm text-blue-500 py-2">{message}</div>
        )}

        <form
          onSubmit={handlePasswordChange}
          className="flex flex-col gap-3 py-4"
        >

          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                oldPassword: e.target.value,
              })
            }
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm"
          >
            Change Password
          </button>

        </form>

      </Section>
    </div>
  );
};

export default Profile;