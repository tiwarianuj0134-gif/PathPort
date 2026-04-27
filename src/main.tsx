import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import App from './App';
import theme from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { UiProvider } from './context/UiContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UiProvider>
          <App />
          <ToastContainer position="bottom-right" />
        </UiProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
