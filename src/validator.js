/**
 * @fileoverview Module de validation
 * @module validator
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Indique si la validation a réussi
 * @property {string} [error] - Code d'erreur si la validation a échoué
 */

/**
 * Valide l'âge à partir d'une date de naissance
 * @param {Date|string} birthDate - Date de naissance
 * @returns {ValidationResult} Résultat de la validation
 */
function validateAge(birthDate) {
    if (birthDate === null || birthDate === undefined) {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    if (typeof birthDate === 'object' && !(birthDate instanceof Date)) {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    const date = new Date(birthDate);

    if (isNaN(date.getTime())) {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (date > today) {
        return { valid: false, error: 'INVALID_DATE_FUTURE' };
    }

    today.setHours(0, 0, 0, 0);

    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    if (age < 18) {
        return { valid: false, error: 'AGE_UNDER_18' };
    }

    return { valid: true };
}

/**
 * Valide un code postal français
 * @param {string|number} postalCode - Code postal à valider
 * @returns {ValidationResult} Résultat de la validation
 */
function validatePostalCode(postalCode) {
    if (postalCode === null || postalCode === undefined) {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    if (typeof postalCode === 'object') {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    const codeStr = String(postalCode);
    const regex = /^\d{5}$/;

    if (!regex.test(codeStr)) {
        return { valid: false, error: 'INVALID_POSTAL_CODE_FORMAT' };
    }

    return { valid: true };
}

/**
 * Valide une identité (nom ou prénom)
 * @param {string} name - Nom ou prénom à valider
 * @returns {ValidationResult} Résultat de la validation
 */
function validateIdentity(name) {
    if (name === null || name === undefined) {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    if (typeof name !== 'string') {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    const xssPatterns = [
        /<[^>]*>/i,
        /javascript:/i,
        /on\w+\s*=/i
    ];

    for (const pattern of xssPatterns) {
        if (pattern.test(name)) {
            return { valid: false, error: 'XSS_DETECTED' };
        }
    }

    const validNameRegex = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'\-]*$/;

    if (!validNameRegex.test(name)) {
        return { valid: false, error: 'INVALID_IDENTITY_FORMAT' };
    }

    return { valid: true };
}

/**
 * Valide une adresse email
 * @param {string} email - Adresse email à valider
 * @returns {ValidationResult} Résultat de la validation
 */
function validateEmail(email) {
    if (email === null || email === undefined) {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    if (typeof email !== 'string') {
        return { valid: false, error: 'INVALID_INPUT' };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return { valid: false, error: 'INVALID_EMAIL_FORMAT' };
    }

    return { valid: true };
}

/**
 * Valide un utilisateur complet
 * @param {Object} user - Objet utilisateur
 * @param {Date|string} user.birthDate - Date de naissance
 * @param {string|number} user.postalCode - Code postal
 * @param {string} user.name - Nom
 * @param {string} user.firstName - Prénom
 * @param {string} user.email - Adresse email
 * @returns {boolean} true si toutes les validations passent, false sinon
 */
function validateUser(user) {
    if (!user || typeof user !== 'object') {
        return false;
    }

    const ageResult = validateAge(user.birthDate);
    if (!ageResult.valid) return false;

    const postalCodeResult = validatePostalCode(user.postalCode);
    if (!postalCodeResult.valid) return false;

    const nameResult = validateIdentity(user.name);
    if (!nameResult.valid) return false;

    const firstNameResult = validateIdentity(user.firstName);
    if (!firstNameResult.valid) return false;

    const emailResult = validateEmail(user.email);
    if (!emailResult.valid) return false;

    return true;
}

module.exports = { validateAge, validatePostalCode, validateIdentity, validateEmail, validateUser };
