import React from 'react';

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Pourquoi nous choisir</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Notre service de réservation de vols offre une expérience simple, rapide et sécurisée.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Recherche simplifiée</h3>
            <p className="text-gray-600">
              Trouvez rapidement les meilleurs vols avec notre moteur de recherche intuitif.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-wallet text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Meilleurs prix</h3>
            <p className="text-gray-600">
              Accédez aux tarifs les plus compétitifs pour toutes vos destinations préférées.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-history text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Historique des réservations</h3>
            <p className="text-gray-600">
              Consultez et gérez facilement toutes vos réservations précédentes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;