import React from "react";
import "./CartPage.css";

function CartPage({ cartItems, onRemoveFromCart }) {
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image_url}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>
            <img
              onClick={() => onRemoveFromCart(item)}
              alt="Remove from Cart"
              title="Remove"
              src="/remove-from-cart.png"
              className="remove-from-cart"
            />
          </div>
        ))
      )}
    </div>
  );
}

export default CartPage;
