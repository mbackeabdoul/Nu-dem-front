import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';

const SearchForm = ({ searchForm, setSearchForm, onSubmit, flights }) => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('AuthContext is undefined in SearchForm');
    return null;
  }
  const { setShowAuthModal } = context;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: searchForm,
  });
  const navigate = useNavigate();
  const [departure, setDeparture] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadCities = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      console.log('Mot-clé trop court:', inputValue);
      return [];
    }
    try {
      console.log('Requête /cities avec keyword:', inputValue);
      const res = await axios.get(`https://nu-dem-back.onrender.com/api/cities?keyword=${encodeURIComponent(inputValue)}`);
      const cities = res.data.map(city => ({
        value: city.iataCode,
        label: `${city.name} (${city.iataCode})`,
        name: city.name,
      }));
      console.log('Villes reçues:', cities);
      if (cities.length === 0) {
        console.log('Aucune ville trouvée pour:', inputValue);
        toast.warn(`Aucune ville trouvée pour "${inputValue}". Essayez un autre nom.`);
      }
      return cities;
    } catch (err) {
      console.error('Erreur chargement villes:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error('Erreur lors du chargement des villes. Vérifiez votre connexion.');
      return [];
    }
  };

  const submitHandler = (data) => {
    if (!departure || !arrival) {
      console.error('Départ ou arrivée non sélectionné');
      setErrorMessage('Veuillez sélectionner une ville de départ et d’arrivée.');
      return;
    }
    const searchData = {
      departure: departure.value,
      departureName: departure.name,
      arrival: arrival.value,
      arrivalName: arrival.name,
      date: data.date,
      passengers: parseInt(data.passengers),
    };
    setSearchForm(searchData);
    onSubmit(searchData);
  };

  const handleBookFlight = (flight) => {
    console.log('Données du vol sélectionné:', flight);
    const isAuthenticated = context.auth?.isAuthenticated;
    if (!isAuthenticated) {
      console.log('Utilisateur non connecté, affichage modal');
      setShowAuthModal(true);
      toast.error('Veuillez vous connecter ou vous inscrire pour réserver.');
      localStorage.setItem('pendingFlight', JSON.stringify(flight));
      return;
    }
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    localStorage.setItem('selectedFlightId', flight.id || 'unknown');
    navigate('/reserver', { state: flight });
  };

  const formatTime = (dateTime) => {
    if (!dateTime) {
      console.warn('DateTime non définie:', dateTime);
      return '--:--';
    }
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        console.error('DateTime invalide:', dateTime);
        return '--:--';
      }
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Erreur formatage heure:', error, 'DateTime:', dateTime);
      return '--:--';
    }
  };

  const formatDate = (dateTime) => {
    if (!dateTime) {
      console.warn('DateTime non définie:', dateTime);
      return '--';
    }
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) {
        console.error('DateTime invalide:', dateTime);
        return '--';
      }
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
    } catch (error) {
      console.error('Erreur formatage date:', error, 'DateTime:', dateTime);
      return '--';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) {
      console.warn('Durée non définie:', duration);
      return '--';
    }
    try {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      return `${hours}h${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Erreur formatage durée:', error, 'Durée:', duration);
      return '--';
    }
  };

  const validFlights = flights.filter(flight => 
    flight.id && flight.departure && flight.arrival && flight.price && flight.airline && flight.flightNumber
  );

  return (
    <section id="search-form" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 -mt-32 relative z-30">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trouvez votre prochain vol</h2>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
          )}
          
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville de départ
                </label>
                <div className="flex items-center">
                  <i className="fas fa-plane-departure text-gray-400 mr-2"></i>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadCities}
                    onChange={setDeparture}
                    value={departure}
                    placeholder="Dakar, Sénégal (DSS)"
                    classNamePrefix="react-select"
                    required
                    styles={{ container: (base) => ({ ...base, width: '100%', cursor: 'pointer' }) }}
                  />
                </div>
                {errors.departure && (
                  <p className="text-red-500 text-xs mt-1">La ville de départ est requise</p>
                )}
              </div>
              
              <div>
                <label htmlFor="arrival" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville d'arrivée
                </label>
                <div className="flex items-center">
                  <i className="fas fa-plane-arrival text-gray-400 mr-2"></i>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadCities}
                    onChange={setArrival}
                    value={arrival}
                    placeholder="Paris, France (CDG)"
                    classNamePrefix="react-select"
                    required
                    styles={{ container: (base) => ({ ...base, width: '100%', cursor: 'pointer' }) }}
                  />
                </div>
                {errors.arrival && (
                  <p className="text-red-500 text-xs mt-1">La ville d'arrivée est requise</p>
                )}
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de départ
                </label>
                <div className="relative">
                  <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="date"
                    id="date"
                    {...register('date', { required: 'La date de départ est requise' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de passagers
                </label>
                <div className="relative">
                  <i className="fas fa-users absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <select
                    id="passengers"
                    {...register('passengers', { required: 'Le nombre de passagers est requis' })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'passager' : 'passagers'}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  {errors.passengers && (
                    <p className="text-red-500 text-xs mt-1">{errors.passengers.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out rounded-button cursor-pointer whitespace-nowrap"
              >
                Rechercher <i className="fas fa-search ml-2"></i>
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Résultats de la recherche</h3>
              {validFlights.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {validFlights.length} vol{validFlights.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {validFlights.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-plane text-gray-400 text-3xl"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">Aucun vol trouvé</h4>
                <p className="text-gray-500">Essayez d'autres critères de recherche</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                {validFlights.map(flight => (
                  <div key={flight.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <i className="fas fa-plane text-white text-sm"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{flight.airline}</h4>
                          <p className="text-sm text-gray-500">Vol {flight.flightNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{flight.price} {flight.currency}</div>
                        <div className="text-xs text-gray-500">par personne</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">{formatTime(flight.departureDateTime)}</div>
                          <div className="text-sm text-gray-500">{formatDate(flight.departureDateTime)}</div>
                          <div className="text-sm font-medium text-gray-700">{flight.departure}</div>
                          <div className="text-xs text-gray-500">{flight.departureName}</div>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="relative">
                            <div className="h-px bg-gray-300 w-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              <i className="fas fa-plane text-blue-500"></i>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-sm font-medium text-gray-600">{formatDuration(flight.duration)}</div>
                            <div className="text-xs text-gray-500">
                              {flight.isDirect ? 'Direct' : `${flight.segments.length - 1} escale${flight.segments.length - 1 > 1 ? 's' : ''}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">{formatTime(flight.arrivalDateTime)}</div>
                          <div className="text-sm text-gray-500">{formatDate(flight.arrivalDateTime)}</div>
                          <div className="text-sm font-medium text-gray-700">{flight.arrival}</div>
                          <div className="text-xs text-gray-500">{flight.arrivalName}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          {flight.isDirect && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <i className="fas fa-check-circle mr-1"></i>
                              Direct
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            flight.remainingSeats <= 5 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <i className="fas fa-chair mr-1"></i>
                            {flight.remainingSeats || 'N/A'} places
                          </span>
                        </div>
                        <button
                          onClick={() => handleBookFlight(flight)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                          Sélectionner
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchForm;