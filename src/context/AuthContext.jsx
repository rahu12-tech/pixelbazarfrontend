import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && token !== "null" && token !== "undefined" && token.length > 10 &&
        userData && userData !== "null" && userData !== "undefined") {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && (parsedUser.id || parsedUser.email)) {
          setIsLoggedIn(true);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        logout();
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setCartCount(0);
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      cartCount,
      login,
      logout,
      updateCartCount
    }}>
      {children}
    </AuthContext.Provider>
  );
};