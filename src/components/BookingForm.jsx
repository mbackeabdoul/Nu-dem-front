import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { departure = '', arrival = '' } = location.state || {};

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departure,
      arrival,
    },
  });

  // Set initial values for departure and arrival
  React.useEffect(() => {
    setValue('departure', departure);
    setValue('arrival', arrival);
  }, [departure, arrival, setValue]);

  const submitHandler = async (data) => {
    await onSubmit(data);
    navigate('/mes-reservations');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Réserver un vol</h2>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName', { required: 'Le prénom est requis' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register('lastName', { required: 'Le nom est requis' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'L’email est requis',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Email invalide',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone', {
                    required: 'Le numéro de téléphone est requis',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Numéro de téléphone invalide',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="departure"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ville de départ
                </label>
                <input
                  type="text"
                  id="departure"
                  {...register('departure', { required: 'La ville de départ est requise' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {errors.departure && (
                  <p className="text-red-500 text-xs mt-1">{errors.departure.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="arrival"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ville d'arrivée
                </label>
                <input
                  type="text"
                  id="arrival"
                  {...register('arrival', { required: 'La ville d’arrivée est requise' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {errors.arrival && (
                  <p className="text-red-500 text-xs mt-1">{errors.arrival.message}</p>
                )}
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out rounded-button cursor-pointer whitespace-nowrap"
              >
                Confirmer la réservation <i className="fas fa-check ml-2"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;