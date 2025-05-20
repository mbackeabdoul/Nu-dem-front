import React, { Component } from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    toast.error('Une erreur s’est produite. Veuillez réessayer.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Oups, une erreur s’est produite !</h2>
            <p className="text-gray-600 mb-4">Veuillez rafraîchir la page ou réessayer plus tard.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Rafraîchir
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;