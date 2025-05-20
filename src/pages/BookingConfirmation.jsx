import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupérer les détails de la réservation depuis l'état ou l'URL
    if (location.state?.bookingId) {
      fetchBookingDetails(location.state.bookingId);
    } else {
      // Si pas d'ID de réservation, rediriger vers la page d'accueil
      setLoading(false);
      setError("Aucune information de réservation disponible");
    }
  }, [location]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
      
      if (!response.ok) {
        throw new Error('Impossible de récupérer les détails de la réservation');
      }
      
      const data = await response.json();
      setBookingDetails(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des détails:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chargement des détails de la réservation...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-8">{error || "Aucune information de réservation disponible"}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-white">Réservation confirmée</h1>
            <p className="text-green-100 mt-2">Votre réservation a été effectuée avec succès!</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Détails de la réservation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Numéro de réservation</p>
                    <p className="text-lg font-semibold text-gray-800">{bookingDetails._id}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Passager</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {bookingDetails.firstName} {bookingDetails.lastName}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{bookingDetails.email}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Statut du paiement</p>
                    <p className={`text-lg font-semibold ${bookingDetails.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                      {bookingDetails.paymentStatus === 'paid' ? 'Payé' : 'En attente de paiement'}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Prix total</p>
                    <p className="text-lg font-semibold text-gray-800">{bookingDetails.price} EUR</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Détails du vol</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Vol</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {bookingDetails.airline} • {bookingDetails.flightNumber}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Trajet</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {bookingDetails.departure} → {bookingDetails.arrival}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(bookingDetails.date)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Départ</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(bookingDetails.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Arrivée</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(bookingDetails.arrivalTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Classe</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {bookingDetails.cabinClass === 'ECONOMY' ? 'Économique' : 
                       bookingDetails.cabinClass === 'PREMIUM_ECONOMY' ? 'Premium Éco' :
                       bookingDetails.cabinClass === 'BUSINESS' ? 'Affaires' : 'Première'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {bookingDetails.paymentStatus === 'paid' ? (
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Télécharger votre billet</h3>
                <p className="text-gray-600 mb-4">Votre billet électronique est prêt à être téléchargé</p>
                <a
                  href={`http://localhost:5000/api/bookings/${bookingDetails._id}/ticket`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  Télécharger le billet <i className="fas fa-download ml-2"></i>
                </a>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-yellow-700 mb-2">Paiement en attente</h3>
                <p className="text-gray-600 mb-4">Veuillez compléter votre paiement pour recevoir votre billet</p>
                {bookingDetails.paymentUrl && (
                  <a
                    href={bookingDetails.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                  >
                    Procéder au paiement <i className="fas fa-external-link-alt ml-2"></i>
                  </a>
                )}
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;