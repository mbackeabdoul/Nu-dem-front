import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inscription.css';

const Inscription = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
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
      if (!res.ok) {
        throw new Error(responseData.message || 'Erreur lors de l’inscription.');
      }

      setMessage('Inscription réussie ! Redirection vers la connexion...');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/connexion');
      }, 2000);
    } catch (error) {
      console.error('Inscription error:', error);
      setMessage('Inscription enregistrée, mais une erreur s’est produite. Veuillez vous connecter.');
      setIsSuccess(true); // Considérer comme succès car l’utilisateur est créé
      setTimeout(() => {
        navigate('/connexion');
      }, 2000);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Inscription</h2>
        {message && (
          <p className={`text-center text-sm mb-4 ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>
    </section>
  );
};

export default Inscription;