import React from "react";
import "./CartPage.css";

function CartPage({ cartItems, onRemoveFromCart, onCheckout }) {
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
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-actions">
              <img
                onClick={() => onRemoveFromCart(item)}
                alt="Remove from Cart"
                title="Remove"
                src="/remove-from-cart.png"
                className="remove-from-cart"
              />
              <button
                onClick={() => onCheckout(item)}
                className="checkout-button"
              >
                Checkout
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CartPage;

