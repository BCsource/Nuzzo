import { StyledEngineProvider } from '@mui/material';

import './styles/nuzzo-tokens.css';
import './styles/nuzzo-base.css';
import './styles/nuzzo-components.css';
import './styles/nuzzo-mui.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import App from './App.jsx';

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
