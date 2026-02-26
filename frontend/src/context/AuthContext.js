// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userType = localStorage.getItem("userType"); // 'society', 'stallOwner', 'admin'
    const faculty = localStorage.getItem("faculty");
    const email = localStorage.getItem("email");
    const ownerName = localStorage.getItem("ownerName");

    if (token && role && userType) {
      setUser({ 
        id, 
        token, 
        role, 
        userType, 
        faculty, 
        email, 
        ownerName 
      });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("id", userData.id);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("userType", userData.userType); // 'society', 'stallOwner', 'admin'
    
    if (userData.faculty) {
      localStorage.setItem("faculty", userData.faculty);
    }
    if (userData.email) {
      localStorage.setItem("email", userData.email);
    }
    if (userData.ownerName) {
      localStorage.setItem("ownerName", userData.ownerName);
    }
    
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
