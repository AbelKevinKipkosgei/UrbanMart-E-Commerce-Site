import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const ShoppingCart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const handleCheckout = () => {
    alert('Checkout successful!');
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default ShoppingCart;
