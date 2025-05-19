import React from 'react';

const CTA = () => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Prêt à décoller pour votre prochaine aventure ?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Réservez votre billet d'avion maintenant et préparez-vous à une expérience inoubliable.
        </p>
        <button
          onClick={() => {
            const searchForm = document.getElementById('search-form');
            if (searchForm) {
              searchForm.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out rounded-button cursor-pointer whitespace-nowrap"
        >
          Commencer ma recherche <i className="fas fa-paper-plane ml-2"></i>
        </button>
      </div>
    </section>
  );
};

export default CTA;