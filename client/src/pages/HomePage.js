import React from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>UrbanMart</h1>
        <p className="tagline">Where Your Shopping Dreams Come True</p>
      </header>

      <section className="hero">
      <img src="https://images.pexels.com/photos/5632382/pexels-photo-5632382.jpeg" alt="Shopping Cart on MacBook" />
        <div className="hero-text">
          <h2>Welcome to Our Store</h2>
          <button onClick={() => navigate('/products')}> Shop Now</button>
        </div>
      </section>

      <footer>
        <p>Follow us on social media!</p>
        <div className="social-links">
        <a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a href="https://twitter.com/yourpage" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a href="https://instagram.com/yourpage" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        </div>         
      </footer>
    </div>
  );
};

export default HomePage;
