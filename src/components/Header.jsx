import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-plane-departure text-blue-600 text-2xl mr-2"></i>
          <h1 className="text-xl font-bold text-blue-600">Ñu Dem </h1>
        </div>
        <nav className="hidden md:flex space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-600 font-medium ${
                isActive ? 'text-blue-600' : ''
              }`
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/recherche"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-600 font-medium ${
                isActive ? 'text-blue-600' : ''
              }`
            }
          >
            Recherche
          </NavLink>
          <NavLink
            to="/mes-reservations"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-600 font-medium ${
                isActive ? 'text-blue-600' : ''
              }`
            }
          >
            Mes Réservations
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-gray-700 hover:text-blue-600 font-medium ${
                isActive ? 'text-blue-600' : ''
              }`
            }
          >
            Contact
          </NavLink>
        </nav>
        <button className="md:hidden text-gray-700">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;