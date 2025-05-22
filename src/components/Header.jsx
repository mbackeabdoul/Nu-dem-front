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
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-1.5 rounded-md">
              <i className="fas fa-plane-departure text-white text-lg"></i>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Ñu Dem
            </h1>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                <i className={`${item.icon} text-sm`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {auth.isAuthenticated && (
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <i className="fas fa-user-circle"></i>
                <span>{auth.user?.prenom}</span>
              </div>
            )}
            <button
              onClick={handleConnexion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {auth.isAuthenticated ? 'Déconnexion' : 'Connexion'}
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Menu mobile"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            {/* Navigation Mobile */}
            <nav className="space-y-1 mb-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50 border-l-3 border-blue-600' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <i className={`${item.icon} w-4`}></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Actions Mobile */}
            <div className="px-4 space-y-3">
              {auth.isAuthenticated && (
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md text-sm">
                  <i className="fas fa-user text-blue-600"></i>
                  <span className="text-gray-700">{auth.user?.prenom}</span>
                </div>
              )}
              
              <button
                onClick={handleConnexion}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {auth.isAuthenticated ? 'Déconnexion' : 'Connexion'}
              </button>
            </div>
          </div>
        )}
      </div>


    </header>
  );
};

export default Header;