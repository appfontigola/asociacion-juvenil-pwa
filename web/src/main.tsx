import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BadgesProvider } from './contexts/BadgesContext';
import App from './App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/asociacion-juvenil-pwa/sw.js', {
        scope: '/asociacion-juvenil-pwa/',
        updateViaCache: 'none',
      })
      .then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage('SKIP_WAITING');
        }
        registration.update();
        setInterval(() => registration.update(), 60 * 60 * 1000);
      })
      .catch(() => {});
  });

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
}

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
