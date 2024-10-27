import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageOrders.css"; // Make sure to create this CSS file for styling

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 403) {
          setError("Unauthorized access. Admin privileges required.");
          navigate("/login");
        } else if (!response.ok) {
          throw new Error("Error fetching orders");
        } else {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message
  }

  return (
    <div className="manage-orders-container">
      <h2 className="manage-orders-title">All User Orders</h2>
      {orders.length > 0 ? (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-tile">
              <h3>Order ID: {order.id}</h3>
              <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
              <div className="manage-products-list">
                {order.products.length > 0 ? (
                  order.products.map((product) => (
                    <div key={product.id} className="manage-product-item">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="manage-product-image"
                      />
                      <div className="manage-product-details">
                        <strong>{product.name}</strong>
                        <p>{product.description}</p>
                        <p>
                          Price: $
                          {product.price ? product.price.toFixed(2) : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products in this order</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default ManageOrders;
