import React, { createContext, useContext, useMemo, useState } from "react";
import { changePassword, loginOfficer, registerOfficer } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (payload) => {
    const data = await loginOfficer(payload);

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        mustChangePassword: data.mustChangePassword,
      })
    );

    setToken(data.token);
    setUser({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      mustChangePassword: data.mustChangePassword,
    });

    return data;
  };

  const register = async (payload) => {
    return await registerOfficer(payload);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const completePasswordChange = async (payload) => {
    const message = await changePassword(payload);

    const updatedUser = {
      ...user,
      mustChangePassword: false,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    return message;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      completePasswordChange,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);