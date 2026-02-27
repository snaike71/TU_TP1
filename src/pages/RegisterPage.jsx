/**
 * @fileoverview Page d'inscription contenant le formulaire utilisateur.
 * @module RegisterPage
 */

import React from 'react';
import { Link } from 'react-router-dom';
import UserForm from '../components/UserForm';

/**
 * Page du formulaire d'inscription.
 * Contient le formulaire et un lien de retour vers l'accueil.
 *
 * @component
 * @returns {React.JSX.Element}
 */
function RegisterPage() {
    const handleRegisterSuccess = () => {};

    return (
        <div>
            <h1>Formulaire d'inscription</h1>
            <UserForm onSuccess={handleRegisterSuccess} />
            <Link to="/" className="back-link">Retour à l'accueil</Link>
        </div>
    );
}

export default RegisterPage;
