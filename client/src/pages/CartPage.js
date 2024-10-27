import React, { useState, useEffect } from "react";
import "./CartPage.css";

function CartPage({ cartItems, onRemoveFromCart, onClearCart }) {
  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity || 1;
      return acc;
    }, {})
  );

  useEffect(() => {
    setQuantities(
      cartItems.reduce((acc, item) => {
        acc[item.id] = item.quantity || 1;
        return acc;
      }, {})
    );
  }, [cartItems]);

  const handleIncrement = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));
  };

  const handleDecrement = (itemId) => {
    setQuantities((prev) => {
      if (prev[itemId] > 1) {
        return {
          ...prev,
          [itemId]: prev[itemId] - 1,
        };
      }
      return prev;
    });
  };

  const handleQuantityChange = (itemId, value) => {
    const newValue = parseInt(value, 10);
    if (!isNaN(newValue) && newValue > 0) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: newValue,
      }));
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * quantities[item.id];
    }, 0);
  };

  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User is not logged in.");
      return;
    }

    const itemsWithQuantities = cartItems.map((item) => ({
      product_id: item.id,
      quantity: quantities[item.id],
    }));

    const totalPrice = calculateTotalPrice();

    // Log checkout data for debugging
    console.log("Checkout data:", {
      user_id: userId,
      products: itemsWithQuantities,
      totalPrice,
    });

    try {
      const response = await fetch("api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: userId,
          products: itemsWithQuantities,
          totalPrice,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Order placed successfully!");
        console.log("Order details:", result.order);
        localStorage.removeItem("cart");

        // Clear the cart
        onClearCart();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to create order"}`);
        console.error("Checkout error:", errorData);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error placing order. Please try again.");
    }
  };


  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item tile">
            <img
              src={item.image_url}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity-actions">
              <div className="cart-item-quantity">
                <button onClick={() => handleDecrement(item.id)}>-</button>
                <input
                  type="number"
                  value={quantities[item.id]}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  className="quantity-input"
                />
                <button onClick={() => handleIncrement(item.id)}>+</button>
              </div>
              <img
                onClick={() => onRemoveFromCart(item)}
                alt="Remove from Cart"
                title="Remove"
                src="/remove-from-cart.png"
                className="remove-from-cart"
              />
            </div>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <div className="cart-total">
          <h3>Total Price: ${calculateTotalPrice().toFixed(2)}</h3>
          <button onClick={handleCheckout} className="checkout-button">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
