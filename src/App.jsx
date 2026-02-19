/**
 * @fileoverview Point d'entrée principal de l'application React avec routage.
 * @module App
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

/**
 * Composant racine de l'application.
 * Définit les routes entre la page d'accueil et le formulaire d'inscription.
 *
 * @component
 * @returns {React.JSX.Element} L'application avec le routage
 */
function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </div>
    );
}

export default App;
