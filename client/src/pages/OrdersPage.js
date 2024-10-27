import React, { useEffect, useState } from "react";
import "./OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log(data);

        // Sort orders by created_at date in descending order
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }
      // Update the state by filtering out the canceled order
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-tile">
            <h3 className="order-title">Order ID: {order.id}</h3>
            <div className="order-products">
              {order.products.map((orderProduct) => (
                <div key={orderProduct.id} className="order-product-item">
                  <img
                    src={orderProduct.product.image_url} // Access image_url from product
                    alt={orderProduct.product.name}
                    className="order-product-image"
                  />
                  <div className="order-product-details">
                    <h4>{orderProduct.product.name}</h4> {/* Product Name */}
                    <p>Quantity: {orderProduct.quantity}</p>{" "}
                    {/* Product Quantity */}
                    <p>Price: ${orderProduct.product.price.toFixed(2)}</p>{" "}
                    {/* Product Price */}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <p>Total Order Price: ${order.total_price.toFixed(2)}</p>{" "}
              {/* Total Price */}
            </div>
            <div className="order-item-actions">
              <button
                className="cancel-order-button"
                onClick={() => handleCancelOrder(order.id)}
              >
                Cancel Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;
