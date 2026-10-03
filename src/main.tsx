import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { DemoProvider } from './app/DemoContext';
import { StudioProvider } from './app/StudioContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DemoProvider>
        <StudioProvider>
          <App />
        </StudioProvider>
      </DemoProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
