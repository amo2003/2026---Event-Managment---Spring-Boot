import React from 'react';
import { Routes, Route } from "react-router-dom";


// Organizer Pages
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

// Artist Pages
import ArtistInquiries from './ArtistPages/Artist/ArtistInquiries';
import ArtistInvitations from './ArtistPages/Artist/ArtistInvitations';
import ArtistCalendar from './ArtistPages/Artist/ArtistCalendar';
import ArtistDashboard from "./ArtistPages/Artist/ArtistDashboard";
import ArtistProfile from './ArtistPages/Artist/ArtistProfile';

// Student Pages
import ArtistShortlist from './ArtistPages/Student/ArtistShortlist';
import VoteArtist from './ArtistPages/Student/VoteArtist';
import VoteConfirmation from './ArtistPages/Student/VoteConfirmation';

function App() {
  return (
    <Routes>
     

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

      
    </Routes>
  );
}

export default App;