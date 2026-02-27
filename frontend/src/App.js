import React from 'react';
import { Routes, Route } from "react-router-dom";

import Register from './Pages/SocietyRegister/SoceityRegister'
import Login from './Pages/Login/SoceityLogin'
import Home from './Pages/Home/Home'
import EventDetail from './Pages/EventDetail/EventDetail'
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
      <Route path="/ad" element={<AdminEventRequests/>}/>
      <Route path="/admin/pending-payments" element={<PendingPayments />} />

      {/* Other Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}



export default App;
