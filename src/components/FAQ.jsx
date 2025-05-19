import React from 'react';

const FAQ = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Questions fréquentes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trouvez des réponses aux questions les plus courantes sur notre service.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Comment fonctionne la réservation de vols ?
            </h3>
            <p className="text-gray-600">
              Notre système vous permet de rechercher des vols, de sélectionner celui qui vous convient et de remplir un formulaire avec vos informations personnelles pour finaliser la réservation.
            </p>
          </div>
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Où sont stockées mes réservations ?
            </h3>
            <p className="text-gray-600">
              Vos réservations sont stockées localement dans votre navigateur (localStorage). Cela signifie qu'elles ne sont disponibles que sur l'appareil que vous utilisez.
            </p>
          </div>
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Puis-je annuler une réservation ?
            </h3>
            <p className="text-gray-600">
              Oui, vous pouvez annuler une réservation à tout moment depuis la section "Mes Réservations". La réservation sera alors supprimée de votre historique.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Est-ce que je reçois un email de confirmation ?
            </h3>
            <p className="text-gray-600">
              Pour l'instant, notre application est une démo et n'a pas de système d'envoi d'emails. Vos réservations sont uniquement accessibles via l'interface web.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;