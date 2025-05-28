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

  // Images de destinations variées
  const destinationImages = [
    'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=250&fit=crop', // Paris
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop', // Londres
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop', // Tokyo
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop', // Dubai
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=250&fit=crop', // Istanbul
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop', // Rome
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop', // New York
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop'  // Avion
  ];

  const getRandomImage = (index) => {
    return destinationImages[index % destinationImages.length];
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const fetchPopularFlights = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const response = await axios.get('https://nu-dem-back.onrender.com/api/flights', {
        params: {
          departure: flights?.departure || 'DSS',
          arrival: 'CDG',
          date: today,
        },
      });

      setFlights(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur Axios:', err);
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

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Chargement des vols...</p>
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800 font-bold">Les vols les plus populaires</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flights.slice(0, 8).map((flight, index) => (
          <div
            key={flight.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={getRandomImage(index)}
              alt="Destination"
              className="w-full h-36 object-cover"
              loading="lazy"
            />

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  {flight.segments && flight.segments[0]?.departure} → {flight.segments && flight.segments[0]?.arrival}
                </h3>
                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {flight.airline}
                </span>
              </div>

              <div className="flex justify-between items-end mt-4">
                <span className="text-2xl font-light text-gray-900">
                  {flight.price}
                  <span className="text-sm text-gray-500 ml-1">{flight.currency}</span>
                </span>
                <button
                  onClick={() => handleBookClick(flight)}
                  className="text-white px-4 py-2 font-medium text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Réserver →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Confirmer votre réservation</h3>
                <p className="text-gray-500 text-sm">Vol avec {selectedFlight.airline}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {selectedFlight.segments && selectedFlight.segments.map((segment, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <span className="w-20 text-gray-500">Vol {index + 1}</span>
                  <span>{segment.departure} → {segment.arrival}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-medium">
                  {selectedFlight.price} {selectedFlight.currency}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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