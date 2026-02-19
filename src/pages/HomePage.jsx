/**
 * @fileoverview Page d'accueil affichant le compteur et la liste des utilisateurs inscrits.
 * @module HomePage
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../context/UserContext';

/**
 * Page d'accueil de l'application.
 * Affiche un message de bienvenue, le nombre d'utilisateurs inscrits,
 * la liste des inscrits (Nom et Prénom), et un lien vers le formulaire.
 *
 * @component
 * @returns {React.JSX.Element}
 */
function HomePage() {
    const { users } = useUsers();

    return (
        <div className="home">
            <h1>Bienvenue</h1>
            <p data-testid="user-count">
                {users.length} utilisateur{users.length !== 1 ? 's' : ''} inscrit{users.length !== 1 ? 's' : ''}
            </p>

            {users.length > 0 && (
                <ul data-testid="user-list">
                    {users.map((user, index) => (
                        <li key={index}>
                            {user.name} {user.firstName}
                        </li>
                    ))}
                </ul>
            )}

            <Link to="/register" className="register-link">
                S'inscrire
            </Link>
        </div>
    );
}

export default HomePage;
