import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </ErrorBoundary>
    </AuthProvider>
  </StrictMode>
);