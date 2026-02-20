/**
 * @fileoverview Contexte React pour la gestion globale des utilisateurs inscrits via API.
 * @module UserContext
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUsers, createUser } from '../api/userApi';

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
 * @property {function(User): Promise<Object>} addUser - Enregistre un utilisateur via l'API
 * @property {function(): Promise<void>} fetchUsers - Recharge la liste depuis l'API
 * @property {boolean} loading - Indique si un chargement est en cours
 */

const UserContext = createContext(null);

/**
 * Provider du contexte utilisateur.
 * Charge les utilisateurs depuis l'API au montage et expose les fonctions CRUD.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.JSX.Element}
 */
function UserProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const addUser = async (userData) => {
        const created = await createUser(userData);
        setUsers(prev => [...prev, { ...userData, id: created.id }]);
        return created;
    };

    return (
        <UserContext.Provider value={{ users, addUser, fetchUsers, loading }}>
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
