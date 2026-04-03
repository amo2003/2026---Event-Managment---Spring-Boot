import React, { useState } from "react";
import "./Contact.css";
import { useNavigate } from "react-router-dom";

const contactInfo = [
  {
    icon: "📧",
    title: "Email Us",
    lines: ["support@unifestivo.com", "partnerships@unifestivo.com"],
    accent: "#a855f7",
  },
  {
    icon: "📞",
    title: "Call Us",
    lines: ["+94 77 123 4567", "+94 71 987 6543"],
    accent: "#3b82f6",
  },
  {
    icon: "📍",
    title: "Visit Us",
    lines: ["Uni Festivo Headquarters", "University Campus Road", "Negombo, Sri Lanka"],
    accent: "#10b981",
  },
  {
    icon: "⏰",
    title: "Working Hours",
    lines: ["Mon – Fri: 8:30 AM – 5:00 PM", "Saturday: 9:00 AM – 1:00 PM", "Sunday: Closed"],
    accent: "#f59e0b",
  },
];

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="contact-page">
      <button className="con-back-btn" onClick={() => navigate(-1)}>←</button>

      {/* Hero */}
      <div className="contact-hero">
        <span className="contact-eyebrow">Get In Touch</span>
        <h1>Contact Uni Festivo</h1>
        <p className="contact-tagline">Let's connect and create amazing experiences together</p>
      </div>

      {/* Info Cards */}
      <div className="contact-info-grid">
        {contactInfo.map((c) => (
          <div key={c.title} className="contact-info-card" style={{ "--accent": c.accent }}>
            <div className="contact-info-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            {c.lines.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        ))}
      </div>

      {/* Message Form */}
      <div className="contact-form-section">
        <div className="contact-form-wrapper">
          <span className="contact-eyebrow">Send a Message</span>
          <h2>We'd Love to Hear From You</h2>
          {sent && <div className="contact-success">✅ Message sent! We'll get back to you soon.</div>}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <button type="submit" className="contact-submit-btn">Send Message →</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
