import React, { useState, useEffect } from 'react';

function Parents() {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/parents', {
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

        setParents(data.data || []);

        console.log(data.data)

      } catch (err) {
        console.error('Error fetching parents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  if (loading) return <p>Loading parents...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h3>View All Parents</h3>
      {parents.length === 0 ? (
        <p>No parents found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parents) => (
              <tr key={parents.user.username}>
                <td>{parents.user.username}</td>
                <td>{parents.user?.firstName || 'N/A'}</td>
                <td>{parents.user?.lastName || 'N/A'}</td>
                <td>{parents.user?.email || 'N/A'}</td>
                <td>{parents.phone || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Parents;
