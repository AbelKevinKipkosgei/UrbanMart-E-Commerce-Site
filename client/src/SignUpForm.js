import React, { useState } from 'react';

const SignUpForm = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validate password
    if (!formData.username || !formData.bio || !formData.password || !formData.confirmPassword) {
        alert("All fields are required!");
        return;
      }
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
  }
  // swend formData to the backend
  console.log("Sign Up Data:", formData);

  onSignup();
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input 
        type="text" 
        name="username" 
        placeholder="Username" 
        value={formData.username} 
        onChange={handleChange} 
        required
      />
      <input 
        type="text" 
        name="bio" 
        placeholder="Bio" 
        value={formData.bio} 
        onChange={handleChange} 
        required
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        value={formData.password} 
        onChange={handleChange} 
        required
      />
      <input 
        type="password" 
        name="confirmPassword" 
        placeholder="Confirm Password" 
        value={formData.confirmPassword} 
        onChange={handleChange} 
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
