import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserOrders.css";

const UserOrders = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersWithOrders = async () => {
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
          throw new Error("Error fetching user orders");
        } else {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        setError("Error fetching user orders");
      }
    };

    fetchUsersWithOrders();
  }, [navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-orders-container">
      <h2 className="user-orders-title">User Orders</h2>
      {users.length > 0 ? (
        <table className="user-orders-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Bio</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.bio}</td>
                <td>
                  {user.orders.length > 0 ? (
                    <ul className="user-orders-order-list">
                      {user.orders.map((order) => (
                        <li key={order.id} className="user-orders-order-item">
                          <div className="user-orders-order-header">
                            <strong>Order ID:</strong> {order.id} <br />
                            <strong>Created At:</strong> {order.created_at}
                          </div>
                          <ul className="user-orders-product-list">
                            {order.products.map((product) => (
                              <li
                                key={product.id}
                                className="user-orders-product-item"
                              >
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="user-orders-product-image"
                                />
                                <div className="user-orders-product-details">
                                  <strong>{product.name}</strong> -{" "}
                                  {product.price.toFixed(2)} USD
                                  <p>{product.description}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No orders</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default UserOrders;
