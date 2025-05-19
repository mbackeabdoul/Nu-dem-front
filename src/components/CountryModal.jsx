import React from 'react';
import { countryData } from '../data/countryData';

const CountryModal = ({ country, onClose, onCitySelect }) => {
  const data = countryData[country];

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Découvrez {data.name}
        </h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Villes principales</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.cities.map((city, index) => (
              <button
                key={index}
                onClick={() => onCitySelect(city)}
                className="bg-gray-100 hover:bg-blue-50 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-200 rounded-button whitespace-nowrap"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Offres spéciales</h3>
          <div className="space-y-3">
            {data.specialOffers.map((offer, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-gray-800">{offer.title}</span>
                <span className="text-blue-600 font-semibold">{offer.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Fourchette de prix</h3>
          <p className="text-gray-600">
            De {data.priceRange.min}€ à {data.priceRange.max}€
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 rounded-button whitespace-nowrap"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;