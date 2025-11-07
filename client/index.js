import React from 'react';
import { createRoot } from 'react-dom/client'; // Import modern root creation utility
import App from './App.js'; // Import the main App component
import './App.css';

const container = document.getElementById('root');


const root = createRoot(container);

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

