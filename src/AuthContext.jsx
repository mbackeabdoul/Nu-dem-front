import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionnel : Vérifier le token avec une requête API
      setAuth({ isAuthenticated: true, user: null, token });
    }
  }, []);

  const login = (user, token) => {
    setAuth({ isAuthenticated: true, user, token });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('pendingFlight');
    localStorage.removeItem('selectedFlight');
    localStorage.removeItem('selectedFlightId');
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};