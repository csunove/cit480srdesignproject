import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const Prototype = React.lazy(() => import('./prototype/Prototype'));
const showPrototype = /^\/prototype\/?$/.test(window.location.pathname);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {showPrototype ? (
      <React.Suspense fallback={<p role="status">Loading prototype…</p>}>
        <Prototype />
      </React.Suspense>
    ) : <App />}
  </React.StrictMode>,
);
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { void navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
