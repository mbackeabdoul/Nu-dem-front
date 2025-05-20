// import React from 'react';
// import Hero from '../components/Hero';
// import PopularDestinations from '../components/PopularDestinations';
// import Features from '../components/Features';
// import FAQ from '../components/FAQ';
// import CTA from '../components/CTA';

// /**
//  * HomePage component that combines all the sections for the landing page
//  * 
//  * @param {Object} props - Component props
//  * @param {Function} props.onCountryClick - Function to handle when a country is clicked
//  * @param {ReactNode} props.children - Child components (SearchForm is passed as children)
//  */
// const HomePage = ({ onCountryClick, children }) => {
//   return (
//     <div className="flex flex-col w-full">
//       {/* Hero section with banner and main message */}
//       <Hero />
      
//       {/* Search form is injected here from App.js */}
//       <section id="search-section" className="py-8 px-4 md:px-8 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
//             Trouvez votre vol idéal
//           </h2>
//           {children}
//         </div>
//       </section>
      
//       {/* Popular destinations with clickable countries */}
//       <PopularDestinations onCountryClick={onCountryClick} />
      
//       {/* Features section highlighting service benefits */}
//       <Features />
      
//       {/* Frequently asked questions */}
//       <FAQ />
      
//       {/* Call to action section */}
//       <CTA />
//     </div>
//   );
// };

// export default HomePage;