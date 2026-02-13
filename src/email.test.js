const { validateEmail } = require('./validator');

describe('validateEmail', () => {
    describe('cas valides', () => {
        test('doit accepter un email simple', () => {
            const result = validateEmail('test@example.com');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un email avec sous-domaine', () => {
            const result = validateEmail('test@mail.example.com');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un email avec chiffres', () => {
            const result = validateEmail('test123@example.com');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un email avec point dans la partie locale', () => {
            const result = validateEmail('jean.dupont@example.com');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un email avec tiret dans la partie locale', () => {
            const result = validateEmail('jean-dupont@example.com');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un email avec underscore', () => {
            const result = validateEmail('jean_dupont@example.com');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un email avec plus', () => {
            const result = validateEmail('jean+tag@example.com');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un email avec domaine court', () => {
            const result = validateEmail('test@example.fr');
            expect(result.valid).toBe(true);
        });
    });

    describe('cas invalides - format incorrect', () => {
        test('doit rejeter un email sans @', () => {
            const result = validateEmail('testexample.com');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });

        test('doit rejeter un email sans domaine', () => {
            const result = validateEmail('test@');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });

        test('doit rejeter un email sans partie locale', () => {
            const result = validateEmail('@example.com');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });

        test('doit rejeter un email sans extension de domaine', () => {
            const result = validateEmail('test@example');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });

        test('doit rejeter un email avec espaces', () => {
            const result = validateEmail('test @example.com');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });

        test('doit rejeter un email avec double @', () => {
            const result = validateEmail('test@@example.com');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });

        test('doit rejeter une chaîne vide', () => {
            const result = validateEmail('');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });

        test('doit rejeter un email avec caractères spéciaux interdits', () => {
            const result = validateEmail('test<script>@example.com');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_EMAIL_FORMAT');
        });
    });

    describe('cas d\'erreur - entrées invalides', () => {
        test('doit retourner une erreur pour null', () => {
            const result = validateEmail(null);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour undefined', () => {
            const result = validateEmail(undefined);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour un objet vide', () => {
            const result = validateEmail({});
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour un nombre', () => {
            const result = validateEmail(12345);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });
    });
});
