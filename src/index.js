import React from 'react';
import ReactDOM from 'react-dom/client'; // Importar o ReactDOM do pacote 'react-dom/client'
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Crie um root
root.render(<App />); // Renderize o aplicativo
