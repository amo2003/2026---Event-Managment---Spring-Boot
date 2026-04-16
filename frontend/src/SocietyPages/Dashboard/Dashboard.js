import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const sections = [
    {
      title: "Apply to Conduct Event",
      path: "/create-event",
      points: [
        "Submit Your Event Proposal – Fill out details of the event you want to organize.",
        "Approval Process – Your event will be reviewed and approved by the admin.",
        "Schedule & Time Slot – Choose an available date and time for your event.",
        "Event Promotion – Publish advertisements once approved.",
        "Track Success – Monitor attendance and feedback after the event.",
      ],
    },
  ];

  return (
    <div className="ddashboard-page">
      <h1>Welcome, {user?.faculty || user?.role || "Guest"}!</h1>
      <div className="ddashboard-grid">
        {sections.map((section, index) => (
          <div
            key={index}
            className="ddashboard-card"
          >
            <h3>{section.title}</h3>
            <ul className="ddashboard-points">
              {section.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
            <button onClick={() => navigate(section.path)}>Go</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
