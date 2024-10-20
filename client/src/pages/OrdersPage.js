import React from "react";
import "./OrdersPage.css";

function OrdersPage({ orders, onCancelOrder }) {
  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((item) => (
          <div key={item.id} className="order-item">
            <img
              src={item.image_url}
              alt={item.name}
              className="order-item-image"
            />
            <div className="order-item-details">
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>
            <div className="order-item-actions">
              {" "}
              <button
                className="cancel-order-button"
                onClick={() => onCancelOrder(item)}
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
