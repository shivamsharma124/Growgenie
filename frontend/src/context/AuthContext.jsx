import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [dark, setDark]   = useState(true);
  const [loading, setLoading] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("gg_token");
    const savedUser  = localStorage.getItem("gg_user");
    const savedDark  = localStorage.getItem("gg_dark");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    if (savedDark !== null) setDark(savedDark === "true");
    setLoading(false);
  }, []);

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("gg_dark", dark);
  }, [dark]);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem("gg_token", jwt);
    localStorage.setItem("gg_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("gg_token");
    localStorage.removeItem("gg_user");
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("gg_user", JSON.stringify(userData));
  };

  const toggleDark = () => setDark((d) => !d);

  return (
    <AuthContext.Provider value={{ user, token, dark, loading, login, logout, updateUser, toggleDark }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
