import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const context = useContext(AuthContext);
  if (!context) {
    console.error('AuthContext is undefined in Header');
    return null;
  }
  
  const { auth, logout, setShowAuthModal } = context;
  const navigate = useNavigate();

  const handleConnexion = () => {
    if (auth.isAuthenticated) {
      logout();
      toast.success('Déconnexion réussie');
      navigate('/');
    } else {
      setShowAuthModal(true);
    }
    setIsMobileMenuOpen(false); // Fermer le menu mobile après action
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: '/', label: 'Accueil', icon: 'fas fa-home' },
    { to: '/recherche', label: 'Recherche', icon: 'fas fa-search' },
    { to: '/mes-reservations', label: 'Mes Réservations', icon: 'fas fa-calendar-alt' },
    { to: '/contact', label: 'Contact', icon: 'fas fa-envelope' }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/images/image.png" 
                alt="Ñu Dem Logo" 
                className="h-10 w-10 object-contain rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100 p-1"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback logo */}
              <div className="hidden bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg shadow-md">
                <i className="fas fa-plane-departure text-white text-lg"></i>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Ñu Dem
              </h1>
              <span className="text-xs text-gray-500 font-medium hidden sm:block">
                Votre compagnon de voyage
              </span>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium group ${
                    isActive 
                      ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-sm'
                  }`
                }
              >
                <i className={`${item.icon} text-sm transition-transform duration-300 group-hover:scale-110`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {auth.isAuthenticated && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-blue-50 px-3 py-2 rounded-lg text-gray-700 text-sm border border-gray-200">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-xs"></i>
                </div>
                <span className="font-medium">{auth.user?.prenom}</span>
              </div>
            )}
            <button
              onClick={handleConnexion}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className={`fas ${auth.isAuthenticated ? 'fa-sign-out-alt' : 'fa-sign-in-alt'} mr-2`}></i>
              {auth.isAuthenticated ? 'Déconnexion' : 'Connexion'}
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 border border-gray-200 hover:border-blue-200"
            aria-label="Menu mobile"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}></i>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 bg-gradient-to-b from-white to-gray-50">
            {/* Navigation Mobile */}
            <nav className="space-y-2 mb-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-300 rounded-lg mx-2 ${
                      isActive 
                        ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 shadow-sm' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-sm'
                    }`
                  }
                >
                  <div className="w-8 flex justify-center">
                    <i className={`${item.icon} transition-transform duration-300 hover:scale-110`}></i>
                  </div>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Actions Mobile */}
            <div className="px-4 space-y-3">
              {auth.isAuthenticated && (
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg text-sm border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <span className="text-gray-700 font-medium">{auth.user?.prenom}</span>
                </div>
              )}
              
              <button
                onClick={handleConnexion}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <i className={`fas ${auth.isAuthenticated ? 'fa-sign-out-alt' : 'fa-sign-in-alt'}`}></i>
                <span>{auth.isAuthenticated ? 'Déconnexion' : 'Connexion'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;