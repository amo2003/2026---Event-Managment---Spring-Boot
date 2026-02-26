import React, { useState } from 'react';
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
import About from './Pages/AboutUs/About';
import Contact from './Pages/ContactUs/Contact';

function App() {
  const [, setOwner] = useState(null); // logged-in stall owner (used only for first redirect)
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/events/:id" element={<EventDetail/>}/>
 <Route path="/societies" element={<SocietyList />} />
        <Route path="/society/:id" element={<SocietyProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/create-event" element={<CreateEvent />} />
<Route path="/my-events" element={<MyEvents />} />
<Route path="/myeventReqest" element={<MyEventRequests />} />


<Route path="/ad" element={<AdminEventRequests/>}/>
<Route path="/event-payment/:id" element={<EventPayment/>}/>
<Route path="/calendar" element={<EventCalendar/>}/>

    <Route path="/events/:id" element={<EventDetail />} />
    <Route path="/addsocieties" element={<AddSociety />} />

    {/*<Route path="/stall-application/:eventId" element={<StallApplication/>} />*/}
    {/*<Route path="/stall-payment" element={<StallPayment/>} />*/}

    {/* Stall Owner Auth */}
        <Route path="/sregister" element={<StallOwnerRegister />} />
        <Route path="/slogin" element={<StallOwnerLogin setOwner={setOwner} />} />

        {/* Stall Owner Pages - always available so refresh keeps working */}
        <Route path="/owner-profile/:ownerId" element={<StallOwnerProfile />} />
        <Route path="/stall-application/:ownerId/:eventId" element={<StallApplication />} />
        <Route path="/stall-payment/:ownerId/:stallId" element={<StallPayment />} />

        {/* Admin Pages */}
        <Route path="/admin/pending-payments" element={<PendingPayments />} />

        <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />


    </Routes>
  );
}

export default App;
