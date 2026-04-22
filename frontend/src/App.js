import React from 'react';
import { Routes, Route } from "react-router-dom";
import Chatbot from './SocietyPages/Chatbot/Chatbot';

import Register from './SocietyPages/SocietyRegister/SoceityRegister';
import Login from './SocietyPages/Login/SoceityLogin';
import Home from './SocietyPages/Home/Home';
import EventDetail from './SocietyPages/EventDetail/EventDetail';
import SocietyList from './SocietyPages/SoceityList/SoceityList';
import SocietyProfile from './SocietyPages/SocietyProfile/SocietyProfile';
import Dashboard from './SocietyPages/Dashboard/Dashboard';
import CreateEvent from './SocietyPages/CreateEvent/CreateEvent';
import MyEvents from './SocietyPages/MyEvents/MyEvents';
import AdminEventRequests from './SocietyPages/AdminEventRequests/AdminEventRequests';
import EventPayment from './SocietyPages/EventPayment/EventPayment';
import EventCalendar from './SocietyPages/EventCalendar/EventCalendar';
import MyEventRequests from './SocietyPages/MyEventRequests/MyEventRequests';
import AddSociety from './SocietyPages/AddSociety/AddSoceity';
import StallApplication from './SocietyPages/StallRegister/StallRegister';
import StallPayment from './SocietyPages/StallPayment/StallPayment';
import StallOwnerRegister from './SocietyPages/StallOwnerRegister/StallOwnerRegister';
import StallOwnerLogin from './SocietyPages/StallOwnerLogin/StallOwnerLogin';
import StallOwnerProfile from './SocietyPages/StallOwnerProfile/StallOwnerProfile';
import PendingPayments from './SocietyPages/StallAdminSide/StallAdminSide';
import SocietyForgotPassword from './SocietyPages/ForgotPassword/SocietyForgotPassword';
import StallOwnerForgotPassword from './SocietyPages/ForgotPassword/StallOwnerForgotPassword';
import AdminLogin from './SocietyPages/AdminLogin/AdminLogin';
import AdminDashboard from './SocietyPages/AdminDashboard/AdminDashboard';
import AdminFacultyNotify from './SocietyPages/AdminFacultyNotify/AdminFacultyNotify';
import DeanRespond from './SocietyPages/DeanRespond/DeanRespond';
import AdminUsersPage from './SocietyPages/AdminUsersPage/AdminUsersPage';
import Contact from './SocietyPages/ContactUs/Contact';
import FriendTrackerPage from './SocietyPages/FriendTracker/FriendTrackerPage';
import About from './SocietyPages/AboutUs/About';

//── Artist Module ──
import SearchArtist from './ArtistPages/Organizer/SearchArtist';
import AddArtistLead from './ArtistPages/Organizer/AddArtistLead';
import SendInquiry from './ArtistPages/Organizer/SendInquiry';
import InquiryResponses from './ArtistPages/Organizer/InquiryResponses';
import SendInvitation from './ArtistPages/Organizer/SendInvitation';
import InvitationTracker from './ArtistPages/Organizer/InvitationTracker';
import VoteResults from './ArtistPages/Organizer/VoteResults';
import FinalizeArtist from './ArtistPages/Organizer/FinalizeArtist';
import CalendarStatus from './ArtistPages/Organizer/CalendarStatus';
import HistoryLogs from './ArtistPages/Organizer/HistoryLogs';
import ArtistInquiries from './ArtistPages/Artist/ArtistInquiries';
import ArtistInvitations from './ArtistPages/Artist/ArtistInvitations';
import ArtistCalendar from './ArtistPages/Artist/ArtistCalendar';
import ArtistDashboard from './ArtistPages/Artist/ArtistDashboard';
import ArtistProfile from './ArtistPages/Artist/ArtistProfile';
import ArtistShortlist from './ArtistPages/Student/ArtistShortlist';
import VoteArtist from './ArtistPages/Student/VoteArtist';
import VoteConfirmation from './ArtistPages/Student/VoteConfirmation';
import VoteNow from './ArtistPages/Student/VoteNow';
import FinalArtist from './ArtistPages/Student/FinalArtist';
import ArtistRegister from "./ArtistPortal/ArtistRegister";
import ArtistLogin from "./ArtistPortal/ArtistLogin";
import ArtistPortalDashboard from "./ArtistPortal/ArtistPortalDashboard";
import ArtistFeedback from "./ArtistPortal/ArtistFeedback";
import ArtistForgotPassword from './ArtistPortal/ArtistForgotPassword';

import ProtectedRoute from "./RiskManagePages/components/auth/ProtectedRoute";
import MainLayout from "./RiskManagePages/components/layout/MainLayout";
import PublicLayout from "./RiskManagePages/components/layout/PublicLayout";
import AlertPage from "./RiskManagePages/pages/AlertPage";
import ChangePasswordPage from "./RiskManagePages/pages/ChangePasswordPage";
import DashboardPage from "./RiskManagePages/pages/DashboardPage";
import ForgotPasswordPage from "./RiskManagePages/pages/ForgotPasswordPage";
import IncidentDetailsPage from "./RiskManagePages/pages/IncidentDetailsPage";
import IncidentListPage from "./RiskManagePages/pages/IncidentListPage";
import LoginPage from "./RiskManagePages/pages/LoginPage";
import PublicHomePage from "./RiskManagePages/pages/PublicHomePage";
import ReportIncidentPage from "./RiskManagePages/pages/ReportIncidentPage";
import ResetPasswordPage from "./RiskManagePages/pages/ResetPasswordPage";
import TrackIncidentPage from "./RiskManagePages/pages/TrackIncidentPage";
import { AuthProvider as RiskAuthProvider } from "./RiskManagePages/context/AuthContext";
import "./RiskManagePages/styles/public.css";
import "./RiskManagePages/styles/auth.css";
import "./RiskManagePages/styles/dashboard.css";
import "./RiskManagePages/styles/app.css";
import "./RiskManagePages/styles/form.css";
import "./RiskManagePages/styles/layout.css";
import "./RiskManagePages/styles/detail.css";
import "./RiskManagePages/styles/table.css";
import "./RiskManagePages/styles/chat.css";


// ── Risk Management imports above ──

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Society */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<SocietyForgotPassword />} />
      <Route path="/societies" element={<SocietyList />} />
      <Route path="/society/:id" element={<SocietyProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/my-events" element={<MyEvents />} />
      <Route path="/myeventReqest" element={<MyEventRequests />} />
      <Route path="/addsocieties" element={<AddSociety />} />

      {/* Events */}
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/event-payment/:id" element={<EventPayment />} />
      <Route path="/calendar" element={<EventCalendar />} />

      {/* Stall Owner */}
      <Route path="/sregister" element={<StallOwnerRegister />} />
      <Route path="/slogin" element={<StallOwnerLogin />} />
      <Route path="/sforgot-password" element={<StallOwnerForgotPassword />} />
      <Route path="/owner-profile/:ownerId" element={<StallOwnerProfile />} />
      <Route path="/stall-application/:ownerId/:eventId" element={<StallApplication />} />
      <Route path="/stall-payment/:ownerId/:stallId" element={<StallPayment />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/ad" element={<AdminEventRequests />} />
      <Route path="/admin/pending-payments" element={<PendingPayments />} />
      <Route path="/admin/faculty-notify" element={<AdminFacultyNotify />} />
      <Route path="/dean/respond/:token" element={<DeanRespond />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />

      {/* Other */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/friend-tracker" element={<FriendTrackerPage />} />

      {/* Artist Module — Organizer */}
      <Route path="/organizer/search-artists" element={<SearchArtist />} />
      <Route path="/organizer/add-artist-lead" element={<AddArtistLead />} />
      <Route path="/organizer/send-inquiry" element={<SendInquiry />} />
      <Route path="/organizer/inquiry-responses" element={<InquiryResponses />} />
      <Route path="/organizer/send-invitation" element={<SendInvitation />} />
      <Route path="/organizer/invitation-tracker" element={<InvitationTracker />} />
      <Route path="/organizer/vote-results" element={<VoteResults />} />
      <Route path="/organizer/finalize-artist" element={<FinalizeArtist />} />
      <Route path="/organizer/calendar-status" element={<CalendarStatus />} />
      <Route path="/organizer/history-logs" element={<HistoryLogs />} />

      {/* Artist Module — Artist */}
      <Route path="/artist/dashboard" element={<ArtistDashboard />} />
      <Route path="/artist/profile" element={<ArtistProfile />} />
      <Route path="/artist/inquiries" element={<ArtistInquiries />} />
      <Route path="/artist/invitations" element={<ArtistInvitations />} />
      <Route path="/artist/calendar" element={<ArtistCalendar />} />

      {/* Artist Module — Student */}
      <Route path="/student/artist-shortlist" element={<ArtistShortlist />} />
      <Route path="/student/vote-artist" element={<VoteArtist />} />
      <Route path="/student/vote-confirmation" element={<VoteConfirmation />} />
      <Route path="/student/vote-now" element={<VoteNow />} />
      <Route path="/student/final-artist" element={<FinalArtist />} />

      {/* Artist Portal — Artist */}
      <Route path="/artist-register" element={<ArtistRegister />} />
      <Route path="/artist-login" element={<ArtistLogin />} />
      <Route path="/artist-portal-dashboard" element={<ArtistPortalDashboard />} />
      <Route path="/artist-feedback" element={<ArtistFeedback />} />
      <Route path="/artist-forgot-password" element={<ArtistForgotPassword />} />

      {/* Risk Management — Public */}
      <Route element={<RiskAuthProvider><PublicLayout /></RiskAuthProvider>}>
        <Route path="/r" element={<PublicHomePage />} />
        <Route path="/riskhome-page" element={<PublicHomePage />} />
        <Route path="/rreport-incident" element={<ReportIncidentPage />} />
        <Route path="/rtrack-incident" element={<TrackIncidentPage />} />
        <Route path="/rlogin" element={<LoginPage />} />
        <Route path="/rforgot-password" element={<ForgotPasswordPage />} />
        <Route path="/rreset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Risk Management — Protected */}
      <Route element={<RiskAuthProvider><ProtectedRoute><MainLayout /></ProtectedRoute></RiskAuthProvider>}>
        <Route path="/rdashboard" element={<DashboardPage />} />
        <Route path="/rincidents" element={<IncidentListPage />} />
        <Route path="/rincidents/:id" element={<IncidentDetailsPage />} />
        <Route path="/ralerts" element={<AlertPage />} />
        <Route path="/rchange-password" element={<ChangePasswordPage />} />
      </Route>
    </Routes>
    <Chatbot />
  </>
  );
}

export default App;
