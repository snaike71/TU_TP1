/**
 * @fileoverview Point d'entrée principal de l'application React.
 * @module App
 */

import React from 'react';
import UserForm from './components/UserForm';
import './App.css';

/**
 * Composant racine de l'application.
 * Affiche le titre et le formulaire d'inscription utilisateur.
 *
 * @component
 * @returns {React.JSX.Element} L'application avec le formulaire d'inscription
 */
function App() {
    return (
        <div className="app">
            <h1>Formulaire d'inscription</h1>
            <UserForm />
        </div>
    );
}

export default App;
