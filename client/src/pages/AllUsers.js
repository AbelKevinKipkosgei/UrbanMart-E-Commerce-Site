import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AllUsers.css"; // Import CSS file for styling

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For handling redirects

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/admin/users", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        if (response.status === 403) {
          setError(
            "Unauthorized access. You must be an admin to view this page."
          );
          navigate("/login"); // Redirect to login
        } else if (!response.ok) {
          throw new Error("Error fetching users");
        } else {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        setError("Error fetching users");
      }
    };

    fetchUsers();
  }, [navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="users-container">
      <h1 className="users-title">All Users</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Bio</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.bio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
