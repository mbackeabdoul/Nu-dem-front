import React from 'react';

const Contact = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contactez-nous</h2>
          <p className="text-gray-600 mb-6">
            Pour toute question ou assistance, n'hésitez pas à nous contacter via les informations ci-dessous.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Coordonnées</h3>
              <p className="text-gray-600 flex items-start">
                <i className="fas fa-envelope text-gray-400 mt-1 mr-2"></i>
                contact@airvoyage.fr
              </p>
              <p className="text-gray-600 flex items-start">
                <i className="fas fa-phone-alt text-gray-400 mt-1 mr-2"></i>
                +33 1 23 45 67 89
              </p>
              <p className="text-gray-600 flex items-start">
                <i className="fas fa-map-marker-alt text-gray-400 mt-1 mr-2"></i>
                123 Avenue des Voyages, 75001 Paris
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <i className="fab fa-linkedin-in text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;