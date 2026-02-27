/**
 * @fileoverview Composant formulaire d'inscription utilisateur avec validation et appels API.
 * @module UserForm
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateAge, validatePostalCode, validateIdentity, validateEmail } from '../validator';
import { useUsers } from '../context/UserContext';

/**
 * @constant {Object.<string, string>} ERROR_MESSAGES
 * @description Mapping des codes d'erreur de validation vers les messages utilisateur affichés dans le formulaire.
 */
const ERROR_MESSAGES = {
    INVALID_INPUT: 'Champ requis',
    AGE_UNDER_18: 'Vous devez être majeur (mineur détecté)',
    INVALID_DATE_FUTURE: 'La date ne peut pas être dans le futur',
    INVALID_DATE_TOO_OLD: 'La date de naissance est invalide',
    INVALID_POSTAL_CODE_FORMAT: 'Code postal invalide (5 chiffres attendus)',
    INVALID_IDENTITY_FORMAT: 'Nom invalide (lettres, accents et tirets uniquement)',
    XSS_DETECTED: 'Contenu XSS détecté',
    INVALID_EMAIL_FORMAT: 'Email invalide'
};

/**
 * Composant de formulaire d'inscription utilisateur.
 * Gère la saisie, la validation en temps réel et la soumission via API.
 * Gère les erreurs serveur (400, 500) avec feedback utilisateur.
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {function(Object): void} props.onSuccess - Callback obligatoire appelé après une inscription réussie.
 * @returns {React.JSX.Element} Le formulaire d'inscription avec validation intégrée
 */
function UserForm({ onSuccess }) {
    const { addUser } = useUsers();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        firstName: '',
        email: '',
        birthDate: '',
        postalCode: '',
        city: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);

    const validateField = useCallback((field, value) => {
        let result;
        switch (field) {
            case 'name':
            case 'firstName':
                result = validateIdentity(value);
                break;
            case 'email':
                result = validateEmail(value);
                break;
            case 'birthDate':
                result = validateAge(value);
                break;
            case 'postalCode':
                result = validatePostalCode(value);
                break;
            case 'city':
                if (!value || value.trim() === '') {
                    result = { valid: false, error: 'INVALID_INPUT' };
                } else {
                    result = { valid: true };
                }
                break;
        }
        return result;
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setApiError(null);

        setErrors(prev => {
            if (!prev[name] && !touched[name]) return prev;
            const result = validateField(name, value);
            const newErrors = { ...prev };
            if (result.valid) {
                delete newErrors[name];
            } else {
                newErrors[name] = ERROR_MESSAGES[result.error] || result.error;
            }
            return newErrors;
        });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        if (value && value.trim() !== '') {
            const result = validateField(name, value);
            setErrors(prev => {
                const newErrors = { ...prev };
                if (result.valid) {
                    delete newErrors[name];
                } else {
                    newErrors[name] = ERROR_MESSAGES[result.error] || result.error;
                }
                return newErrors;
            });
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const isFormValid = () => {
        const fields = ['name', 'firstName', 'email', 'birthDate', 'postalCode', 'city'];
        for (const field of fields) {
            const result = validateField(field, formData[field]);
            if (!result.valid) return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid() || submitting) return;

        setSubmitting(true);
        setApiError(null);

        try {
            await addUser(formData);
            onSuccess(formData);
            toast.success('Inscription réussie avec succès !');
            setFormData({ name: '', firstName: '', email: '', birthDate: '', postalCode: '', city: '' });
            setErrors({});
            setTouched({});

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    const message = error.response.data?.message || 'Cet email est déjà utilisé';
                    setApiError(message);
                    toast.error(message);
                } else if (status >= 500) {
                    setApiError('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
                    toast.error('Erreur serveur. Veuillez réessayer plus tard.');
                } else {
                    setApiError('Une erreur est survenue');
                    toast.error('Une erreur est survenue');
                }
            } else {
                setApiError('Impossible de contacter le serveur. Vérifiez votre connexion.');
                toast.error('Erreur réseau. Vérifiez votre connexion.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {apiError && (
                <div className="api-error" role="alert" data-testid="api-error">
                    {apiError}
                </div>
            )}

            <div>
                <label htmlFor="name">Nom</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.name && <span className="error" role="alert">{errors.name}</span>}
            </div>

            <div>
                <label htmlFor="firstName">Prénom</label>
                <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.firstName && <span className="error" role="alert">{errors.firstName}</span>}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.email && <span className="error" role="alert">{errors.email}</span>}
            </div>

            <div>
                <label htmlFor="birthDate">Date de naissance</label>
                <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.birthDate && <span className="error" role="alert">{errors.birthDate}</span>}
            </div>

            <div>
                <label htmlFor="postalCode">Code postal</label>
                <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.postalCode && <span className="error" role="alert">{errors.postalCode}</span>}
            </div>

            <div>
                <label htmlFor="city">Ville</label>
                <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.city && <span className="error" role="alert">{errors.city}</span>}
            </div>

            <button type="submit" disabled={!isFormValid() || submitting}>
                {submitting ? 'Envoi en cours...' : 'Soumettre'}
            </button>

            <ToastContainer />
        </form>
    );
}

export default UserForm;
