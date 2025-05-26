import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';

const AuthModal = ({ context = 'general' }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    console.error('AuthContext is undefined in AuthModal');
    return null;
  }
  const { showAuthModal, setShowAuthModal, login } = authContext;
  const [tab, setTab] = useState('connexion');
  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', motDePasse: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnexion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, motDePasse: formData.motDePasse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur connexion');
      login(data.user, data.token);
      setMessage('Connexion réussie !');
      setIsSuccess(true);
      toast.success('Connexion réussie !');
      const pendingFlight = JSON.parse(localStorage.getItem('pendingFlight'));
      setTimeout(() => {
        setShowAuthModal(false);
        if (pendingFlight && context === 'reservation') {
          localStorage.setItem('selectedFlight', JSON.stringify(pendingFlight));
          localStorage.setItem('selectedFlightId', pendingFlight.id || 'unknown');
          localStorage.removeItem('pendingFlight');
          navigate('/reserver', { state: pendingFlight });
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (error) {
      setMessage(error.message);
      setIsSuccess(false);
      toast.error(error.message || 'Erreur lors de la connexion.');
    }
  };

  const handleInscription = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    if (!formData.prenom || !formData.nom || !formData.email || !formData.motDePasse) {
      setMessage('Tous les champs sont requis.');
      setIsSuccess(false);
      toast.error('Tous les champs sont requis.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l’inscription.');
      login(data.user, data.token);
      setMessage('Inscription réussie ! Redirection...');
      setIsSuccess(true);
      toast.success('Inscription réussie !');
      const pendingFlight = JSON.parse(localStorage.getItem('pendingFlight'));
      setTimeout(() => {
        setShowAuthModal(false);
        if (pendingFlight && context === 'reservation') {
          localStorage.setItem('selectedFlight', JSON.stringify(pendingFlight));
          localStorage.setItem('selectedFlightId', pendingFlight.id || 'unknown');
          localStorage.removeItem('pendingFlight');
          navigate('/reserver', { state: pendingFlight });
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (error) {
      setMessage(error.message || 'Erreur lors de l’inscription.');
      setIsSuccess(false);
      toast.error(error.message || 'Erreur lors de l’inscription.');
    }
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setFormData({ prenom: '', nom: '', email: '', motDePasse: '' });
    setMessage('');
    setIsSuccess(false);
    navigate('/'); // Retour à l'accueil
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {context === 'reservation' ? 'Connexion requise' : 'Connexion ou Inscription'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 transition duration-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          {context === 'reservation'
            ? 'Veuillez vous connecter ou vous inscrire pour réserver votre vol.'
            : 'Connectez-vous ou créez un compte pour accéder à toutes les fonctionnalités.'}
        </p>
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
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Se connecter
            </button>
             <a href="/mot-de-passe-oublie" className="text-blue-600 hover:underline text-sm">Mot de passe oublié ?</a>
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
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              S’inscrire
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;