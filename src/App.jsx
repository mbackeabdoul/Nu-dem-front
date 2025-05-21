import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Connexion from './Auth/Connexion';
import Inscription from './Auth/Inscriptions';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext();

const App = () => {
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
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
  // Restore session from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (token && user) {
    setAuth({ isAuthenticated: true, user, token });
  }

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('http://localhost:5000/api/bookings', { headers });
      if (res.status === 401) {
        console.log('Token expiré, déconnexion');
        logout();
        return;
      }
      if (!res.ok) throw new Error('Erreur lors de la récupération des réservations');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Erreur récupération réservations:', err.message);
    }
  };
  fetchBookings();
}, [auth.token]);
  const login = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ isAuthenticated: true, user, token });
    setShowAuthModal(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null, token: null });
    setBookings([]);
  };

  const handleSearchSubmit = async (data) => {
    console.log('Recherche soumise:', data);
    setSearchForm(data);
    const query = new URLSearchParams(data).toString();
    try {
      const res = await fetch(`http://localhost:5000/api/flights?${query}`);
      if (!res.ok) throw new Error('Erreur lors de la recherche des vols');
      const flightsData = await res.json();
      setFlights(flightsData);
      console.log('Flights found:', flightsData);
    } catch (err) {
      console.error('Erreur recherche vols:', err.message);
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
        logout();
        return;
      }
      if (!res.ok) throw new Error('Erreur lors de l’annulation de la réservation');
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error('Erreur annulation réservation:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setShowAuthModal }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <ToastContainer />
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
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
          </Routes>
          <Footer />
          {isModalOpen && selectedCountry && (
            <CountryModal
              country={selectedCountry}
              onClose={() => setIsModalOpen(false)}
              onCitySelect={handlePreFillSearch}
            />
          )}
          {showAuthModal && <AuthModal />}
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;