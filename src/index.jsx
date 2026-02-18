/**
 * @fileoverview Point de montage React - Initialise et rend l'application dans le DOM.
 * @module index
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/** @type {import('react-dom/client').Root} */
const root = createRoot(document.getElementById('root'));
root.render(<App />);
