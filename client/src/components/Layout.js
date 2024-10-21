import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({
  children,
  cartItems,
  orders,
  isLoggedIn,
  onLogout,
  userRole,
}) => {
  const location = useLocation();

  return (
    <div>
      {/* Conditionally render the Navbar */}
      {location.pathname !== "/admin" && (
        <Navbar
          cartItems={cartItems}
          orders={orders}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          userRole={userRole}
        />
      )}
      {children}
    </div>
  );
};

export default Layout;
