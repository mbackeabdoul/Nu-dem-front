import React, { useState, useEffect, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import toast from 'react-hot-toast';
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
    return <div>Erreur : Contexte d'authentification non disponible.</div>;
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
  
  // Refs pour éviter les toasts multiples
  const lastSearchRef = useRef('');
  const isSearchingRef = useRef(false);
  const bookingsLoadedRef = useRef(false);

  useEffect(() => {
    const fetchBookings = async () => {
      // Éviter de charger plusieurs fois
      if (bookingsLoadedRef.current) return;
      
      try {
        const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
        const res = await fetch('https://nu-dem-back.onrender.com/api/bookings', { headers });
        if (!res.ok) throw new Error('Erreur chargement réservations');
        const data = await res.json();
        setBookings(data);
        bookingsLoadedRef.current = true;
      } catch (err) {
        console.error('Erreur chargement réservations:', err.message);
        toast.error('Erreur lors du chargement des réservations', {
          id: 'bookings-error',
        });
      }
    };
    
    if (auth.isAuthenticated && !bookingsLoadedRef.current) {
      fetchBookings();
    } else if (!auth.isAuthenticated) {
      bookingsLoadedRef.current = false;
      setBookings([]);
    }
  }, [auth.isAuthenticated, auth.token]);

  const handleSearchSubmit = async (data) => {
    // Créer une clé unique pour cette recherche
    const searchKey = `${data.departure}-${data.arrival}-${data.date}-${data.passengers}`;
    
    // Éviter les recherches en double
    if (isSearchingRef.current || lastSearchRef.current === searchKey) {
      return;
    }
    
    isSearchingRef.current = true;
    lastSearchRef.current = searchKey;
    
    console.log('Recherche soumise:', data);
    setSearchForm(data);
    
    // Toast de chargement
    const loadingToast = toast.loading('Recherche en cours...', {
      id: 'search-loading',
    });
    
    const query = new URLSearchParams({
      departure: data.departure,
      arrival: data.arrival,
      date: data.date,
      passengers: data.passengers.toString(),
    }).toString();
    
    try {
      const res = await fetch(`https://nu-dem-back.onrender.com/api/flights?${query}`);
      
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
        
        toast.error(`Erreur de recherche : ${errorData.error || 'Veuillez réessayer.'}`, {
          id: 'search-loading',
        });
        throw new Error(errorData.error || `Erreur HTTP ${res.status}`);
      }
      
      const flightsData = await res.json();
      setFlights(flightsData);
      console.log('Vols trouvés:', flightsData);
      
      // Toast de succès
      if (flightsData.length > 0) {
        toast.success(`${flightsData.length} vol${flightsData.length > 1 ? 's' : ''} trouvé${flightsData.length > 1 ? 's' : ''} !`, {
          id: 'search-loading',
        });
      } else {
        toast('Aucun vol trouvé pour cette recherche', {
          icon: 'ℹ️',
          id: 'search-loading',
        });
      }
      
    } catch (err) {
      console.error('Erreur recherche vols:', {
        message: err.message,
        stack: err.stack,
      });
      
      toast.error('Erreur lors de la recherche. Vérifiez votre connexion.', {
        id: 'search-loading',
      });
      setFlights([]);
    } finally {
      isSearchingRef.current = false;
      // Réinitialiser après un délai pour permettre de nouvelles recherches
      setTimeout(() => {
        lastSearchRef.current = '';
      }, 2000);
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
    toast.success('Réservation effectuée avec succès !', {
      id: 'booking-success',
    });
  };

  const handleCancelBooking = async (id) => {
    const loadingToast = toast.loading('Annulation en cours...', {
      id: `cancel-${id}`,
    });
    
    try {
      const headers = auth.token ? { Authorization: `Bearer ${auth.token}` } : {};
      const res = await fetch(`https://nu-dem-back.onrender.com/api/bookings/${id}`, {
        method: 'DELETE',
        headers,
      });
      
      if (res.status === 401) {
        console.log('Token expiré, déconnexion');
        toast.error('Session expirée, veuillez vous reconnecter', {
          id: `cancel-${id}`,
        });
        setBookings([]);
        bookingsLoadedRef.current = false;
        return;
      }
      
      if (!res.ok) throw new Error('Erreur lors de l\'annulation de la réservation');
      
      setBookings(bookings.filter((booking) => booking._id !== id));
      toast.success('Réservation annulée avec succès', {
        id: `cancel-${id}`,
      });
      
    } catch (err) {
      console.error('Erreur annulation réservation:', err.message);
      toast.error('Erreur lors de l\'annulation', {
        id: `cancel-${id}`,
      });
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