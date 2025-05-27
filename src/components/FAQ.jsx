import React from 'react';

const FAQ = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Questions fréquentes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trouvez des réponses aux questions les plus courantes sur notre service de réservation de vols.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Comment fonctionne la réservation de vols ?
            </h3>
            <p className="text-gray-600">
              Recherchez des vols en entrant votre ville de départ, votre destination et vos dates. Sélectionnez un vol, remplissez vos informations personnelles dans le formulaire de réservation, et finalisez votre achat. Vous devrez être connecté pour réserver.
            </p>
          </div>
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Où sont stockées mes réservations ?
            </h3>
            <p className="text-gray-600">
              Vos réservations sont enregistrées de manière sécurisée dans notre base de données après la confirmation de votre paiement. Vous pouvez y accéder via la section "Mes Réservations" une fois connecté.
            </p>
          </div>
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Puis-je annuler une réservation ?
            </h3>
            <p className="text-gray-600">
              Oui, connectez-vous à votre compte, allez dans "Mes Réservations", et annulez une réservation à tout moment. Notez que les politiques d'annulation peuvent dépendre de la compagnie aérienne.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Est-ce que je reçois un email de confirmation ?
            </h3>
            <p className="text-gray-600">
              Oui, après avoir finalisé votre réservation, vous recevrez un email de confirmation avec les détails de votre vol. Un billet électronique vous sera également envoyé par email une fois le paiement validé.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;