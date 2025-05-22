import React, { useEffect, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { toast } from 'react-toastify';

const BookingForm = ({ onSubmit }) => {
  const { auth, setShowAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [flightData, setFlightData] = useState(null);
  const [error, setError] = useState('');
  const [isFormReady, setIsFormReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        // Handle arrivalDateTime: Convert "Non spécifié" to null
        let arrivalDateTime = initialData.arrivalDateTime || 'Non spécifié';
        if (arrivalDateTime === 'Non spécifié') {
          arrivalDateTime = null; // Set to null if not specified
        } else {
          const parsedArrivalDate = new Date(arrivalDateTime);
          arrivalDateTime = !isNaN(parsedArrivalDate.getTime()) ? parsedArrivalDate.toISOString() : null;
        }

        const normalizedData = {
          departure: initialData.departure || 'Non spécifié',
          arrival: initialData.arrival || 'Non spécifié',
          price: initialData.price || 0,
          airline: initialData.airline || 'Air Senegal',
          flightNumber: initialData.flightNumber || 'SN000',
          departureDateTime: formattedDateTime,
          arrivalDateTime: arrivalDateTime, // Now either a valid ISO string or null
          duration: initialData.duration || 'Non spécifié',
          seat: initialData.seat || 'Non assigné',
          checkInTime: initialData.checkInTime || new Date(new Date(formattedDateTime).getTime() - 2 * 60 * 60 * 1000).toISOString(),
          remainingSeats: initialData.remainingSeats || 'N/A',
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
          arrivalDateTime: null, // Set to null instead of "Non spécifié"
          duration: 'Non spécifié',
          seat: 'Non assigné',
          checkInTime: 'Non spécifié',
          remainingSeats: 'N/A',
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
        customerPhone: auth.isAuthenticated ? auth.user?.phone || '' : '',
        departure: flightData.departure,
        arrival: flightData.arrival,
        price: flightData.price,
        airline: flightData.airline,
        flightNumber: flightData.flightNumber,
        departureDateTime: flightData.departureDateTime,
        arrivalDateTime: flightData.arrivalDateTime, // Will be null if "Non spécifié"
        duration: flightData.duration,
        seat: flightData.seat,
        checkInTime: flightData.checkInTime,
        remainingSeats: flightData.remainingSeats,
        paymentMethod: 'Wave',
      };
      reset(defaultValues);
      console.log('Form initialized with:', defaultValues);
    }
  }, [flightData, isFormReady, auth, reset]);

  const formatDuration = (duration) => {
    if (!duration || duration === 'Non spécifié') {
      return 'Non disponible';
    }
    try {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      return `${hours}h${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return 'Non disponible';
    }
  };

  const submitHandler = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      setError('');
      if (!auth.isAuthenticated && !localStorage.getItem('guest')) {
        console.log('Utilisateur non connecté, affichage modal');
        setShowAuthModal(true);
        toast.error('Veuillez vous connecter ou continuer en tant qu’invité.');
        return;
      }
      if (!flightData || !data.departureDateTime) {
        throw new Error('Données de vol incomplètes.');
      }

      // Ensure arrivalDateTime is either a valid date or null
      const arrivalDateTime = data.arrivalDateTime && data.arrivalDateTime !== 'Non spécifié'
        ? new Date(data.arrivalDateTime).toISOString()
        : null;

      const bookingData = {
        ...data,
        userId: auth.isAuthenticated ? auth.user?._id || null : null,
        ticketNumber: `TKT-${Date.now()}`,
        paymentStatus: 'pending',
        departureDateTime: data.departureDateTime,
        arrivalDateTime: arrivalDateTime, // Now either a valid ISO string or null
        duration: data.duration,
        seat: data.seat,
        checkInTime: data.checkInTime,
        remainingSeats: data.remainingSeats,
      };

      console.log('Booking data sent to API:', bookingData);

      const bookingRes = await fetch('https://nu-dem-back.onrender.com/api/bookings', {
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
        toast.success('Paiement réussi ! Réservation confirmée. Vérifiez votre boîte de réception (ou spams) pour télécharger votre billet.');
        navigate('/mes-reservations');
      } else {
        setError('Le paiement a échoué. Veuillez réessayer.');
        toast.error('Le paiement a échoué.');
      }
    } catch (err) {
      console.error('Error in booking or payment:', err);
      setError(err.message || 'Une erreur est survenue.');
      toast.error(err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
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
  const formattedArrivalDate = flightData.arrivalDateTime
    ? new Date(flightData.arrivalDateTime).toLocaleString('fr-FR')
    : 'Non spécifiée'; // Handle null case
  const formattedCheckInTime = flightData.checkInTime && flightData.checkInTime !== 'Non spécifié'
    ? new Date(flightData.checkInTime).toLocaleString('fr-FR')
    : 'Non spécifiée';
  const formattedDuration = formatDuration(flightData.duration);

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                {...register('customerEmail', { required: 'Ce champ est requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              {errors.customerEmail && <p className="text-red-500 text-sm">{errors.customerEmail.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Téléphone</label>
              <input
                {...register('customerPhone', { required: 'Ce champ est requis', pattern: { value: /^\+221\d{9}$/, message: 'Format: +221123456789' } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Date d'arrivée</label>
              <input
                type="text"
                value={formattedArrivalDate}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              <input
                type="precision"
                {...register('arrivalDateTime')}
                defaultValue={flightData.arrivalDateTime}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Durée</label>
              <input
                type="text"
                value={formattedDuration}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              <input
                type="hidden"
                {...register('duration')}
                defaultValue={flightData.duration}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Siège</label>
              <input
                {...register('seat')}
                defaultValue={flightData.seat}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Heure de convocation</label>
              <input
                type="text"
                value={formattedCheckInTime}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
              <input
                type="hidden"
                {...register('checkInTime')}
                defaultValue={flightData.checkInTime}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Places restantes</label>
              <input
                {...register('remainingSeats')}
                defaultValue={flightData.remainingSeats}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
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
              <label class CHURCHName="block mb-1 text-sm font-medium text-gray-700">Numéro de vol</label>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
            disabled={isSubmitting}
            className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'En cours...' : 'Confirmer la réservation'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;