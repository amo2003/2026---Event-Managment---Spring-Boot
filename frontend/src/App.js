import React from 'react';
import { Routes, Route } from "react-router-dom";

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
import Contact from './SocietyPages/ContactUs/Contact';
import About from './SocietyPages/AboutUs/About';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>

      {/* Society Routes */}
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<SocietyForgotPassword/>}/>
      <Route path="/societies" element={<SocietyList />} />
      <Route path="/society/:id" element={<SocietyProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/my-events" element={<MyEvents />} />
      <Route path="/myeventReqest" element={<MyEventRequests />} />
      <Route path="/addsocieties" element={<AddSociety />} />

      {/* Event Routes */}
      <Route path="/events/:id" element={<EventDetail/>}/>
      <Route path="/event-payment/:id" element={<EventPayment/>}/>
      <Route path="/calendar" element={<EventCalendar/>}/>

      {/* Stall Owner Routes */}
      <Route path="/sregister" element={<StallOwnerRegister />} />
      <Route path="/slogin" element={<StallOwnerLogin />} />
      <Route path="/sforgot-password" element={<StallOwnerForgotPassword/>}/>
      <Route path="/owner-profile/:ownerId" element={<StallOwnerProfile />} />
      <Route path="/stall-application/:ownerId/:eventId" element={<StallApplication />} />
      <Route path="/stall-payment/:ownerId/:stallId" element={<StallPayment />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/ad" element={<AdminEventRequests/>}/>
      <Route path="/admin/pending-payments" element={<PendingPayments />} />

      {/* Other Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
