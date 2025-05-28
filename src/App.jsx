import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import MotDePasseOublier from './components/MotDePasseOublier.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Contact from './components/Contact'; // Ajoute cette importation

const AppContent = ({
  auth, searchForm, setSearchForm, flights, handleSearchSubmit,
  bookings, handleBookingSubmit, handleCancelBooking,
  isModalOpen, selectedCountry, handleCountryClick, handlePreFillSearch
}) => {
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname === '/mot-de-passe-oublie' ||
    location.pathname.startsWith('/reset-password');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublier />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
        <Route path="/contact" element={<Contact />} /> {/* Ajoute cette route */}
      </Routes>
      {!hideHeaderFooter && <Footer />}
      {isModalOpen && selectedCountry && (
        <CountryModal
          country={selectedCountry}
          onClose={() => setIsModalOpen(false)}
          onCitySelect={handlePreFillSearch}
        />
      )}
      <AuthModal context="reservation" />
    </div>
  );
};

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
        const res = await fetch('https://nu-dem-back.onrender.com/api/bookings', { headers });
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
    setSearchForm(data);
    const query = new URLSearchParams({
      departureName: data.departureName,
      arrivalName: data.arrivalName,
      departure: data.departure,
      arrival: data.arrival,
      date: data.date,
      tripType: data.tripType,
      returnDate: data.returnDate,
      passengers: data.passengers.toString(),
    }).toString();

    try {
      const res = await fetch(`https://nu-dem-back.onrender.com/api/flights?${query}`);
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: 'Réponse serveur invalide' };
        }
        toast.error(`Erreur de recherche : ${errorData.error || 'Veuillez réessayer.'}`);
        throw new Error(errorData.error || `Erreur HTTP ${res.status}`);
      }
      const flightsData = await res.json();
      setFlights(flightsData);
      toast.success(`${flightsData.length} vol(s) trouvé(s) !`);
    } catch (err) {
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
      const res = await fetch(`https://nu-dem-back.onrender.com/api/bookings/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Erreur lors de l’annulation de la réservation');
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (err) {
      toast.error('Erreur annulation réservation');
    }
  };

  return (
    <Router>
      <AppContent
        auth={auth}
        searchForm={searchForm}
        setSearchForm={setSearchForm}
        flights={flights}
        handleSearchSubmit={handleSearchSubmit}
        bookings={bookings}
        handleBookingSubmit={handleBookingSubmit}
        handleCancelBooking={handleCancelBooking}
        isModalOpen={isModalOpen}
        selectedCountry={selectedCountry}
        handleCountryClick={handleCountryClick}
        handlePreFillSearch={handlePreFillSearch}
      />
    </Router>
  );
};

export default App;