import { useAuth } from "../context/AuthContext";

const Info = ({ label, value }) => (
  <div className="flex justify-between border-b py-2">
    <span className="font-medium">{label}</span>
    <span className="text-gray-700">{value || "-"}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">User not logged in</div>;
  }

  return (
    <div className="mx-auto mt-10 bg-white p-8 rounded-lg shadow ml-[300px] mr-[300px]">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* COMMON INFO */}
      <Section title="Basic Information">
        <Info label="First Name" value={user.firstName} />
        <Info label="Last Name" value={user.lastName} />
        <Info label="Email" value={user.email} />
        <Info label="Username" value={user.username} />
        <Info label="Role" value={user.role} />
      </Section>

      {/* STUDENT */}
      {user.role === "STUDENT" && (
        <Section title="Student Information">
          <Info label="Standard" value={user.standard} />

          <div className="mt-2">
            <p className="font-semibold">Address</p>
            <p className="text-sm text-gray-600">
              {user.address?.houseNo}, {user.address?.street}
            </p>
            <p className="text-sm text-gray-600">
              {user.address?.city}, {user.address?.state} - {user.address?.pincode}
            </p>
          </div>
        </Section>
      )}

      {/* PARENT */}
      {user.role === "PARENT" && (
        <Section title="Parent Information">
          <Info label="Phone Number" value={user.phone} />
        </Section>
      )}

      {/* TEACHER */}
      {user.role === "TEACHER" && (
        <Section title="Teacher Information">
          <Info label="Subject" value={user.subject} />
        </Section>
      )}
    </div>
  );
};

export default Profile;
