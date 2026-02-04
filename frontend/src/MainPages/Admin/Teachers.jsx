import React, { useState, useEffect } from 'react';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/teachers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setTeachers(data.data || []);

        console.log(data.data)

      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <p>Loading teachers...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h3>View All Teachers</h3>
      {teachers.length === 0 ? (
        <p>No parents found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teachers) => (
              <tr key={teachers.user.username}>
                <td>{teachers.user.username}</td>
                <td>{teachers.user?.firstName || 'N/A'}</td>
                <td>{teachers.user?.lastName || 'N/A'}</td>
                <td>{teachers.user?.email || 'N/A'}</td>
                <td>{teachers.subject || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Teachers;
