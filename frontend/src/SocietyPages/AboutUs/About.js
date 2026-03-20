import React from "react";
import "./About.css";

/* Import sponsor logos from assets */
import sponsor1 from "../../assets/1.png";
import sponsor2 from "../../assets/1.png";
import sponsor3 from "../../assets/1.png";
import sponsor4 from "../../assets/1.png";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <button className="abu-back-btn" onClick={() => navigate(-1)}>
    ← 
  </button>
      <div className="about-hero">
        <h1>About Uni Festivo</h1>
        <p className="about-tagline">
          Celebrating Innovation. Connecting Communities.
        </p>
      </div>

      <div className="about-content">
        <div className="about-card">
          <h2>🌟 Our Mission</h2>
          <p>
            Uni Festivo is a dynamic university event platform designed to connect
            societies, students, and stall owners through seamless event
            management and collaboration.
          </p>
        </div>

        <div className="about-card">
          <h2>🚀 Our Vision</h2>
          <p>
            To create a vibrant ecosystem where creativity, entrepreneurship,
            and student engagement flourish through unforgettable experiences.
          </p>
        </div>

        <div className="about-card">
          <h2>🤝 What We Offer</h2>
          <ul>
            <li>Event creation & management</li>
            <li>Society showcase profiles</li>
            <li>Stall owner registration & payments</li>
            <li>QR-based stall verification</li>
          </ul>
        </div>
      </div>

      {/* ===== Sponsors Section ===== */}
      <div className="sponsor-section">
        <h2 className="sponsor-title">Our Proud Sponsors</h2>

        <div className="sponsor-logos">
          <div className="sponsor-card">
            <img src={sponsor1} alt="Sponsor 1" />
          </div>

          <div className="sponsor-card">
            <img src={sponsor2} alt="Sponsor 2" />
          </div>

          <div className="sponsor-card">
            <img src={sponsor3} alt="Sponsor 3" />
          </div>

          <div className="sponsor-card">
            <img src={sponsor4} alt="Sponsor 4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;