import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Home.css";

import heroImg from "../../assets/m4.jpg";
import defaultEventImg from "../../assets/m4.jpg";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const [eventsDropdown, setEventsDropdown] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [upcomingRes, pastRes] = await Promise.all([
          axios.get("http://localhost:8080/api/public/events/upcoming"),
          axios.get("http://localhost:8080/api/public/events/past"),
        ]);
        setUpcomingEvents(upcomingRes.data);
        setPastEvents(pastRes.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  const getEventImage = (event) => {
    if (event.imageUrl) {
      return `http://localhost:8080/images/events/${event.imageUrl}`;
    }
    return defaultEventImg;
  };

  const currentEvents = showUpcoming ? upcomingEvents : pastEvents;

  return (
    <div className="home">
      <div className="site-mark">
        <span className="site-mark-main">Uni Festivo</span>
      </div>

      <button
        className={`menu-toggle ${menuAnimating ? "open" : ""}`}
        onClick={handleMenuToggle}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`cloud-transition ${menuAnimating ? "active" : ""}`}>
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
        <div className="cloud c4" />
      </div>

      {menuOpen && (
        <div className="menu-fullscreen">
          <button className="menu-close" onClick={handleMenuToggle}>
            ✕
          </button>

          <button className="menu-link" onClick={() => handleNavigate("/")}>
            Home
          </button>

          <div className="menu-events">
            <button
              className="menu-link"
              onClick={() => setEventsDropdown(!eventsDropdown)}
            >
              Events ▾
            </button>

            {eventsDropdown && (
              <div className="dropdown">
                <button
                  className="dropdown-item"
                  onClick={() => handleNavigate("/register")}
                >
                  Societies Register
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleNavigate("/sregister")}
                >
                  Shops Owners Register
                </button>
              </div>
            )}
          </div>

          {user ? (
            <>
              {user.userType === "society" && (
                <>
                  <span className="menu-user">
                    {user.societyName || user.faculty}
                  </span>
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate(`/society/${user.id}`)}
                  >
                    Profile
                  </button>
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                </>
              )}

              {user.userType === "stallOwner" && (
                <>
                  <span className="menu-user">Welcome, {user.ownerName}</span>
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate(`/owner-profile/${user.id}`)}
                  >
                    My Stalls
                  </button>
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate("/calendar")}
                  >
                    Browse Events
                  </button>
                </>
              )}

              {user.userType === "admin" && (
                <>
                  <span className="menu-user">Admin Panel</span>
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate("/admin/pending-payments")}
                  >
                    Stall Payments
                  </button>
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate("/ad")}
                  >
                    Event Requests
                  </button>
                </>
              )}

              {user.userType === "artist" && (
                <>
                  <span className="menu-user">
                    Welcome, {user.name || user.artistName || "Artist"}
                  </span>
                  <button
                    className="menu-link"
                    onClick={() => handleNavigate("/artist-dashboard")}
                  >
                    Artist Dashboard
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
            <>
              <button
                className="menu-link"
                onClick={() => handleNavigate("/login")}
              >
                Society Login
              </button>

              <button
                className="menu-link"
                onClick={() => handleNavigate("/slogin")}
              >
                Stall Owner Login
              </button>

              <button
                className="menu-link"
                onClick={() => handleNavigate("/artist-profile")}
              >
                Artist Profile
              </button>
            </>
          )}

          <button
            className="menu-link"
            onClick={() => handleNavigate("/calendar")}
          >
            Event Calendar
          </button>
          <button
            className="menu-link"
            onClick={() => handleNavigate("/about")}
          >
            About
          </button>
          <button
            className="menu-link"
            onClick={() => handleNavigate("/contact")}
          >
            Contact
          </button>
        </div>
      )}

      <section className="hero">
        <div className="hero-image-wrapper">
          <img src={heroImg} alt="Hero" className="hero-image" />
          <div className="hero-text">
            Welcome
            <span className="hero-tagline">Build Your Dream With Us.</span>
          </div>
        </div>
      </section>

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

        {loading ? (
          <div className="loading-events">Loading events...</div>
        ) : currentEvents.length === 0 ? (
          <div className="no-events">
            {showUpcoming
              ? "No upcoming events at the moment."
              : "No past events to show."}
          </div>
        ) : (
          <div className="portfolio-grid">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                className="portfolio-card"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="portfolio-image-wrapper">
                  <img src={getEventImage(event)} alt={event.eventName} />
                  <div className="portfolio-overlay">
                    <h3>{event.eventName}</h3>
                    <p className="event-society">{event.societyName}</p>
                    <p className="event-date">{event.eventDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>Uni Festivo</h2>
            <p>Celebrating Innovation. Connecting Communities.</p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/calendar")}>
              Event Calendar
            </button>
            <button onClick={() => navigate("/about")}>About</button>
            <button onClick={() => navigate("/contact")}>Contact</button>
            <button onClick={() => navigate("/organizer/search-artists")}>
              Artist Module
            </button>
          </div>

          <div className="footer-contact">
            <h3>Contact</h3>
            <p>support@unifestivo.com</p>
            <p>+94 77 123 4567</p>
            <p>Negombo, Sri Lanka</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Uni Festivo. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;