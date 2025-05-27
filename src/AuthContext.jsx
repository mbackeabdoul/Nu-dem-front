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
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuth({ isAuthenticated: true, user, token });
      } catch (err) {
        console.error('Erreur lors de la restauration de l’utilisateur:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ isAuthenticated: false, user: null, token: null });
      }
    }
  }, []);

  const login = (user, token) => {
    setAuth({ isAuthenticated: true, user, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Persister l'utilisateur
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Supprimer l'utilisateur
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