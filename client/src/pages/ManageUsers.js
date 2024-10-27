import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageUsers.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For handling redirects

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("api/admin/users", {
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

  // Function to handle promoting a user
  const handlePromoteUser = async (userId) => {
    try {
      const response = await fetch(`api/admin/promote/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // Refresh the user list after promoting
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, role: "admin" } : user
        );
        setUsers(updatedUsers);
      } else {
        throw new Error("Error promoting user");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to handle demoting a user
  const handleDemoteUser = async (userId) => {
    try {
      const response = await fetch(`api/admin/demote/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // Refresh the user list after demoting
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, role: "user" } : user
        );
        setUsers(updatedUsers);
      } else {
        throw new Error("Error demoting user");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="users-container">
      <h1 className="users-title">All Users</h1>
      {users.map((user) => (
        <div key={user.id} className="users-card">
          <div className="user-info">
            <div className="user-row">
              <span className="label">ID:</span> <span>{user.id}</span>
            </div>
            <div className="user-row">
              <span className="label">Username:</span>{" "}
              <span>{user.username}</span>
            </div>
            <div className="user-row">
              <span className="label">Role:</span> <span>{user.role}</span>
            </div>
            <div className="user-row">
              <span className="label">Bio:</span> <span>{user.bio}</span>
            </div>
          </div>
          <div className="user-actions">
            {user.id !== 1 && // Check if not the super admin
              (user.role === "admin" ? (
                <button onClick={() => handleDemoteUser(user.id)}>
                  Demote
                </button>
              ) : (
                <button onClick={() => handlePromoteUser(user.id)}>
                  Promote
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllUsers;
