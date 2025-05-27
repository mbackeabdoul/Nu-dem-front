import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchForm from './components/SearchForm';
import PopularDestinations from './components/PopularDestinations';
import Features from './components/Features';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CountryModal from './components/CountryModal';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthContext } from './AuthContext.jsx';

const App = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('AuthContext is undefined. Ensure App is wrapped in AuthProvider.');
    return <div>Erreur : Contexte d’authentification non disponible.</div>;
  }
  const { auth } = context;

  const [searchForm, setSearchForm] = useState({
    departure: '',
    arrival: '',
    date: '',
    passengers: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
        const res = await fetch('http://localhost:5000/api/bookings', { headers });
        if (!res.ok) throw new Error('Erreur chargement réservations');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Erreur chargement réservations:', err.message);
        toast.error('Erreur chargement réservations');
      }
    };
    if (auth.isAuthenticated) fetchBookings();
  }, [auth]);

  const handleSearchSubmit = async (data) => {
    console.log('Recherche soumise:', data);
    setSearchForm(data);
    const query = new URLSearchParams({

      
      departureName: data.departureName,
     
      arrivalName: data.arrivalName,

      departure: data.departure,
      arrival: data.arrival,
      date: data.date,
      tripType: data.tripType,
      returnDate: data.returnDate ,
      passengers: data.passengers.toString(),
    }).toString();
    try {
      const res = await fetch(`http://localhost:5000/api/flights?${query}`);
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { error: 'Réponse serveur invalide' };
        }
        console.error('Erreur backend:', {
          message: errorData.error,
          status: res.status,
          details: errorData.details,
        });
        toast.error(`Erreur de recherche : ${errorData.error || 'Veuillez réessayer.'}`);
        throw new Error(errorData.error || `Erreur HTTP ${res.status}`);
      }
      const flightsData = await res.json();
      setFlights(flightsData);
      console.log('Vols trouvés:', flightsData);
      toast.success(`${flightsData.length} vol(s) trouvé(s) !`);
    } catch (err) {
      console.error('Erreur recherche vols:', {
        message: err.message,
        stack: err.stack,
      });
      toast.error('Erreur lors de la recherche des vols. Vérifiez votre connexion ou réessayez.');
      setFlights([]);
    }
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const handlePreFillSearch = (city) => {
    setSearchForm((prev) => ({ ...prev, arrival: city }));
    setIsModalOpen(false);
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = async (booking) => {
    setBookings([...bookings, booking]);
  };

  const handleCancelBooking = async (id) => {
    try {
      const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.status === 401) {
        console.log('Token expiré, déconnexion');
        setBookings([]);
        return;
      }
      if (!res.ok) throw new Error('Erreur lors de l’annulation de la réservation');
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error('Erreur annulation réservation:', err.message);
      toast.error('Erreur annulation réservation');
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <SearchForm
                  searchForm={searchForm}
                  setSearchForm={setSearchForm}
                  onSubmit={handleSearchSubmit}
                  flights={flights}
                />
                <PopularDestinations onCountryClick={handleCountryClick} />
                <Features />
                <FAQ />
                <CTA />
              </>
            }
          />
          <Route
            path="/recherche"
            element={
              <SearchForm
                searchForm={searchForm}
                setSearchForm={setSearchForm}
                onSubmit={handleSearchSubmit}
                flights={flights}
              />
            }
          />
          <Route
            path="/reserver"
            element={
              <ErrorBoundary>
                <BookingForm onSubmit={handleBookingSubmit} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/mes-reservations"
            element={
              <MyBookings bookings={bookings} onCancel={handleCancelBooking} />
            }
          />
        </Routes>
        <Footer />
        {isModalOpen && selectedCountry && (
          <CountryModal
            country={selectedCountry}
            onClose={() => setIsModalOpen(false)}
            onCitySelect={handlePreFillSearch}
          />
        )}
        <AuthModal context="reservation" />
      </div>
    </Router>
  );
};

export default App;