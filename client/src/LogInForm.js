import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

     // Validate fields
     if (!loginData.username || !loginData.password) {
        setError('Both fields are required!');
        return;
      }
    //  send loginData to the backend
    console.log("Login Data:", loginData);
    // Validate and process login
    onLogin(); 
  };  
 

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input 
        type="text" 
        name="username" 
        placeholder="Username" 
        value={loginData.username} 
        onChange={handleChange} 
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        value={loginData.password} 
        onChange={handleChange} 
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
