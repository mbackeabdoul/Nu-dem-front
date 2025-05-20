import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inscription = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    motDePasse: ''
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.prenom || !formData.nom || !formData.email || !formData.motDePasse) {
      setMessage('Tous les champs sont requis.');
      setIsSuccess(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/auth/inscription', formData);
      console.log('Réponse:', res.data);
      setMessage('Inscription réussie !');
      setIsSuccess(true);
      setFormData({ prenom: '', nom: '', email: '', motDePasse: '' });

        // Redirection vers la page connexion après 2 secondes
        setTimeout(() => {
            navigate('/connexion'); // <- redirection
          }, 2000);

    } catch (error) {
      console.error('Erreur lors de l’inscription:', error);
      const errMsg = error.response?.data?.message || "Une erreur s'est produite.";
      setMessage(errMsg);
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-2xl shadow-lg bg-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">Créer un compte</h2>

      {message && (
        <p className="mb-4 text-center text-sm text-red-500">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder=""
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder=""
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=""
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            name="motDePasse"
            value={formData.motDePasse}
            onChange={handleChange}
            placeholder=""
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 text-right">
            <a href="/mot-de-passe-oublie" className="text-sm text-blue-600 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          S'inscrire
        </button>
        <div>
            <p className="text-sm text-end text-gray-600">
                Déjà un compte ?{' '}
                <a href="/connexion" className="text-blue-600 hover:underline">
                Connexion
                </a>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Inscription;
