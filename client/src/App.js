import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';
import Navbar from './components/Navbar';
// import SearchBar from './SearchBar'; 
// import SignupForm from './SignUpForm';
// import LoginForm from './LogInForm';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [showSignup, setShowSignup] = useState(true); 
  // const [signupSuccess, setSignupSuccess] = useState(false);

  // const toggleForm = () => {
  //   setShowSignup(!showSignup);
  // };
  // const handleSignup = () => {
  //   setSignupSuccess(true); 
  //   setShowSignup(false); 

  //   console.log('User successfully signed up!');  
  // };
  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  // };
  
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
        </Routes>
      </Router>

      {/* Conditionally render either the sign-up or login form
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
        )} */}
    </div>
  );
}

export default App;
