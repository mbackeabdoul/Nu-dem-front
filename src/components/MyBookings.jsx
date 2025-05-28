import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import toast from 'react-hot-toast';

const MyBookings = ({ bookings, onCancel }) => {
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!auth.isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('https://nu-dem-back.onrender.com/api/bookings', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (!res.ok) throw new Error('Erreur lors de la récupération des réservations');
        const data = await res.json();
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err.message);
        toast.error('Erreur lors de la récupération des réservations');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-sm w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmé':
      case 'confirmed':
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en_attente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'annulé':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Mes Réservations
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-600">
              Vous n'avez encore effectué aucune réservation.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {bookings.map((booking, index) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-4 sm:p-6">
                  {/* Route principale */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl font-semibold text-gray-900">
                            {booking.departure}
                          </div>
                          <div className="text-sm text-gray-500 my-1">vers</div>
                          <div className="text-lg sm:text-xl font-semibold text-gray-900">
                            {booking.arrival}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Statut */}
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.paymentStatus)} self-start sm:self-center`}>
                      {booking.paymentStatus || 'En attente'}
                    </div>
                  </div>

                  {/* Informations détaillées */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 10h10l-2-10" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-500">Numéro de ticket</p>
                          <p className="font-semibold text-gray-900 truncate">{booking.ticketNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500">Prix</p>
                          <p className="font-semibold text-gray-900">
                            {booking.price ? `${booking.price} XOF` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h6m-6 0v4a2 2 0 002 2h4a2 2 0 002-2v-4" />
                        </svg>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-500">Date et heure de départ</p>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                            {formatDate(booking.departureDateTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                    <div className="text-sm text-gray-500">
                      Réservation #{index + 1}
                    </div>
                    <button
                      onClick={() => onCancel(booking._id)}
                      className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Annuler la réservation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;