import { createContext, useContext, useState } from "react";

// Session/auth state shared across the app. The session is kept in memory only
// (no persistence), so the app always starts logged out — opening or reloading
// the site shows the public homepage with no user signed in. Login lasts while
// you navigate the app; a full page refresh returns to the logged-out state.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    localStorage.removeItem("user"); // clear any old saved session — always start fresh
    return null;
  });

  const login = (userData) => setUser(userData);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
