const StudentProfile = ({ user }) => (
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-2">Student Details</h2>
    <p><strong>Standard:</strong> {user.standard}</p>

    <div className="mt-2">
      <p><strong>Address:</strong></p>
      <p>{user.address?.houseNo}, {user.address?.street}</p>
      <p>{user.address?.city}, {user.address?.state}</p>
      <p>{user.address?.pincode}</p>
    </div>
  </div>
);