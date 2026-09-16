import { StyledEngineProvider } from '@mui/material';

import './styles/nuzzo-theme.css';
import './styles/navbar.css';
import './styles/auth.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
