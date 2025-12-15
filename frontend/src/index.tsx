import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill storage to prevent SecurityError in restricted environments (e.g. sandboxed iframes)
try {
  const x = window.localStorage;
  const y = window.sessionStorage;
} catch (e) {
  const noopStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: noopStorage });
    Object.defineProperty(window, 'sessionStorage', { value: noopStorage });
  } catch (err) {
    console.warn('Failed to polyfill storage', err);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);