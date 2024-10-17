import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './SearchBar'; 
import SignupForm from './SignUpForm';
import LoginForm from './LogInForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(true); 
  const [signupSuccess, setSignupSuccess] = useState(false);

  const toggleForm = () => {
    setShowSignup(!showSignup);
  };
  const handleSignup = () => {
    setSignupSuccess(true); 
    setShowSignup(false); 

    console.log('User successfully signed up!');  
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        {/* Conditionally render either the sign-up or login form */}
        {isLoggedIn ? (
          <>
        <SearchBar/> 
        <p>Welcome! You are logged in.</p>
        <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            {signupSuccess && <p>User successfully signed up! Please log in.</p>}
            {showSignup ? (
              <SignupForm onSignup={handleSignup}/>
            ) : (
              <LoginForm onLogin={handleLogin} /> 
            )}
            {!signupSuccess && (
            <button onClick={toggleForm}>
              {showSignup ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
            </button>
            )}
          </>
        )}
       
      </header>
    </div>
  );
}

export default App;
