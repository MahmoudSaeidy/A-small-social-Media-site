import { StrictMode } from 'react'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
      <React.Fragment>
      <CssBaseline />
          <StrictMode>
                <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
        >
            <BrowserRouter>
              <App />
            </BrowserRouter>
              </SnackbarProvider>
          </StrictMode>
    </React.Fragment>

)
