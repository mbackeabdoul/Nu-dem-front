import React from 'react';
import { popularCities } from '../data/popularCities';

const PopularDestinations = ({ onCountryClick }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Destinations populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos destinations les plus populaires et laissez-vous inspirer pour votre prochain voyage.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCities.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={`https://readdy.ai/api/search-image?query=Beautiful%20cityscape%20of%20${encodeURIComponent(
                    city.name
                  )}%2C%20${encodeURIComponent(
                    city.country
                  )}%20with%20iconic%20landmarks%20and%20architecture.%20The%20image%20has%20a%20clean%2C%20bright%20background%20with%20natural%20lighting%20that%20highlights%20the%20citys%20unique%20character.%20Professional%20travel%20photography%20style%20with%20vibrant%20colors%20and%20crisp%20details&width=400&height=200&seq=${
                    city.id
                  }&orientation=landscape`}
                  alt={`${city.name}, ${city.country}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{city.name}</h3>
                <p
                  className="text-gray-600 mb-4 hover:text-blue-600 cursor-pointer"
                  onClick={() => onCountryClick(city.country)}
                >
                  {city.country}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">À partir de 299 €</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium rounded-button cursor-pointer whitespace-nowrap">
                    Voir les offres <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;