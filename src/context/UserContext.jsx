/**
 * @fileoverview Contexte React pour la gestion globale des utilisateurs inscrits.
 * @module UserContext
 */

import React, { createContext, useContext, useState } from 'react';

/**
 * @typedef {Object} User
 * @property {string} name - Nom de l'utilisateur
 * @property {string} firstName - Prénom de l'utilisateur
 * @property {string} email - Email de l'utilisateur
 * @property {string} birthDate - Date de naissance
 * @property {string} postalCode - Code postal
 * @property {string} city - Ville
 */

/**
 * @typedef {Object} UserContextValue
 * @property {User[]} users - Tableau des utilisateurs inscrits
 * @property {function(User): void} addUser - Ajoute un utilisateur au tableau
 */

const UserContext = createContext(null);

/**
 * Provider du contexte utilisateur.
 * Stocke le tableau des utilisateurs inscrits et expose une fonction d'ajout.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.JSX.Element}
 */
function UserProvider({ children }) {
    const [users, setUsers] = useState([]);

    const addUser = (user) => {
        setUsers(prev => [...prev, user]);
    };

    return (
        <UserContext.Provider value={{ users, addUser }}>
            {children}
        </UserContext.Provider>
    );
}

/**
 * Hook personnalisé pour accéder au contexte utilisateur.
 *
 * @returns {UserContextValue}
 */
function useUsers() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers doit être utilisé dans un UserProvider');
    }
    return context;
}

export { UserProvider, useUsers, UserContext };
