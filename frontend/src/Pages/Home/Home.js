// src/Pages/Home/Home.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Home.css";
import heroImg from "../../assets/p1.png";
import event1 from "../../assets/p2.png";
import event2 from "../../assets/p3.jpg";
import event3 from "../../assets/p4.jpg";
import event4 from "../../assets/uni.jpg";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const heroImgEl = document.querySelector(".hero-image");
      const eventsEl = document.querySelector(".events");
      const scrollY = window.scrollY;

      if (heroImgEl) {
        const scale = 1 - scrollY * 0.0004;
        const translate = scrollY * -0.3;
        heroImgEl.style.transform = `translateY(${translate}px) scale(${scale})`;
      }

      if (eventsEl) {
        const trigger = window.innerHeight * 0.8;
        const rect = eventsEl.getBoundingClientRect();
        if (rect.top < trigger) eventsEl.classList.add("show");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    if (!menuOpen) {
      setMenuAnimating(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setMenuOpen(true), 900);
    } else {
      setMenuOpen(false);
      setMenuAnimating(false);
      setEventsDropdown(false);
    }
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    setMenuAnimating(false);
    setEventsDropdown(false);
    navigate(path);
  };

  return (
    <div className="home">
      <div className="site-mark">
        <span className="site-mark-main">Uni Festivo</span>
      </div>

      {/* Hamburger */}
      <button
        className={`menu-toggle ${menuAnimating ? "open" : ""}`}
        onClick={handleMenuToggle}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Cloud Animation */}
      <div className={`cloud-transition ${menuAnimating ? "active" : ""}`}>
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
        <div className="cloud c4" />
      </div>

      {/* Fullscreen Navigation */}
      {menuOpen && (
        <div className="menu-fullscreen">
          <button className="menu-close" onClick={handleMenuToggle} aria-label="Close navigation">
            ✕
          </button>

          <button className="menu-link" onClick={() => handleNavigate("/")}>Home</button>

          <div className="menu-events">
            <button className="menu-link" onClick={() => setEventsDropdown(!eventsDropdown)}>
              Events ▾
            </button>
            {eventsDropdown && (
              <div className="dropdown">
                <button className="dropdown-item" onClick={() => handleNavigate("/register")}>Societies</button>
                <button className="dropdown-item" onClick={() => handleNavigate("/shops")}>Shops</button>
              </div>
            )}
          </div>

          {/* Dynamic navigation based on login */}
          {user ? (
            <>
              <span className="menu-user">Faculty: {user.faculty}</span>

              {user.role === "Society" && (
                <button
                  className="menu-link"
                  onClick={() => handleNavigate("/society-dashboard")}
                >
                  Dashboard
                </button>
              )}

              <button
                className="menu-link"
                onClick={() => {
                  logout();
                  handleNavigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="menu-link" onClick={() => handleNavigate("/login")}>Login</button>
            </>
          )}

          <button className="menu-link" onClick={() => handleNavigate("/about")}>About</button>
          <button className="menu-link" onClick={() => handleNavigate("/contact")}>Contact</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image-wrapper">
          <img src={heroImg} alt="Hero" className="hero-image" />
          <div className="hero-overlay" />
        </div>
      </section>

      {/* Events Section */}
      <section className="events">
        <h2>Upcoming Events</h2>
        <div className="portfolio-grid">
          {[event1, event2, event3, event4].map((img, index) => (
            <div
              key={index}
              className="portfolio-card"
              onClick={() => navigate(`/events/${index + 1}`)}
            >
              <div className="portfolio-image-wrapper">
                <img src={img} alt={`Event ${index + 1}`} />
                <div className="portfolio-overlay">
                  <h3>
                    {["Tech Summit", "Cultural Night", "Sports Meet", "Innovation Expo"][index]}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
