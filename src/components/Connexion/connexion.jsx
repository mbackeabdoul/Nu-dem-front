// src/components/Connexion/connexion.jsx
import React, { useState } from 'react';

import axios from 'axios';

const Connexion = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.motDePasse) {
      setMessage('Veuillez remplir tous les champs.');
      setIsSuccess(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/auth/connexion', formData);
      console.log('Réponse:', res.data);

      setMessage('Connexion réussie !');
      setIsSuccess(true);
      setFormData({ email: '', motDePasse: '' });

      window.location.href = '/reserver'; 
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      const errMsg = error.response?.data?.message || "Une erreur s'est produite.";
      setMessage(errMsg);
      setIsSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 rounded-2xl shadow-lg bg-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">Se connecter</h2>

      {message && (
        <p className="mb-4 text-center text-sm text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
          Se connecter
        </button>
        <div className="text-end mt-4">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <a href="/inscription" className="text-blue-600 hover:underline">
              S'inscrire
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Connexion;
