import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BadgesProvider } from './contexts/BadgesContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/asociacion-juvenil-pwa">
      <AuthProvider>
        <BadgesProvider>
          <App />
        </BadgesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/asociacion-juvenil-pwa/sw.js', { scope: '/asociacion-juvenil-pwa/' })
      .catch(() => {});
  });
}
