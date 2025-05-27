// PopularDestinations.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';


const PopularDestinations = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const fetchPopularFlights = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get('https://nu-dem-back.onrender.com/api/flights', {
        params: {
          departure: flights.departure || 'DSS',
          arrival: flights.arrival || 'CDG',
          date: today,
        },
      });
      setFlights(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des vols.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularFlights();
  }, []);
 
  const handleBookClick = (flight) => {
    if (!isAuthenticated) {
      localStorage.setItem('pendingFlight', JSON.stringify(flight));
      authContext.setShowAuthModal(true);
    } else {
      // L'utilisateur est connecté → on affiche la modale de confirmation
      setSelectedFlight(flight);
      setShowModal(true);
  
    }
    
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFlight(null);
  };
  const handleConfirm = () => {
    if (!selectedFlight) return;
  
    localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
    localStorage.setItem('selectedFlightId', selectedFlight.id || 'unknown');
  
    closeModal();
    navigate('/reserver', { state: selectedFlight });
  };
  
  
  if (loading) return <p className="text-center">Chargement des vols...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="px-4 py-6"> 
      <h2 className="text-2xl font-bold text-center mb-6">Les vols les plus populaires</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {flights.map((flight) => (
          <div key={flight.id} className="bg-white rounded-xl shadow-md p-4">
            <img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
              alt="Avion"
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <div className="text-3xl mb-2">
            </div>
            <div className="font-semibold text-gray-800">{flight.airline}</div>
            <div className="text-sm text-gray-600 mb-1">
              {flight.departure} → {flight.arrival}
            </div>
            <div className="text-lg font-bold text-blue-600 text-end">
              {flight.price} {flight.currency}
            </div>
            <button
              onClick={() => handleBookClick(flight)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Réserver maintenant
            </button>
          </div>
        ))}
      </div>

      {/* MODALE DE CONFIRMATION */}
      {showModal && selectedFlight && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Confirmation de réservation</h3>

            <p className="text-gray-700 mb-2 ">
              Voulez-vous réserver ce vol avec <b>{selectedFlight.airline}</b> ?
            </p>
            <p className="mb-4 ">
              {selectedFlight.departure} → {selectedFlight.arrival} <br />
              <span className="font-bold">{selectedFlight.price} {selectedFlight.currency}</span>
            </p>
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularDestinations;