import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProducts.css"; // Ensure you have your CSS styles defined

const UserProducts = () => {
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
          throw new Error("Error fetching user products");
        } else {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        setError("Error fetching user products");
      }
    };

    fetchUsersWithOrders();
  }, [navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-products-container">
      <h1 className="user-products-title">User Products</h1>
      {users.length > 0 ? (
        <table className="user-products-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Bio</th>
              <th>Products</th>
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
                    <ul className="user-products-product-list">
                      {user.orders.flatMap((order) =>
                        order.products.map((product) => (
                          <li
                            key={product.id}
                            className="user-products-product-item"
                          >
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="user-products-product-image"
                            />
                            <div className="user-products-product-details">
                              <strong>{product.name}</strong> - $
                              {product.price.toFixed(2)}
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  ) : (
                    <div>No products found</div>
                  )}
                </td>
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

export default UserProducts;
