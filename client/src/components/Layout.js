import React from "react";
import Navbar from "./Navbar";

const Layout = ({
  children,
  cartItems,
  orders,
  isLoggedIn,
  onLogout,
}) => {

  return (
    <div>
        <Navbar
          cartItems={cartItems}
          orders={orders}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
        />
      {children}
    </div>
  );
};

export default Layout;
