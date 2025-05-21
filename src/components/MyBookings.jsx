import React, { useContext } from 'react';
import QRCode from 'react-qr-code';
import { AuthContext } from '../App';

const MyBookings = ({ bookings, onCancel }) => {
  const { auth, setAuth } = useContext(AuthContext);

  const downloadTicket = async (bookingId) => {
    try {
      const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
      console.log('Downloading ticket for bookingId:', bookingId);
      const res = await fetch(`http://localhost:5000/api/generate-ticket/${bookingId}`, { headers });
      console.log('Response status:', res.status, 'OK:', res.ok);
      if (res.status === 401) {
        alert('Session expirée, veuillez vous reconnecter.');
        setAuth({ isAuthenticated: false, token: null, user: null });
        localStorage.removeItem('token');
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        console.error('Response error:', text);
        throw new Error('Erreur lors de la génération du billet');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billet-${bookingId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading ticket:', err.message);
      alert('Jàmm ak jàmm ! Erreur lors du téléchargement du billet.');
    }
  };

  const resendEmail = async (bookingId) => {
    try {
      const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
      console.log('Resending email for bookingId:', bookingId);
      const res = await fetch(`http://localhost:5000/api/send-ticket-email/${bookingId}`, {
        method: 'POST',
        headers,
      });
      console.log('Response status:', res.status, 'OK:', res.ok);
      if (res.status === 401) {
        alert('Session expirée, veuillez vous reconnecter.');
        setAuth({ isAuthenticated: false, token: null, user: null });
        localStorage.removeItem('token');
        return;
      }
      if (!res.ok) {
        const text = await res.text();
        console.error('Response error:', text);
        throw new Error('Erreur lors de l’envoi de l’e-mail');
      }
      alert('Billet renvoyé par e-mail');
    } catch (err) {
      console.error('Error resending email:', err.message);
      alert('Jàmm ak jàmm ! Erreur lors de l’envoi de l’e-mail.');
    }
  };

  if (!auth.isAuthenticated && bookings.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mes Réservations</h2>
          <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-gray-700 mb-3">Vérifier votre réservation</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const ticketNumber = e.target.ticketNumber.value;
                const customerEmail = e.target.customerEmail.value;
                try {
                  const res = await fetch(`http://localhost:5000/api/get-booking-by-ticket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketNumber, customerEmail }),
                  });
                  if (!res.ok) throw new Error('Réservation non trouvée');
                  const booking = await res.json();
                  bookings.push(booking);
                } catch (err) {
                  alert('Réservation non trouvée');
                }
              }}
            >
              <input
                type="text"
                name="ticketNumber"
                placeholder="Numéro de billet"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <input
                type="email"
                name="customerEmail"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Vérifier
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mes Réservations</h2>
        <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Réservation #{booking.ticketNumber}</h3>
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-medium ${
                      booking.paymentStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  >
                    {booking.paymentStatus === 'completed' ? 'Payé' : 'En attente'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div className="mb-4 md:mb-0">
                    <div className="text-sm text-gray-500 mb-1">Compagnie</div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="font-bold text-gray-600">{booking.airline.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{booking.airline}</div>
                        <div className="text-sm text-gray-500">Vol {booking.flightNumber}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-center">
                      <div className="font-bold text-lg">{booking.departure}</div>
                      <div className="text-xs text-gray-500">Départ</div>
                    </div>
                    <div className="mx-4 flex-grow">
                      <div className="relative h-0.5 bg-gray-300 w-full">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{booking.arrival}</div>
                      <div className="text-xs text-gray-500">Arrivée</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Passager</div>
                    <div className="font-medium">{booking.customerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Contact</div>
                    <div className="font-medium">{booking.customerEmail}</div>
                    <div className="text-sm">{booking.customerPhone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Date de départ</div>
                    <div className="font-medium">
                      {new Date(booking.departureDateTime).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Prix</div>
                    <div className="font-bold text-lg text-blue-600">{booking.price} XOF</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center border-t pt-6">
                  <div
                    id={`qr-${booking._id}`}
                    className="mb-4 md:mb-0 md:mr-6 p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <QRCode
                      value={`http://localhost:5000/api/verify-ticket/${booking.ticketNumber}?token=${booking.ticketToken}`}
                      size={120}
                    />
                  </div>
                  <div className="flex flex-col space-y-3 w-full md:w-auto">
                    <button
                      onClick={() => downloadTicket(booking._id)}
                      disabled={!booking.emailSent}
                      className={`${
                        booking.emailSent
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      } text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center`}
                      title={
                        booking.emailSent
                          ? 'Télécharger le billet'
                          : 'Veuillez attendre la réception de l’email'
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Télécharger le billet
                    </button>
                    <button
                      onClick={() => resendEmail(booking._id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Renvoyer l’e-mail
                    </button>
                    <button
                      onClick={() => onCancel(booking._id)}
                      className="border border-red-500 text-red-500 hover:bg-red-50 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Annuler la réservation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyBookings;