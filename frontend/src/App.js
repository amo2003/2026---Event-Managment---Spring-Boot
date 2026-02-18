import React from 'react';
import { Routes, Route } from "react-router-dom";

import Register from './Pages/SocietyRegister/SoceityRegister'
import Login from './Pages/Login/SoceityLogin'
import Home from './Pages/Home/Home'
import EventDetail from './Pages/EventDetail/EventDetail'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/events/:id" element={<EventDetail/>}/>



    </Routes>
  );
}

export default App;
