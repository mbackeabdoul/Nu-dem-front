import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-plane-departure text-blue-400 text-2xl mr-2"></i>
              <h3 className="text-xl font-bold">Ñu dem Voyage</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Votre partenaire de confiance pour tous vos besoins de voyage aérien.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  Recherche
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  Mes Réservations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white cursor-pointer">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-envelope text-gray-400 mt-1 mr-2"></i>
                <span className="text-gray-400">contact@nudemvoyage.sn</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt text-gray-400 mt-1 mr-2"></i>
                <span className="text-gray-400">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-gray-400 mt-1 mr-2"></i>
                <span className="text-gray-400">123 Avenue des Voyages, 75001 Paris</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 AirVoyage. Tous droits réservés.
          </p>
          <div className="flex space-x-4">
            <i className="fab fa-cc-visa text-gray-400 text-2xl"></i>
            <i className="fab fa-cc-mastercard text-gray-400 text-2xl"></i>
            <i className="fab fa-cc-paypal text-gray-400 text-2xl"></i>
            <i className="fab fa-cc-amex text-gray-400 text-2xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;