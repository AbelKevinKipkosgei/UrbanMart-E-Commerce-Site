import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>UrbanMart</h1>
        <h2 className="tagline"> The Republic of Gamers </h2>
      </header>

      <section className="hero">
        <div className="shop-button-container">
          <button className="shop-button" onClick={() => navigate("/products")}>
            Shop Now
          </button>
        </div>
        <img
          src="https://storage-asset.msi.com/global/picture/image/feature/nb/2023_RPLS/titan-18-hx-a14v/images/kv-nb.png"
          alt="New Titan series"
        />
        <div className="hero-text">
          <h2>Explore the New Titan Series</h2>
          <p>
            We are standing right at the apex of the gaming world, and MSI's
            Titan 18 HX is leading the charge as MSI's flagship notebook. This
            extraordinary Titan isn't just about raw power; it effortlessly
            blends professional-grade computational prowess with an immersive
            gaming experience. Its distinct features aren't just groundbreaking;
            they're a whole new level of innovation, leaving every other product
            in its wake.
          </p>
        </div>
      </section>

      <section className="image-gallery">
        <div className="image-container">
          <img
            src="https://storage-asset.msi.com/global/picture/image/feature/nb/2023_RPLS/stealth-18-mercedes-amg-motorsport-a1v/images/kv-nb.png"
            alt="The Stealth Beast"
          />
          <p>
            <b>TITAN 18 18 HXA14V:</b>A powerful gaming laptop that delivers a
            remarkable performance, featuring a stunning design inspired by
            Mercedes-AMG.
          </p>
        </div>

        <div className="image-container">
          <img
            src="https://storage-asset.msi.com/global/picture/image/feature/nb/2023_RPLS/raider-18hx-a14v/msi-raider18-kv-laptops.webp"
            alt="The Raider Beast"
          />
          <p>
            <b>RAIDER 18 HX A14V:</b> Ride high with the revolutionary Raider 18
            HX A14V, transforming your gaming space into an immersive spectacle.
            Witness the fluid, mesmerizing dance of RGB lighting, and indulge in
            an opulent esports experience taking your setup to new levels. With
            cutting-edge specifications, it delivers immense gaming power that
            is sure to boost your potential at light speed.
          </p>
        </div>

        <div className="image-container">
          <img
            src="https://storage-asset.msi.com/global/picture/image/feature/nb/2023_RPLS/vector-17-hx-a14v/images/kv-nb.webp"
            alt="The Vector Beast"
          />
          <p>
            <b>VECTOR 17 HX A14V:</b> Indulged in performance with the Vector 17
            HX A14V, gives users the tools to freely innovate as they choose to.
            The Vector 17 HX A14V stands as the ultimate choice for STEM
            enthusiasts, tailored to optimize their endeavors.
          </p>
        </div>

        <div className="image-container">
          <img
            src="https://dlcdnwebimgs.asus.com/gain/8B84248F-670A-42EA-9016-059F01D81E8E"
            alt="The ROG Beast"
          />
          <p>
            Experience gaming like never before with the Republic of Gamers
            lineup, engineered for performance and style.
          </p>
        </div>

        <div className="image-container">
          <img
            src="https://dlcdnwebimgs.asus.com/gain/9B7F288E-CACA-4A70-99E3-8CA28E956D17/fwebp"
            alt="The ROG Motherboard"
          />
          <p>
            The ROG Motherboard: The heart of your gaming rig, designed for
            maximum performance and stability, supporting the latest tech.
          </p>
        </div>
      </section>

      <footer>
        <p>Follow us on social media!</p>
        <div className="social-links">
          <a
            href="https://facebook.com/yourpage"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a
            href="https://twitter.com/yourpage"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
          <a
            href="https://instagram.com/yourpage"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
