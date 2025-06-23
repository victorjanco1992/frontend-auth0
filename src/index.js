import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Auth0ProviderWithConfig from './auth/Auth0ProviderWithConfig'; //modificado
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0ProviderWithConfig>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0ProviderWithConfig>
  </React.StrictMode>
);

reportWebVitals();
