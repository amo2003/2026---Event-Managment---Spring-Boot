import React from "react";
import "./Contact.css";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="contact-page">
       <button className="con-back-btn" onClick={() => navigate(-1)}>
    ← 
  </button>
      <div className="contact-hero">
        <h1>Contact Uni Festivo</h1>
        <p className="contact-tagline">
          Let’s Connect & Create Amazing Experiences Together
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-card">
          <h2>📧 Email Address</h2>
          <p>support@unifestivo.com</p>
          <p>partnerships@unifestivo.com</p>
        </div>

        <div className="contact-card">
          <h2>📞 Contact Numbers</h2>
          <p>+94 77 123 4567</p>
          <p>+94 71 987 6543</p>
        </div>

        <div className="contact-card">
          <h2>📍 Office Address</h2>
          <p>Uni Festivo Headquarters</p>
          <p>University Campus Road</p>
          <p>Negombo, Sri Lanka</p>
        </div>

        <div className="contact-card">
          <h2>⏰ Working Hours</h2>
          <p>Monday – Friday: 8:30 AM – 5:00 PM</p>
          <p>Saturday: 9:00 AM – 1:00 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;