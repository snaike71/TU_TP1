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

module.exports = { validateAge, validatePostalCode };
