//le fechier de la liste des villes populaires avec l'api amadeus
// export const popularCities = [
//   { id: 1, name: 'Paris', country: 'France' },
//   { id: 2, name: 'New York', country: 'États-Unis' },
//   { id: 3, name: 'Tokyo', country: 'Japon' },
// ];
//  export const popularCities = [
//   {
//     name: 'Paris',
//     iataCode: 'PAR',
//     countryCode: 'FR',
//     imageUrl: 'https://flagcdn.com/fr.svg', 
//   },
//   {
//     name: 'New York',
//     iataCode: 'NYC',
//     countryCode: 'US',
//     imageUrl: 'https://flagcdn.com/us.svg',
//   },
 
//   {
//     name: 'Londres',
//     iataCode: 'LON',
//     countryCode: 'GB',
//     imageUrl: 'https://flagcdn.com/gb.svg',
//   },
//   {
//     name: 'Dubaï',
//     iataCode: 'DXB',
//     countryCode: 'AE',
//     imageUrl: 'https://flagcdn.com/ae.svg',
//   }
// ];

 export const popularCities = [
  {
    from: 'Dakar',
    fromCode: 'DSS',
    to: 'Paris',
    toCode: 'CDG',
    departureDate: '14/07/2025',
    returnDate: '11/08/2025',
    price: '452 300',
    class: 'Economy',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'
  },
  {
    from: 'Dakar',
    fromCode: 'DSS',
    to: 'New York',

    toCode: 'JFK',
    departureDate: '14/07/2025',
    returnDate: '11/08/2025',
    price: '1 200 000',
    class: 'Economy',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'
  },

  // autres offres...
];
