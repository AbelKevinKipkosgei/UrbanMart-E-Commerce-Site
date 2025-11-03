import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import "./App.css";
import Logout from "./pages/Logout";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/Layout";
import ManageUsers from "./pages/ManageUsers";
import CreateProduct from "./components/CreateProductModal";
import ManageProducts from "./pages/ManageProducts";
import ManageOrders from "./pages/ManageOrders";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const [orders, setOrders] = useState(() => {
    const storedOrders = localStorage.getItem("orders");
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || null;
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/user/authenticate");
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.authenticated);
          setUserRole(data.role);

          localStorage.setItem("isLoggedIn", data.authenticated);
          localStorage.setItem("userRole", data.role);

          if (data.authenticated) {
            const storedCartItems = localStorage.getItem("cartItems");
            const storedOrders = localStorage.getItem("orders");
            if (storedCartItems) {
              setCartItems(JSON.parse(storedCartItems));
            }
            if (storedOrders) {
              setOrders(JSON.parse(storedOrders));
            }
          }
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userRole");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const handleRemoveFromCart = (product) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== product.id)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  }

  const handleCancelOrder = (order) => {
    setOrders((prevOrders) =>
      prevOrders.filter((item) => item.id !== order.id)
    );
  };

  const handleLogin = (role) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);

    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");

      setIsLoggedIn(false);
      setUserRole(null);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("orders");

      setCartItems([]);
      setOrders([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="App">
      <Router>
        <Layout
          cartItems={cartItems}
          orders={orders}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products"
            element={<ProductsPage onAddToCart={handleAddToCart} />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage
                  cartItems={cartItems}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage orders={orders} onCancelOrder={handleCancelOrder} />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole}>
                <AdminPage />
              </AdminProtectedRoute>
            }
          >
            {/* Nested routes inside AdminPage */}
            <Route path="manageusers" element={<ManageUsers />} />
            <Route path="manageorders" element={<ManageOrders />} />
            <Route path="manageproducts" element={<ManageProducts />} />
            <Route path="createproduct" element={<CreateProduct />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

