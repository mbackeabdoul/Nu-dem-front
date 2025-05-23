"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

const ReinitialisationMotDePasse = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [formData, setFormData] = useState({
    motDePasse: "",
    confirmationMotDePasse: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [tokenValid, setTokenValid] = useState(true)

  useEffect(() => {
    // Vérifier la validité du token au chargement
    const verifierToken = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verifier-token/${token}`)
        const data = await res.json()

        if (!res.ok) {
          setTokenValid(false)
          setError(data.error || "Le lien de réinitialisation est invalide ou a expiré.")
        }
      } catch (err) {
        setTokenValid(false)
        setError(err.message || "Erreur lors de la vérification du lien de réinitialisation.")
      }
    }

    if (token) {
      verifierToken()
    } else {
      setTokenValid(false)
      setError("Token de réinitialisation manquant.")
    }
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Validation des champs
    if (!formData.motDePasse || !formData.confirmationMotDePasse) {
      setError("Veuillez remplir tous les champs.")
      setIsSubmitting(false)
      return
    }

    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      setError("Les mots de passe ne correspondent pas.")
      setIsSubmitting(false)
      return
    }

    if (formData.motDePasse.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reinitialiser-mot-de-passe/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motDePasse: formData.motDePasse }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erreur lors de la réinitialisation du mot de passe.")

      toast.success("Mot de passe réinitialisé avec succès !")
      navigate("/connexion")
    } catch (err) {
      setError(err.message || "Erreur lors de la réinitialisation du mot de passe.")
      toast.error(err.message || "Erreur lors de la réinitialisation du mot de passe.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold mt-4 mb-2">Lien invalide</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/forgetpassword")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Demander un nouveau lien
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Réinitialisation du mot de passe</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Nouveau mot de passe</label>
          <input
            type="password"
            name="motDePasse"
            value={formData.motDePasse}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Minimum 8 caractères"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmationMotDePasse"
            value={formData.confirmationMotDePasse}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Confirmez votre nouveau mot de passe"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg transition duration-200 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </div>
  )
}

export default ReinitialisationMotDePasse
