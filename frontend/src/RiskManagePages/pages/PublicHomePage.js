import React from "react";
import { Link } from "react-router-dom";
const PublicHomePage = () => (
  <div className="rm-public-home-v2">
    <section className="rm-hero-v2">
      <div className="rm-hero-v2-left">
        <span className="rm-hero-tag">UNIVERSITY EVENT SAFETY</span>
        <h1>REPORT.<br />TRACK.<br />RESPOND.</h1>
        <p className="rm-hero-text">A smart incident reporting and tracking portal designed to support safer university events with fast reporting, structured response, and clear progress visibility.</p>
        <div className="rm-hero-actions-v2">
          <Link to="/report-incident" className="rm-btn rm-btn-light rm-hero-main-btn">Report Incident</Link>
          <Link to="/track-incident" className="rm-btn rm-btn-outline rm-hero-main-btn">Track Incident</Link>
        </div>
        <div className="rm-hero-points">
          <div className="rm-hero-point"><strong>Fast Public Reporting</strong><span>Submit incidents in seconds</span></div>
          <div className="rm-hero-point"><strong>Tracking Code Access</strong><span>Monitor progress anytime</span></div>
          <div className="rm-hero-point"><strong>Officer Workflow</strong><span>Structured response lifecycle</span></div>
        </div>
      </div>
      <div className="rm-hero-v2-right">
        <div className="rm-feature-spot-card rm-large-card">
          <span className="rm-feature-no">01</span>
          <h3>Public Incident Submission</h3>
          <p>Students and staff can submit incident type, location, description, and optional evidence through a simple form.</p>
        </div>
        <div className="rm-feature-grid-v2">
          <div className="rm-feature-spot-card"><span className="rm-feature-no">02</span><h3>Track by Code</h3><p>Each report gets a unique code for secure status checking.</p></div>
          <div className="rm-feature-spot-card"><span className="rm-feature-no">03</span><h3>Officer Response</h3><p>Assigned officers manage action, evidence, and resolution.</p></div>
        </div>
      </div>
    </section>
    <section className="rm-public-summary-strip">
      <div className="rm-summary-box"><span>Public Portal</span><strong>Incident Reporting</strong></div>
      <div className="rm-summary-box"><span>Tracking Flow</span><strong>Reported → Assigned → Resolved</strong></div>
      <div className="rm-summary-box"><span>Officer Module</span><strong>Secure Internal Handling</strong></div>
    </section>
  </div>
);
export default PublicHomePage;
