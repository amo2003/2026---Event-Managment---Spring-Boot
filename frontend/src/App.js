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

function App() {
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

    <Route path="/stall-application/:eventId" element={<StallApplication/>} />
    <Route path="/stall-payment" element={<StallPayment/>} />

    </Routes>
  );
}

export default App;
