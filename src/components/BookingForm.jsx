import React, { useEffect, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'react-toastify';

const BookingForm = ({ onSubmit }) => {
  const { auth, setShowAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [flightData, setFlightData] = useState(null);
  const [error, setError] = useState('');
  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    const initializeFlightData = async () => {
      try {
        let initialData = location.state || JSON.parse(localStorage.getItem('selectedFlight')) || {};
        console.log('Initial flight data:', initialData);

        if (!initialData.departure && localStorage.getItem('selectedFlightId')) {
          try {
            const res = await fetch(`http://localhost:5000/api/flights/${localStorage.getItem('selectedFlightId')}`);
            if (!res.ok) throw new Error('Erreur lors de la récupération du vol');
            initialData = await res.json();
            console.log('Flight data from API:', initialData);
            localStorage.setItem('selectedFlight', JSON.stringify(initialData));
          } catch (err) {
            console.error('Error fetching flight:', err);
            setError('Impossible de récupérer les détails du vol.');
            toast.error('Impossible de récupérer les détails du vol.');
          }
        }

        let formattedDateTime = new Date().toISOString();
        if (initialData.departureDateTime || initialData.date) {
          const dateValue = initialData.departureDateTime || initialData.date;
          const parsedDate = new Date(dateValue);
          if (!isNaN(parsedDate.getTime())) {
            formattedDateTime = parsedDate.toISOString();
          } else {
            console.error('Invalid date:', dateValue);
          }
        }

        const normalizedData = {
          departure: initialData.departure || 'Non spécifié',
          arrival: initialData.arrival || 'Non spécifié',
          price: initialData.price || 0,
          airline: initialData.airline || 'Air Senegal',
          flightNumber: initialData.flightNumber || 'SN000',
          departureDateTime: formattedDateTime,
        };

        console.log('Normalized flight data:', normalizedData);
        setFlightData(normalizedData);
        localStorage.setItem('selectedFlight', JSON.stringify(normalizedData));
        setIsFormReady(true);
      } catch (err) {
        console.error('Error initializing flight data:', err);
        setError('Erreur lors de l’initialisation des données.');
        toast.error('Erreur lors de l’initialisation des données.');
        setFlightData({
          departure: 'Non spécifié',
          arrival: 'Non spécifié',
          price: 0,
          airline: 'Air Senegal',
          flightNumber: 'SN000',
          departureDateTime: new Date().toISOString(),
        });
        setIsFormReady(true);
      }
    };

    initializeFlightData();
    if (!auth.isAuthenticated && !localStorage.getItem('guest')) {
      setShowAuthModal(true);
    }
  }, [auth, location.state, setShowAuthModal]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (flightData && isFormReady) {
      const defaultValues = {
        customerName: auth.isAuthenticated ? `${auth.user?.prenom || ''} ${auth.user?.nom || ''}`.trim() : '',
        customerEmail: auth.isAuthenticated ? auth.user?.email || '' : '',
        customerPhone: '',
        departure: flightData.departure,
        arrival: flightData.arrival,
        price: flightData.price,
        airline: flightData.airline,
        flightNumber: flightData.flightNumber,
        departureDateTime: flightData.departureDateTime,
        paymentMethod: 'Wave',
      };
      reset(defaultValues);
      console.log('Form initialized with:', defaultValues);
    }
  }, [flightData, isFormReady, auth, reset]);

  const submitHandler = async (data) => {
    try {
      setError('');
      if (!flightData || !data.departureDateTime) {
        throw new Error('Données de vol incomplètes.');
      }

      const bookingData = {
        ...data,
        userId: auth.isAuthenticated ? auth.user?._id || null : null,
        ticketNumber: `TKT-${Date.now()}`,
        paymentStatus: 'pending',
        departureDateTime: data.departureDateTime,
      };

      console.log('Booking data sent to API:', bookingData);

      const bookingRes = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(auth.token && { Authorization: `Bearer ${auth.token}` }),
        },
        body: JSON.stringify(bookingData),
      });

      const bookingResponse = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingResponse.error || 'Erreur lors de la création de la réservation');
      }

      const paymentRes = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingResponse._id, paymentMethod: data.paymentMethod }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentData.error || 'Erreur lors du paiement');
      }

      if (paymentData.success) {
        await onSubmit(bookingResponse);
        localStorage.removeItem('selectedFlight');
        localStorage.removeItem('selectedFlightId');
        localStorage.removeItem('guest');
        toast.success('Réservation confirmée !');
        navigate('/mes-reservations');
      } else {
        setError('Le paiement a échoué. Veuillez réessayer.');
        toast.error('Le paiement a échoué.');
      }
    } catch (err) {
      console.error('Error in booking or payment:', err);
      setError(err.message || 'Une erreur est survenue.');
      toast.error(err.message || 'Une erreur est survenue.');
    }
  };

  if (!isFormReady || !flightData) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Chargement du formulaire...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  const formattedDate = flightData.departureDateTime
    ? new Date(flightData.departureDateTime).toLocaleString('fr-FR')
    : 'Non spécifiée';

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Formulaire de réservation</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit(submitHandler)} className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nom complet</label>
              <input
                {...register('customerName', { required: 'Ce champ est requis' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                {...register('customerEmail', { required: 'Ce champ est requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.customerEmail && <p className="text-red-500 text-sm">{errors.customerEmail.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Téléphone</label>
              <input
                {...register('customerPhone', { required: 'Ce champ est requis', pattern: { value: /^\+221\d{9}$/, message: 'Format: +221123456789' } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+221XXXXXXXXX"
              />
              {errors.customerPhone && <p className="text-red-500 text-sm">{errors.customerPhone.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Départ</label>
              <input
                {...register('departure')}
                defaultValue={flightData.departure}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Arrivée</label>
              <input
                {...register('arrival')}
                defaultValue={flightData.arrival}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Date de départ</label>
              <input
                type="text"
                value={formattedDate}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              <input
                type="hidden"
                {...register('departureDateTime')}
                defaultValue={flightData.departureDateTime}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Compagnie</label>
              <input
                {...register('airline')}
                defaultValue={flightData.airline}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Numéro de vol</label>
              <input
                {...register('flightNumber')}
                defaultValue={flightData.flightNumber}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Prix</label>
              <input
                {...register('price')}
                defaultValue={flightData.price}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Moyen de paiement</label>
              <select
                {...register('paymentMethod', { required: 'Ce champ est requis' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Wave">Wave</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Carte bancaire">Carte bancaire</option>
              </select>
              {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Confirmer la réservation
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;