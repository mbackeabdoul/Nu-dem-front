import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const SearchForm = ({ searchForm, setSearchForm, onSubmit, flights }) => {
  const [countries, setCountries] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: searchForm,
  });
  const navigate = useNavigate();

  const submitHandler = (data) => {
    setSearchForm(data);
    onSubmit(data);
  };

  const handleBookFlight = (flight) => {
    let departureDateTime = new Date().toISOString();
    try {
      const dateValue = flight.departureDateTime || flight.date;
      if (dateValue) {
        const parsedDate = new Date(dateValue);
        if (!isNaN(parsedDate.getTime())) {
          departureDateTime = parsedDate.toISOString();
        } else {
          console.error('Invalid date:', dateValue);
        }
      }
    } catch (err) {
      console.error('Error formatting date:', err);
    }

    const flightData = {
      departure: flight.departure || 'Non spécifié',
      arrival: flight.arrival || 'Non spécifié',
      price: flight.price || 0,
      airline: flight.airline || 'Air Senegal',
      flightNumber: flight.flightNumber || 'SN000',
      departureDateTime,
    };

    console.log('Booking flight:', flightData);
    localStorage.setItem('selectedFlightId', flight.id || flight._id || 'unknown');
    localStorage.setItem('selectedFlight', JSON.stringify(flightData));
    navigate('/reserver', { state: flightData });
  };
// Charger les pays depuis l'API
useEffect(() => {
  fetch('https://restcountries.com/v3.1/all')
    .then((res) => res.json())
    .then((data) => {
      const options = data
        .filter((country) => 
          country.capital && country.capital.length > 0)
        .map((country) => ({
          label: `${country.name.common} - ${country.capital[0]} `,
          value: country.name.common,
          capital: country.capital[0],
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setCountries(data); 
      setCountryOptions(options); 
    })
    .catch((err) => console.error('Erreur lors du chargement des pays', err));
}, []);

  return (
    <section id="search-form" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 -mt-32 relative z-30">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trouvez votre prochain vol</h2>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Ville de départ */}
              <div>
                <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">
                    Ville de départ
                </label>
                <Select
                  options={countryOptions}
                  onChange={(selected) => setValue('departure', selected?.value)}
                  {...register('departure', { required: 'La ville de départ est requise' })}
                  placeholder="Sélectionnez un pays"
                  defaultValue={countryOptions.find(option => option.value === searchForm.departure)}
                />
                {errors.departure && (
                  <p className="text-red-500 text-xs mt-1">{errors.departure.message}</p>
                )}
              </div>

              {/* Pays d'arrivée */}
              <div>
                <label htmlFor="arrival" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville d'arrivée
                </label>
                <Select
                  options={countryOptions}
                  onChange={(selected) => setValue('arrival', selected?.value)}
                  {...register('arrival', { required: "La ville d'arrivée est requise" })}
                  placeholder="Sélectionnez un pays"
                  defaultValue={countryOptions.find(option => option.value === searchForm.arrival)}
                />
                {errors.arrival && (
                  <p className="text-red-500 text-xs mt-1">{errors.arrival.message}</p>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">Résultats de la recherche</h3>
            {flights.length === 0 ? (
              <p className="text-gray-600 text-center">Aucun vol trouvé. Essayez d'autres critères de recherche.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {flights.map((flight) => (
                  <div
                    key={flight.id || flight._id}
                    className="bg-gray-50 rounded-xl p-6 flex justify-between items-center shadow-md"
                  >
                    <div>
                      <p className="text-gray-800 font-semibold">
                        {flight.departure} → {flight.arrival}
                      </p>
                      <p className="text-gray-600">
                        Date: {new Date(flight.date || flight.departureDateTime).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-600">
                        Compagnie: {flight.airline || 'Air Senegal'}
                      </p>
                      <p className="text-gray-600">
                        Numéro de vol: {flight.flightNumber || 'SN000'}
                      </p>
                      <p className="text-blue-600 font-semibold">
                        Prix: {flight.price || 0} XOF
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookFlight(flight)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 rounded-button cursor-pointer whitespace-nowrap"
                    >
                      Réserver <i className="fas fa-ticket-alt ml-2"></i>
                    </button>
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