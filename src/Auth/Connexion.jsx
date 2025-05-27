import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../AuthContext.jsx';

const Connexion = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 // Dans Connexion.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  if (!formData.email || !formData.motDePasse) {
    setError('Veuillez remplir tous les champs.');
    return;
  }
  try {
    const res = await fetch('https://nu-dem-back.onrender.com/api/auth/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la connexion.');
    login(data.user, data.token);
    toast.success('Connexion réussie !');
    const pendingFlight = JSON.parse(localStorage.getItem('pendingFlight'));
    if (pendingFlight) {
      localStorage.setItem('selectedFlight', JSON.stringify(pendingFlight));
      localStorage.setItem('selectedFlightId', pendingFlight.id || 'unknown');
      localStorage.removeItem('pendingFlight');
      navigate('/reserver', { state: pendingFlight });
    } else {
      navigate('/recherche');
    }
  } catch (err) {
    setError(err.message || 'Erreur lors de la connexion.');
    toast.error(err.message || 'Erreur lors de la connexion.');
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
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
      </form>
    </div>
  );
};

export default Connexion;