import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import "./DemoteUser.css"; // Import CSS for styling

const DemoteUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/admin/users", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 403) {
          setError(
            "Unauthorized access. You must be an admin to view this page."
          );
          navigate("/login");
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

  const formik = useFormik({
    initialValues: {
      userId: "",
      username: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await fetch(`/admin/demote/${values.userId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: values.username }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error demoting user");
        }

        const data = await response.json();
        setSuccess(data.message);
        setError("");

        // Fetch the updated list of users after demotion
        await fetchUsers();

        // Reset the form after successful demotion
        formik.resetForm();
      } catch (err) {
        setError(err.message || "Error demoting user");
        setSuccess("");
      }
    },
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch("/admin/users", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetching users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Error fetching users");
    }
  };

  return (
    <div className="demote-user-container">
      {" "}
      {/* Updated container class name */}
      <h1>Demote User from Admin</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form className="promote-form" onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            id="userId"
            name="userId"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.userId}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            required
          />
        </div>
        <button type="submit">Demote User</button>
      </form>
      <h2>All Users</h2>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
};

export default DemoteUser;
