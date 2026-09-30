import { strictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import './stylesheet.css'
import App from './FormValidationExample.jsx';

createRoot(document.getElementById('app')).render(
    <strictMode>
        <App />
    </strictMode>
);