const { validatePostalCode } = require('./validator');

describe('validatePostalCode', () => {
    describe('cas valides', () => {
        test('doit accepter un code postal valide à 5 chiffres', () => {
            const result = validatePostalCode('75001');
            expect(result.valid).toBe(true);
        });

        test('doit accepter le code postal 00000', () => {
            const result = validatePostalCode('00000');
            expect(result.valid).toBe(true);
        });

        test('doit accepter le code postal 99999', () => {
            const result = validatePostalCode('99999');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un code postal en tant que nombre', () => {
            const result = validatePostalCode(75001);
            expect(result.valid).toBe(true);
        });
    });

    describe('cas invalides - format incorrect', () => {
        test('doit rejeter un code postal avec moins de 5 chiffres', () => {
            const result = validatePostalCode('7500');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_POSTAL_CODE_FORMAT');
        });

        test('doit rejeter un code postal avec plus de 5 chiffres', () => {
            const result = validatePostalCode('750001');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_POSTAL_CODE_FORMAT');
        });

        test('doit rejeter un code postal contenant des lettres', () => {
            const result = validatePostalCode('7500A');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_POSTAL_CODE_FORMAT');
        });

        test('doit rejeter un code postal contenant des caractères spéciaux', () => {
            const result = validatePostalCode('75-01');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_POSTAL_CODE_FORMAT');
        });

        test('doit rejeter un code postal avec des espaces', () => {
            const result = validatePostalCode('75 001');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_POSTAL_CODE_FORMAT');
        });

        test('doit rejeter une chaîne vide', () => {
            const result = validatePostalCode('');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_POSTAL_CODE_FORMAT');
        });
    });

    describe('cas d\'erreur - entrées invalides', () => {
        test('doit retourner une erreur pour null', () => {
            const result = validatePostalCode(null);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour undefined', () => {
            const result = validatePostalCode(undefined);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour un objet vide', () => {
            const result = validatePostalCode({});
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour un tableau', () => {
            const result = validatePostalCode(['75001']);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });
    });
});
