import React from "react";
import "./About.css";
import sponsor1 from "../../assets/1.png";
import sponsor2 from "../../assets/1.png";
import sponsor3 from "../../assets/1.png";
import sponsor4 from "../../assets/1.png";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "50+", label: "Events Hosted" },
  { value: "120+", label: "Stall Owners" },
  { value: "30+", label: "Societies" },
  { value: "5000+", label: "Students Reached" },
];

const offerings = [
  { icon: "🗓️", title: "Event Management", desc: "Create, manage and publish events with full control over scheduling and visibility." },
  { icon: "🏛️", title: "Society Profiles", desc: "Dedicated showcase pages for every society to highlight their work and upcoming events." },
  { icon: "🛒", title: "Stall Registration", desc: "Streamlined stall owner onboarding with package selection and integrated payments." },
  { icon: "📲", title: "QR Verification", desc: "Instant QR-based stall check-in for fast, secure on-ground verification." },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <button className="abu-back-btn" onClick={() => navigate(-1)}>←</button>

      {/* Hero */}
      <div className="about-hero">
        <span className="about-eyebrow">Who We Are</span>
        <h1>About Uni Festivo</h1>
        <p className="about-tagline">Celebrating Innovation. Connecting Communities.</p>
      </div>

      {/* Stats bar */}
      <div className="about-stats">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="about-mv-grid">
        <div className="about-mv-card mission">
          <div className="mv-icon">🌟</div>
          <h2>Our Mission</h2>
          <p>Uni Festivo is a dynamic university event platform designed to connect societies, students, and stall owners through seamless event management and collaboration.</p>
        </div>
        <div className="about-mv-card vision">
          <div className="mv-icon">🚀</div>
          <h2>Our Vision</h2>
          <p>To create a vibrant ecosystem where creativity, entrepreneurship, and student engagement flourish through unforgettable experiences.</p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="about-offerings-section">
        <span className="about-eyebrow">What We Offer</span>
        <h2 className="section-heading">Everything You Need</h2>
        <div className="offerings-grid">
          {offerings.map((o) => (
            <div key={o.title} className="offering-card">
              <div className="offering-icon">{o.icon}</div>
              <h3>{o.title}</h3>
              <p>{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsors */}
      <div className="sponsor-section">
        <span className="about-eyebrow">Partners</span>
        <h2 className="section-heading">Our Proud Sponsors</h2>
        <div className="sponsor-logos">
          {[sponsor1, sponsor2, sponsor3, sponsor4].map((src, i) => (
            <div key={i} className="sponsor-card">
              <img src={src} alt={`Sponsor ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
