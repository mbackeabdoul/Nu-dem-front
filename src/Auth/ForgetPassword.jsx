"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const ForgetPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!email) {
      setError("Veuillez saisir votre adresse email.")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/mot-de-passe-oublie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erreur lors de la demande de réinitialisation.")

      setSuccess(true)
      toast.success("Instructions de réinitialisation envoyées à votre email.")
    } catch (err) {
      setError(err.message || "Erreur lors de la demande de réinitialisation.")
      toast.error(err.message || "Erreur lors de la demande de réinitialisation.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Récupération de mot de passe</h2>

      {success ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-medium mt-2">Email envoyé !</h3>
            <p className="text-gray-600 mt-1">
              Si un compte existe avec cette adresse email, vous recevrez un lien pour réinitialiser votre mot de passe.
            </p>
          </div>
          <button
            onClick={() => navigate("/connexion")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Retour à la connexion
          </button>
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">
              Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Votre adresse email"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-2 rounded-lg transition duration-200 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
            <div className="mt-4 text-center">
              <a href="/connexion" className="text-sm text-blue-600 hover:text-blue-800">
                Retour à la connexion
              </a>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default ForgetPassword
