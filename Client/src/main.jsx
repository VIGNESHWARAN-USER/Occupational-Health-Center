import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure the correct path to App.jsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
