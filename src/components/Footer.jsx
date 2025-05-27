import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/images/logo.png" 
                alt="Logo Ñu dem Voyage" 
                className="w-8 h-8 object-contain mr-3 hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback logo */}
              <div className="hidden bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-lg mr-3">
                <i className="fas fa-plane-departure text-white text-lg"></i>
              </div>
              <h3 className="text-xl font-bold">Ñu Dem Voyage</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Votre partenaire de confiance pour tous vos besoins de voyage aérien.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors duration-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">Accueil</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">Recherche</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">Mes Réservations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">À propos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-300">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-envelope text-blue-400 mt-1 mr-2"></i>
                <span className="text-gray-400">contact@nudemvoyage.sn</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt text-blue-400 mt-1 mr-2"></i>
                <span className="text-gray-400">+221 77 1 23 45 67</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-blue-400 mt-1 mr-2"></i>
                <span className="text-gray-400">Dakar, HLM Grand Yoff</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Nudemvoyage. Tous droits réservés.
          </p>
          <div className="flex space-x-4">
            <i className="fab fa-cc-visa text-gray-400 text-2xl hover:text-blue-400 cursor-pointer transition-colors duration-300"></i>
            <i className="fab fa-cc-mastercard text-gray-400 text-2xl hover:text-blue-400 cursor-pointer transition-colors duration-300"></i>
            <i className="fab fa-cc-paypal text-gray-400 text-2xl hover:text-blue-400 cursor-pointer transition-colors duration-300"></i>
            <i className="fab fa-cc-amex text-gray-400 text-2xl hover:text-blue-400 cursor-pointer transition-colors duration-300"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;