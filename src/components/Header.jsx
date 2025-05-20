import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../App';

const Header = () => {
  const { auth, logout, setShowAuthModal } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <i className="fas fa-plane-departure text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-bold text-blue-600">
            Ñu <span className="text-blue-800">Dem</span>
          </h1>
        </div>

        <nav className="hidden md:flex space-x-8">
          <NavLink to="/" className={({ isActive }) => `...`} end>Accueil</NavLink>
          <NavLink to="/recherche" className={({ isActive }) => `...`}>Recherche</NavLink>
          <NavLink to="/mes-reservations" className={({ isActive }) => `...`}>Mes Réservations</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `...`}>Contact</NavLink>
        </nav>

        <div className="flex items-center">
          {auth.isAuthenticated ? (
            <div className="relative group">
              <button className="hidden md:flex items-center text-gray-700 hover:text-blue-600">
                Bonjour, {auth.user.prenom} <i className="fas fa-chevron-down ml-2"></i>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg hidden group-hover:block">
                <NavLink to="/mes-reservations" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Mes Réservations</NavLink>
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50">Déconnexion</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              <i className="fas fa-user mr-2"></i> Connexion
            </button>
          )}
          <button className="md:hidden text-gray-700 focus:outline-none" onClick={toggleMobileMenu} aria-label="Menu">
            {mobileMenuOpen ? <i className="fas fa-times text-xl"></i> : <i className="fas fa-bars text-xl"></i>}
          </button>
        </div>
      </div>

      <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="container mx-auto px-4 py-2">
          <nav className="flex flex-col space-y-4 py-4">
            <NavLink to="/" className={({ isActive }) => `...`} onClick={() => setMobileMenuOpen(false)} end>Accueil</NavLink>
            <NavLink to="/recherche" className={({ isActive }) => `...`} onClick={() => setMobileMenuOpen(false)}>Recherche</NavLink>
            <NavLink to="/mes-reservations" className={({ isActive }) => `...`} onClick={() => setMobileMenuOpen(false)}>Mes Réservations</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `...`} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
            <div className="border-t border-gray-200 pt-4 mt-2">
              {auth.isAuthenticated ? (
                <>
                  <NavLink to="/mes-reservations" className="block w-full text-left text-gray-700 hover:bg-blue-50 py-2 px-3">Mes Réservations</NavLink>
                  <button onClick={logout} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">Déconnexion</button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Connexion
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;