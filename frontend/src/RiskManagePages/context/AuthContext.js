import React, { createContext, useContext, useMemo, useState } from "react";
import { changePassword, loginOfficer, registerOfficer } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("risk_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("risk_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (payload) => {
    const data = await loginOfficer(payload);

    localStorage.setItem("risk_token", data.token);
    localStorage.setItem("risk_user", JSON.stringify({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      mustChangePassword: data.mustChangePassword,
    }));

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
    localStorage.removeItem("risk_token");
    localStorage.removeItem("risk_user");
    setToken(null);
    setUser(null);
  };

  const completePasswordChange = async (payload) => {
    const message = await changePassword(payload);

    const updatedUser = {
      ...user,
      mustChangePassword: false,
    };

    localStorage.setItem("risk_user", JSON.stringify(updatedUser));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);