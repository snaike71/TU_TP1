const { validateAge } = require('./validator');

describe('validateAge', () => {
    const today = new Date();
    
    describe('cas valides (>= 18 ans)', () => {
        test('doit accepter une personne de 25 ans', () => {
            const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
        });

        test('doit accepter une personne qui a exactement 18 ans aujourd\'hui', () => {
            const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
        });

        test('doit accepter une date au format string ISO', () => {
            const birthDate = new Date(today.getFullYear() - 20, 5, 15).toISOString();
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
        });
    });

    describe('cas invalides (< 18 ans)', () => {
        test('doit rejeter une personne de 17 ans', () => {
            const birthDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
            const result = validateAge(birthDate);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('AGE_UNDER_18');
        });

        test('doit rejeter une personne qui aura 18 ans demain', () => {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const birthDate = new Date(today.getFullYear() - 18, tomorrow.getMonth(), tomorrow.getDate());
            const result = validateAge(birthDate);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('AGE_UNDER_18');
        });

        test('doit rejeter un nouveau-né', () => {
            const result = validateAge(today);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('AGE_UNDER_18');
        });
    });

    describe('cas limites - 29 février', () => {
        test('doit calculer correctement l\'âge pour une personne née le 29 février', () => {
            const birthDate = new Date(2000, 1, 29);
            const result = validateAge(birthDate);
            expect(result.valid).toBe(true);
        });
    });

    describe('cas d\'erreur - entrées invalides', () => {
        test('doit retourner une erreur pour null', () => {
            const result = validateAge(null);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour undefined', () => {
            const result = validateAge(undefined);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour un objet vide', () => {
            const result = validateAge({});
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour une chaîne invalide', () => {
            const result = validateAge('not-a-date');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour une date dans le futur', () => {
            const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
            const result = validateAge(futureDate);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_DATE_FUTURE');
        });
    });
});
