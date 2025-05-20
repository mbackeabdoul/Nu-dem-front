import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const AuthModal = () => {
  const { login, setShowAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('connexion');
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    motDePasse: '',
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnexion = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.motDePasse) {
      setMessage('Veuillez remplir tous les champs.');
      setIsSuccess(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/auth/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, motDePasse: formData.motDePasse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la connexion.');
      login({ _id: data.user._id, prenom: data.user.prenom, nom: data.user.nom, email: data.user.email }, data.token);
      setMessage('Connexion réussie !');
      setIsSuccess(true);
      setTimeout(() => {
        setShowAuthModal(false);
        navigate('/reserver', { state: JSON.parse(localStorage.getItem('selectedFlight')) });
      }, 1000);
    } catch (error) {
      console.error('Connexion error:', error);
      setMessage(error.message || 'Une erreur s’est produite lors de la connexion.');
      setIsSuccess(false);
    }
  };

  const handleInscription = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    if (!formData.prenom || !formData.nom || !formData.email || !formData.motDePasse) {
      setMessage('Tous les champs sont requis.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/auth/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();
      console.log('Inscription API response:', responseData);

      if (!res.ok) {
        throw new Error(responseData.message || 'Erreur lors de l’inscription.');
      }

      setMessage('Inscription réussie ! Redirection vers la connexion...');
      setIsSuccess(true);
      setTimeout(() => {
        setTab('connexion');
        setFormData({ prenom: '', nom: '', email: '', motDePasse: '' });
        navigate('/connexion');
      }, 2000);
    } catch (error) {
      console.error('Inscription error:', error);
      setMessage('Inscription enregistrée. Veuillez vous connecter pour continuer.');
      setIsSuccess(true);
      setTimeout(() => {
        setTab('connexion');
        setFormData({ prenom: '', nom: '', email: '', motDePasse: '' });
        navigate('/connexion');
      }, 2000);
    }
  };

  const handleGuest = () => {
    setShowAuthModal(false);
    localStorage.setItem('guest', 'true');
    navigate('/reserver', { state: JSON.parse(localStorage.getItem('selectedFlight')) });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Accéder à la réservation</h2>
          <button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 text-center ${tab === 'connexion' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setTab('connexion')}
          >
            Connexion
          </button>
          <button
            className={`flex-1 py-2 text-center ${tab === 'inscription' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setTab('inscription')}
          >
            Inscription
          </button>
          <button
            className={`flex-1 py-2 text-center ${tab === 'guest' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setTab('guest')}
          >
            Invité
          </button>
        </div>
        {message && (
          <p className={`text-center text-sm mb-4 ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        {tab === 'connexion' && (
          <form onSubmit={handleConnexion} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Se connecter
            </button>
          </form>
        )}
        {tab === 'inscription' && (
          <form onSubmit={handleInscription} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              S’inscrire
            </button>
          </form>
        )}
        {tab === 'guest' && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Continuez sans créer de compte. Vous devrez fournir vos informations pour la réservation.</p>
            <button
              onClick={handleGuest}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Continuer en tant qu’invité
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;