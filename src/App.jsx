import React, { useState, useEffect } from 'react';
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
import Inscription from './components/Inscription/inscription';
import Connexion from './components/Connexion/connexion';

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
  const [flights, setFlights] = useState([]); // New state for flights

  useEffect(() => {
    // Fetch bookings from backend
    fetch('http://localhost:5000/api/bookings')
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error('Error fetching bookings:', err));
  }, []);

  const handleSearchSubmit = async (data) => {
    console.log('Recherche soumise:', data);
    setSearchForm(data);
    const query = new URLSearchParams(data).toString();
    try {
      const res = await fetch(`http://localhost:5000/api/flights?${query}`);
      if (!res.ok) throw new Error('Erreur lors de la recherche des vols');
      const flightsData = await res.json();
      setFlights(flightsData); // Store flights in state
      console.log('Flights found:', flightsData);
    } catch (err) {
      console.error('Error fetching flights:', err);
      setFlights([]); // Clear flights on error
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
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (!res.ok) throw new Error('Erreur lors de la création de la réservation');
      const newBooking = await res.json();
      setBookings([...bookings, newBooking]);
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de l’annulation de la réservation');
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error('Error cancelling booking:', err);
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
                  flights={flights} // Pass flights to SearchForm
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
                flights={flights} // Pass flights to SearchForm
              />
            }
          />
          <Route
            path="/reserver"
            element={<BookingForm onSubmit={handleBookingSubmit} />}
          />
          <Route
            path="/mes-reservations"
            element={
              <MyBookings bookings={bookings} onCancel={handleCancelBooking} />
            }
          />
          {/* routes pour l'inscription et la connexion */}
         
          <Route
            path="/inscription"
            element={
              <div className="mb-6">
                <Inscription />
              </div>
            }
          />
          <Route
            path="/connexion"
            element={
              <div className="mb-6">
                <Connexion />
              </div>
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
      </div>
    </Router>
  );
};

export default App;