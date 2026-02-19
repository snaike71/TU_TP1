/**
 * @fileoverview Point de montage React - Initialise et rend l'application dans le DOM.
 * @module index
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import App from './App';

/** @type {import('react-dom/client').Root} */
const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename="/TU_TP1">
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>
);
