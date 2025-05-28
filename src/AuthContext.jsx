import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialisation avec les valeurs de localStorage
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  let initialAuth = {
    isAuthenticated: false,
    user: null,
    token: null,
  };

  if (storedToken && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && typeof user === 'object') {
        initialAuth = { isAuthenticated: true, user, token: storedToken };
      } else {
        throw new Error('Utilisateur invalide dans localStorage');
      }
    } catch (err) {
      console.error('Erreur initialisation utilisateur depuis localStorage:', err.message);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  const [auth, setAuth] = useState(initialAuth);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Pas de validation supplémentaire pour l'instant
    console.log('Auth restauré:', auth);
  }, [auth]);

  const clearAuthData = () => {
    console.log('Nettoyage des données d\'authentification');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingFlight');
    localStorage.removeItem('selectedFlight');
    localStorage.removeItem('selectedFlightId');
    setAuth({ isAuthenticated: false, user: null, token: null });
  };

  const login = (user, token) => {
    if (!user || typeof user !== 'object' || !token) {
      console.error('Données de connexion invalides:', { user, token });
      return;
    }
    console.log('Connexion - utilisateur:', user, 'token:', token);
    setAuth({ isAuthenticated: true, user, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    console.log('Déconnexion de l\'utilisateur');
    clearAuthData();
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};