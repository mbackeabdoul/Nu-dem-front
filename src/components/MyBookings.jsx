import React from 'react';

const MyBookings = ({ bookings, onCancel }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Réservations</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">Aucune réservation enregistrée.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Réservation #{booking._id}
                </h3>
                <p className="text-gray-600">
                  <strong>Nom:</strong> {booking.firstName} {booking.lastName}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {booking.email}
                </p>
                <p className="text-gray-600">
                  <strong>Téléphone:</strong> {booking.phone}
                </p>
                <p className="text-gray-600">
                  <strong>Trajet:</strong> {booking.departure} → {booking.arrival}
                </p>
                <p className="text-gray-600">
                  <strong>Date de création:</strong> {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => onCancel(booking._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 rounded-button cursor-pointer whitespace-nowrap"
                  >
                    Annuler <i className="fas fa-trash ml-2"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookings;