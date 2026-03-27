import { Link } from "react-router-dom";

function PublicHomePage() {
  return (
    <div className="public-home modern-home">
      <section className="hero-banner">
        <div className="hero-left">
          <span className="hero-chip">University Event Safety Portal</span>
          <h1>
            Report incidents fast.
            <br />
            Track updates easily.
            <br />
            Stay safe on campus.
          </h1>
          <p>
            A smart public portal for students and staff to report incidents,
            follow progress using a tracking code, and connect quickly with the
            event risk management team.
          </p>

          <div className="hero-actions">
            <Link to="/report-incident" className="hero-primary-btn">
              Report an Incident
            </Link>

            <Link to="/track-incident" className="hero-secondary-btn">
              Track My Incident
            </Link>
          </div>

          <div className="hero-mini-stats">
            <div className="mini-stat-card">
              <strong>Fast Reporting</strong>
              <span>Quick form submission</span>
            </div>

            <div className="mini-stat-card">
              <strong>Tracking Code</strong>
              <span>Easy status checking</span>
            </div>

            <div className="mini-stat-card">
              <strong>Protected Access</strong>
              <span>Officer/admin operations</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-visual-card hero-card-main">
            <h3>How this portal works</h3>

            <div className="flow-step">
              <div className="flow-number">1</div>
              <div>
                <strong>Report Incident</strong>
                <p>Submit type, place, exact location, and description.</p>
              </div>
            </div>

            <div className="flow-step">
              <div className="flow-number">2</div>
              <div>
                <strong>Receive Tracking Code</strong>
                <p>Use your unique code to check incident progress later.</p>
              </div>
            </div>

            <div className="flow-step">
              <div className="flow-number">3</div>
              <div>
                <strong>Operations Team Responds</strong>
                <p>Officers and admins manage assignment and resolution.</p>
              </div>
            </div>
          </div>

          <div className="hero-floating-card floating-one">
            <span>Live Reporting</span>
          </div>

          <div className="hero-floating-card floating-two">
            <span>Role-Based Access</span>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-section-header">
          <h2>Why this portal is useful</h2>
          <p>
            Designed to support safer university events with fast reporting,
            clear tracking, and protected operational handling.
          </p>
        </div>

        <div className="feature-grid colorful-feature-grid">
          <div className="feature-box feature-blue">
            <div className="feature-icon">⚡</div>
            <h3>Quick Incident Reporting</h3>
            <p>
              Students and staff can report important issues without going
              through complex manual processes.
            </p>
          </div>

          <div className="feature-box feature-purple">
            <div className="feature-icon">🎯</div>
            <h3>Structured Location Capture</h3>
            <p>
              Place area and exact location details help the response team
              understand incidents more clearly.
            </p>
          </div>

          <div className="feature-box feature-green">
            <div className="feature-icon">🔐</div>
            <h3>Protected Operations</h3>
            <p>
              Only authorized officers and admins can access internal
              incident-management features.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-strip">
        <div className="cta-strip-content">
          <div>
            <h2>Need to report something now?</h2>
            <p>
              Use the incident form to submit event-related safety issues and
              receive a tracking code instantly.
            </p>
          </div>

          <Link to="/report-incident" className="cta-strip-btn">
            Start Report
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PublicHomePage;