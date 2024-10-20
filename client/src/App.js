import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CartPage from "./pages/CartPage"; // Cart Page
import OrdersPage from "./pages/OrdersPage"; // Orders Page
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  // State to manage cart items and orders
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  // Load cart and orders from localStorage on initial render
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    const storedOrders = localStorage.getItem("orders");

    if (storedCartItems) setCartItems(JSON.parse(storedCartItems));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  // Save cart and orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Function to add items to the cart
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  // Function to remove items from the cart
  const handleRemoveFromCart = (product) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== product.id)
    );
  };

  // Function to checkout items from the cart
  const handleCheckout = (item) => {
    setOrders((prevOrders) => [...prevOrders, item]); // Add item to orders
    handleRemoveFromCart(item); // Remove item from cart after checkout
  };

  // Function to cancel an order
  const handleCancelOrder = (order) => {
    setOrders((prevOrders) =>
      prevOrders.filter((item) => item.id !== order.id)
    );
  };

  return (
    <div className="App">
      <Router>
        <Navbar cartItems={cartItems} orders={orders} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductsPage onAddToCart={handleAddToCart} />} // Pass add-to-cart handler
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckout={handleCheckout} // Pass checkout handler
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrdersPage
                orders={orders}
                onCancelOrder={handleCancelOrder} // Pass cancel order handler
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

