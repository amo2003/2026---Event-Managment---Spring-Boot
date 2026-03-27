import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((authResponse) => {
    const user = {
      email: authResponse.email,
      fullName: authResponse.fullName,
      role: authResponse.role,
      token: authResponse.token,
      mustChangePassword: authResponse.mustChangePassword,
    };

    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("authToken", authResponse.token);
    setAuthUser(user);
  }, []);

  const completePasswordChange = useCallback(() => {
    setAuthUser((prev) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev,
        mustChangePassword: false,
      };

      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    setAuthUser(null);
  }, []);

  const value = useMemo(() => ({
    authUser,
    isAuthenticated: !!authUser,
    login,
    completePasswordChange,
    logout,
  }), [authUser, login, completePasswordChange, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}