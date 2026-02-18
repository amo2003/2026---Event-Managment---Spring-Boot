// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(); // named export

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const faculty = localStorage.getItem("faculty");
    const email = localStorage.getItem("email");

    if (token && role && faculty && email) {
      setUser({ token, role, faculty, email });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("faculty", userData.faculty);
    localStorage.setItem("email", userData.email);
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
