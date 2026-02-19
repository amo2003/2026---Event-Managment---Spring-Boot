import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Home.css";

import heroImg from "../../assets/m4.jpg";

// Events
import event1 from "../../assets/v2.jpg";
import event2 from "../../assets/get.jpg";
import event3 from "../../assets/pongal.jpg";
import event4 from "../../assets/wasantha.jpg";
import event5 from "../../assets/aura.jpg";
import event6 from "../../assets/handaw.jpg";
import event7 from "../../assets/ganthera.jpg";
import event8 from "../../assets/lantha.jpg";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const heroImgEl = document.querySelector(".hero-image");
      const heroTextEl = document.querySelector(".hero-text");
      const eventsEl = document.querySelector(".events");
      const scrollY = window.scrollY;

      if (heroImgEl) {
        const scale = 1 - scrollY * 0.0004;
        const translate = scrollY * -0.3;

        heroImgEl.style.transform = `translateY(${translate}px) scale(${scale})`;

        if (heroTextEl) {
          heroTextEl.style.transform = `translate(-50%, calc(-50% + ${translate}px)) scale(${scale})`;
          heroTextEl.style.opacity = 1 - scrollY * 0.0012;
        }
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

  const upcomingEvents = [
    { img: event1, title: "Wiramaya - විරාමය" },
    { img: event2, title: "SLIIT - Get Together" },
    { img: event3, title: "Pongal Festival" },
    { img: event4, title: "SLIIT - වසන්ත මුවදොර" },
  ];

  const pastEvents = [
    { img: event5, title: "AURA Event" },
    { img: event6, title: "SLIIT - හැන්දෑව" },
    { img: event7, title: "ගංතෙර" },
    { img: event8, title: "ලන්තෑරුම" },
  ];

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
          <button className="menu-close" onClick={handleMenuToggle}>✕</button>
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

          {user ? (
            <>
              <span className="menu-user">Faculty: {user.faculty}</span>

              {user.role === "Society" && (
                <>
                  {/* Navigate directly to logged-in society's unique page using ID */}
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate(`/society/${user.id}`)}
                  >
                    Profile
                  </button>
                  <button className="menu-link" onClick={() => handleNavigate("/dashboard")}>
                    Dashboard
                  </button>
                </>
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
            <button className="menu-link" onClick={() => handleNavigate("/login")}>Login</button>
          )}

          <button className="menu-link" onClick={() => handleNavigate("/about")}>About</button>
          <button className="menu-link" onClick={() => handleNavigate("/contact")}>Contact</button>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-image-wrapper">
          <img src={heroImg} alt="Hero" className="hero-image" />
          <div className="hero-text">
            Welcome
            <span className="hero-tagline">Build Your Dream With Us.</span>
          </div>
        </div>
      </section>

      {/* EVENTS SECTION WITH BUTTON TOGGLE */}
      <section className="events">
        <div className="event-buttons">
          <button
            className={`toggle-btn ${showUpcoming ? "active-btn" : ""}`}
            onClick={() => setShowUpcoming(true)}
          >
            Upcoming Events
          </button>
          <button
            className={`toggle-btn ${!showUpcoming ? "active-btn" : ""}`}
            onClick={() => setShowUpcoming(false)}
          >
            Past Events
          </button>
        </div>

        <div className="portfolio-grid">
          {(showUpcoming ? upcomingEvents : pastEvents).map((event, index) => (
            <div key={index} className="portfolio-card" onClick={() => navigate(`/events/${index + 1}`)}>
              <div className="portfolio-image-wrapper">
                <img src={event.img} alt={event.title} />
                <div className="portfolio-overlay">
                  <h3>{event.title}</h3>
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
