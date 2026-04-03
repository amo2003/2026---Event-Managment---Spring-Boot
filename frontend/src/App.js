import React from 'react';
import { Routes, Route } from "react-router-dom";

import Register from './Pages/SocietyRegister/SoceityRegister';
import Login from './Pages/Login/SoceityLogin';
import Home from './Pages/Home/Home';
import EventDetail from './Pages/EventDetail/EventDetail';
import SocietyList from './Pages/SoceityList/SoceityList';
import SocietyProfile from './Pages/SocietyProfile/SocietyProfile';
import Dashboard from './Pages/Dashboard/Dashboard';
import CreateEvent from './Pages/CreateEvent/CreateEvent';
import MyEvents from './Pages/MyEvents/MyEvents';
import AdminEventRequests from './Pages/AdminEventRequests/AdminEventRequests';
import EventPayment from './Pages/EventPayment/EventPayment';
import EventCalendar from './Pages/EventCalendar/EventCalendar';
import MyEventRequests from './Pages/MyEventRequests/MyEventRequests';
import AddSociety from './Pages/AddSociety/AddSoceity';
import StallApplication from './Pages/StallRegister/StallRegister';
import StallPayment from './Pages/StallPayment/StallPayment';
import StallOwnerRegister from './Pages/StallOwnerRegister/StallOwnerRegister';
import StallOwnerLogin from './Pages/StallOwnerLogin/StallOwnerLogin';
import StallOwnerProfile from './Pages/StallOwnerProfile/StallOwnerProfile';
import PendingPayments from './Pages/StallAdminSide/StallAdminSide';
import SocietyForgotPassword from './Pages/ForgotPassword/SocietyForgotPassword';
import StallOwnerForgotPassword from './Pages/ForgotPassword/StallOwnerForgotPassword';
import About from './Pages/AboutUs/About';
import Contact from './Pages/ContactUs/Contact';

// Organizer Pages
import SearchArtist from './Pages/Organizer/SearchArtist';
import AddArtistLead from './Pages/Organizer/AddArtistLead';
import SendInquiry from './Pages/Organizer/SendInquiry';
import InquiryResponses from './Pages/Organizer/InquiryResponses';
import SendInvitation from './Pages/Organizer/SendInvitation';
import InvitationTracker from './Pages/Organizer/InvitationTracker';
import VoteResults from './Pages/Organizer/VoteResults';
import FinalizeArtist from './Pages/Organizer/FinalizeArtist';
import CalendarStatus from './Pages/Organizer/CalendarStatus';
import HistoryLogs from './Pages/Organizer/HistoryLogs';

// Artist Pages
import ArtistInquiries from './Pages/Artist/ArtistInquiries';
import ArtistInvitations from './Pages/Artist/ArtistInvitations';
import ArtistCalendar from './Pages/Artist/ArtistCalendar';
import ArtistDashboard from "./Pages/Artist/ArtistDashboard";
import ArtistProfile from './Pages/Artist/ArtistProfile';

// Student Pages
import ArtistShortlist from './Pages/Student/ArtistShortlist';
import VoteArtist from './Pages/Student/VoteArtist';
import VoteConfirmation from './Pages/Student/VoteConfirmation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Society Routes */}
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

      {/* Event Routes */}
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/event-payment/:id" element={<EventPayment />} />
      <Route path="/calendar" element={<EventCalendar />} />

      {/* Stall Owner Routes */}
      <Route path="/sregister" element={<StallOwnerRegister />} />
      <Route path="/slogin" element={<StallOwnerLogin />} />
      <Route path="/sforgot-password" element={<StallOwnerForgotPassword />} />
      <Route path="/owner-profile/:ownerId" element={<StallOwnerProfile />} />
      <Route path="/stall-application/:ownerId/:eventId" element={<StallApplication />} />
      <Route path="/stall-payment/:ownerId/:stallId" element={<StallPayment />} />

      {/* Admin Routes */}
      <Route path="/ad" element={<AdminEventRequests />} />
      <Route path="/admin/pending-payments" element={<PendingPayments />} />

      {/* Artist Management - Organizer Routes */}
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

      {/* Artist Management - Artist Routes */}
      <Route path="/artist/inquiries" element={<ArtistInquiries />} />
      <Route path="/artist/invitations" element={<ArtistInvitations />} />
      <Route path="/artist/calendar" element={<ArtistCalendar />} />
      <Route path="/artist-dashboard" element={<ArtistDashboard />} />
      <Route path="/artist-profile" element={<ArtistProfile />} />

      {/* Artist Management - Student Routes */}
      <Route path="/student/artist-shortlist" element={<ArtistShortlist />} />
      <Route path="/student/vote-artist" element={<VoteArtist />} />
      <Route path="/student/vote-confirmation" element={<VoteConfirmation />} />

      {/* Other Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;