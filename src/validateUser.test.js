const { validateUser } = require('./validator');

describe('validateUser', () => {
    const today = new Date();
    const validUser = {
        birthDate: new Date(today.getFullYear() - 25, 5, 15),
        postalCode: '75001',
        name: 'Dupont',
        firstName: 'Jean',
        email: 'jean.dupont@example.com'
    };

    describe('cas valides', () => {
        test('doit retourner true pour un utilisateur valide', () => {
            expect(validateUser(validUser)).toBe(true);
        });

        test('doit retourner true avec un code postal en nombre', () => {
            expect(validateUser({ ...validUser, postalCode: 75001 })).toBe(true);
        });

        test('doit retourner true avec un nom composé', () => {
            expect(validateUser({ ...validUser, firstName: 'Jean-Pierre' })).toBe(true);
        });
    });

    describe('cas invalides - âge', () => {
        test('doit retourner false si mineur', () => {
            const user = { ...validUser, birthDate: new Date() };
            expect(validateUser(user)).toBe(false);
        });
    });

    describe('cas invalides - code postal', () => {
        test('doit retourner false si code postal invalide', () => {
            const user = { ...validUser, postalCode: '123' };
            expect(validateUser(user)).toBe(false);
        });
    });

    describe('cas invalides - nom', () => {
        test('doit retourner false si nom contient des chiffres', () => {
            const user = { ...validUser, name: 'Dupont123' };
            expect(validateUser(user)).toBe(false);
        });

        test('doit retourner false si nom contient du HTML', () => {
            const user = { ...validUser, name: '<script>' };
            expect(validateUser(user)).toBe(false);
        });
    });

    describe('cas invalides - prénom', () => {
        test('doit retourner false si prénom invalide', () => {
            const user = { ...validUser, firstName: '123' };
            expect(validateUser(user)).toBe(false);
        });
    });

    describe('cas invalides - email', () => {
        test('doit retourner false si email invalide', () => {
            const user = { ...validUser, email: 'invalid' };
            expect(validateUser(user)).toBe(false);
        });
    });

    describe('cas d\'erreur - entrées invalides', () => {
        test('doit retourner false pour null', () => {
            expect(validateUser(null)).toBe(false);
        });

        test('doit retourner false pour undefined', () => {
            expect(validateUser(undefined)).toBe(false);
        });

        test('doit retourner false pour une chaîne', () => {
            expect(validateUser('not an object')).toBe(false);
        });
    });
});
