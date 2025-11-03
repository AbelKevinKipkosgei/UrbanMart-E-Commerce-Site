import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './SearchBar';
import Cart from './Cart'; // Import Cart
import Login from './Login';
import Signup from './Signup';
import { CartProvider } from './CartContext'; // Import the CartProvider

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <CartProvider> {/* Wrap App with CartProvider */}
      <div className="App">
        <header className="App-header">
          <img src={logo} className="" alt=""/>
          <p>Welcome to UrbanMart!</p> {/* Add some welcome text */}
          <SearchBar />
          <button onClick={() => setShowCart(!showCart)}>
            {showCart ? 'Hide Cart' : 'Show Cart'}
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <div>
              <Login onLogin={handleLogin} />
              <Signup />
            </div>
          )}
          {showCart && <Cart />}
          {/* If you want to keep an anchor, ensure it has content or remove it */}
          {/* <a href="https://example.com">Example Link</a> */}
        </header>
      </div>
    </CartProvider>
  );
}

export default App;

