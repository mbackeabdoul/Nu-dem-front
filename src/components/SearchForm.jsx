"use client"
import React from "react"
import { useState, useContext, useRef } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useLocation } from "react-router-dom"
import AsyncSelect from "react-select/async"
import axios from "axios"
import { toast } from "react-toastify"
import { AuthContext } from "../AuthContext"

const SearchForm = ({ searchForm, setSearchForm, onSubmit, flights }) => {
  const location = useLocation()
  const isSearchPage = location.pathname === "/recherche"
  const context = useContext(AuthContext)
  if (!context) {
    console.error("AuthContext is undefined in SearchForm")
    return null
  }
  const { setShowAuthModal } = context

  // Initialisation react-hook-form avec tripType et returnDate
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: searchForm,
  })
  const navigate = useNavigate()
  const [departure, setDeparture] = useState(null)
  const [arrival, setArrival] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const isUserInitiatedSearch = useRef(false)
  const [isSearching, setIsSearching] = useState(false)

  const tripType = watch("tripType", "oneway")

  // Chargement des villes pour AsyncSelect
  const loadCities = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return []
    try {
      const res = await axios.get(
        `https://nu-dem-back.onrender.com/api/cities?keyword=${encodeURIComponent(inputValue)}`,
      )
      const cities = res.data.map((city) => ({
        value: city.iataCode,
        label: `${city.name} (${city.iataCode})`,
        name: city.name,
      }))
      if (cities.length === 0 && isUserInitiatedSearch.current) {
        toast.warn(`Aucune ville trouvée pour "${inputValue}".`)
      }
      isUserInitiatedSearch.current = false
      return cities
    } catch (err) {
     
      isUserInitiatedSearch.current = false
      return []
    }
  }

  const handleExplicitSearch = (inputValue) => {
    isUserInitiatedSearch.current = true
    return loadCities(inputValue)
  }

  // Soumission du formulaire
  const submitHandler = async (data) => {
    setErrorMessage(null)
    if (!departure || !arrival) {
      setErrorMessage("Veuillez sélectionner une ville de départ et d'arrivée.")
      return
    }
    if (data.tripType === "roundtrip" && !data.returnDate) {
      setErrorMessage("Veuillez sélectionner une date de retour.")
      return
    }

    setIsSearching(true)
    const searchData = {
      departure: departure.value,
      departureName: departure.name,
      arrival: arrival.value,
      arrivalName: arrival.name,
      date: data.date,
      passengers: Number.parseInt(data.passengers),
      tripType: data.tripType,
      returnDate: data.tripType === "roundtrip" ? data.returnDate : undefined,
    }

    try {
      setSearchForm(searchData)
      await onSubmit(searchData)
    } catch (error) {
      console.error("Erreur lors de la recherche:", error)
      toast.error("Une erreur est survenue lors de la recherche.")
    } finally {
      setIsSearching(false)
    }
  }

  // Formatage date/heure/durée
  const formatTime = (dateTime) => {
    const date = new Date(dateTime)
    if (isNaN(date.getTime())) return "--:--"
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateTime) => {
    const date = new Date(dateTime)
    if (isNaN(date.getTime())) return "--"
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  const formatDuration = (duration) => {
    if (!duration) return "--"
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    const hours = match[1] ? Number.parseInt(match[1]) : 0
    const minutes = match[2] ? Number.parseInt(match[2]) : 0
    return `${hours}h${minutes.toString().padStart(2, "0")}`
  }

  // Réservation du vol
  const handleBookFlight = (flight) => {
    const isAuthenticated = context.auth?.isAuthenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      toast.error("Veuillez vous connecter pour réserver.")
      localStorage.setItem("pendingFlight", JSON.stringify(flight))
      return
    }
    localStorage.setItem("selectedFlight", JSON.stringify(flight))
    navigate("/reserver", { state: flight })
  }

  const validFlights = flights.filter((f) => f.id && f.departure && f.arrival)

  // Composant pour afficher un segment de vol
  const FlightSegment = ({ flight, isReturn = false }) => {
    const departureTime = isReturn ? flight.returnDepartureDateTime : flight.departureDateTime
    const arrivalTime = isReturn ? flight.returnArrivalDateTime : flight.arrivalDateTime
    const duration = isReturn ? flight.returnDuration : flight.duration
    const departureCode = isReturn ? flight.arrival : flight.departure
    const arrivalCode = isReturn ? flight.departure : flight.arrival
    
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">{formatTime(departureTime)}</div>
          <div className="text-sm text-gray-500">{formatDate(departureTime)}</div>
          <div className="text-sm font-medium text-gray-700">{departureCode}</div>
        </div>

        <div className="flex-1 px-4">
          <div className="relative">
            <div className="h-px bg-gray-300 w-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <i className={`fas fa-plane ${isReturn ? 'fa-flip-horizontal' : ''} text-blue-500`}></i>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-sm font-medium text-gray-600">{formatDuration(duration)}</div>
            <div className="text-xs text-gray-500">{isReturn ? 'Retour' : 'Aller'}</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">{formatTime(arrivalTime)}</div>
          <div className="text-sm text-gray-500">{formatDate(arrivalTime)}</div>
          <div className="text-sm font-medium text-gray-700">{arrivalCode}</div>
        </div>
      </div>
    )
  }

  return (
    <section id="search-form" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 ${isSearchPage ? "mt-8" : "-mt-32"} relative z-30`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Trouvez votre prochain vol</h2>
          {errorMessage && <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>}

          <form onSubmit={handleSubmit(submitHandler)}>
            {/* Type de voyage */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    {...register("tripType")}
                    value="oneway"
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Aller simple</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    {...register("tripType")}
                    value="roundtrip"
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Aller-retour</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Ville de départ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville de départ</label>
                <div className="flex items-center">
                  <i className="fas fa-plane-departure text-gray-400 mr-2"></i>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={handleExplicitSearch}
                    onChange={setDeparture}
                    value={departure}
                    placeholder="Dakar, Sénégal (DSS)"
                    classNamePrefix="react-select"
                    styles={{ container: (base) => ({ ...base, width: "100%", cursor: "pointer" }) }}
                  />
                </div>
              </div>

              {/* Ville d'arrivée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville d'arrivée</label>
                <div className="flex items-center">
                  <i className="fas fa-plane-arrival text-gray-400 mr-2"></i>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={handleExplicitSearch}
                    onChange={setArrival}
                    value={arrival}
                    placeholder="Paris, France (CDG)"
                    classNamePrefix="react-select"
                    styles={{ container: (base) => ({ ...base, width: "100%", cursor: "pointer" }) }}
                  />
                </div>
              </div>

              {/* Date de départ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
                <div className="relative">
                  <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="date"
                    {...register("date", { required: true })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer"
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">Date de départ requise</p>}
                </div>
              </div>

              {/* Date de retour */}
              {tripType === "roundtrip" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de retour</label>
                  <div className="relative">
                    <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="date"
                      {...register("returnDate", { required: true })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer"
                    />
                    {errors.returnDate && <p className="text-red-500 text-xs mt-1">Date de retour requise</p>}
                  </div>
                </div>
              )}

              {/* Passagers */}
              <div className={tripType === "oneway" ? "md:col-start-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de passagers</label>
                <div className="relative">
                  <i className="fas fa-users absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <select
                    {...register("passengers", { required: true })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n > 1 ? "passagers" : "passager"}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  {errors.passengers && <p className="text-red-500 text-xs mt-1">Nombre de passagers requis</p>}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Recherche en cours...
                  </>
                ) : (
                  <>
                    Rechercher <i className="fas fa-search ml-2"></i>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Affichage des résultats */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Résultats de la recherche</h3>
              {validFlights.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {validFlights.length} vol{validFlights.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {validFlights.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-plane text-gray-400 text-xl"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-1">Aucun vol trouvé</h4>
                <p className="text-gray-500 text-sm">Essayez d'autres critères de recherche</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                {validFlights.map((flight) => {
                  const isRoundTrip = flight.returnDepartureDateTime && flight.returnArrivalDateTime
                  
                  return (
                    <div
                      key={flight.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="fas fa-plane text-white text-sm"></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{flight.airline || "Compagnie inconnue"}</h4>
                            <p className="text-sm text-gray-500">
                              Vol {flight.flightNumber || "N/A"} 
                              {isRoundTrip && <span className="ml-2 text-blue-600">• Aller-retour</span>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {flight.price} {flight.currency || "EUR"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {isRoundTrip ? "total aller-retour" : "par personne"}
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Vol aller */}
                        <FlightSegment flight={flight} isReturn={false} />
                        
                        {/* Vol retour (si applicable) */}
                        {isRoundTrip && (
                          <>
                            <div className="border-t border-gray-200 my-4"></div>
                            <FlightSegment flight={flight} isReturn={true} />
                          </>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            {flight.isDirect && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <i className="fas fa-check-circle mr-1"></i>
                                Direct
                              </span>
                            )}
                            {isRoundTrip && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <i className="fas fa-exchange-alt mr-1"></i>
                                Aller-retour
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                flight.remainingSeats <= 5 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <i className="fas fa-chair mr-1"></i>
                              {flight.remainingSeats || "N/A"} places
                            </span>
                          </div>
                          <button
                            onClick={() => handleBookFlight(flight)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 cursor-pointer"
                          >
                            Sélectionner
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchForm