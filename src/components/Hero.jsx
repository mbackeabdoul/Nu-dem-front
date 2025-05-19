import React from 'react';

const Hero = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent z-10"></div>
      <div
        className="h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=A%20luxurious%20airplane%20flying%20above%20clouds%20during%20sunset%2C%20with%20golden%20light%20illuminating%20the%20scene.%20The%20sky%20is%20a%20gradient%20of%20blue%20and%20orange%2C%20creating%20a%20serene%20and%20aspirational%20atmosphere.%20The%20image%20has%20a%20clean%2C%20minimalist%20background%20that%20emphasizes%20the%20elegance%20of%20air%20travel&width=1440&height=500&seq=1&orientation=landscape')`,
        }}
      ></div>
      <div className="absolute inset-0 flex items-center z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Découvrez le monde à votre rythme
            </h1>
            <p className="text-xl text-white mb-8">
              Réservez vos billets d'avion en quelques clics et embarquez pour l'aventure de votre vie.
            </p>
            <button
              onClick={() => {
                const searchForm = document.getElementById('search-form');
                if (searchForm) {
                  searchForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 rounded-button cursor-pointer whitespace-nowrap"
            >
              Rechercher un vol <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;