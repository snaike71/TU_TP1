const { validateIdentity } = require('./validator');

describe('validateIdentity', () => {
    describe('cas valides', () => {
        test('doit accepter un nom simple', () => {
            const result = validateIdentity('Dupont');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un prénom simple', () => {
            const result = validateIdentity('Jean');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un nom avec accent', () => {
            const result = validateIdentity('Bérénice');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un nom avec tiret', () => {
            const result = validateIdentity('Jean-Pierre');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un nom composé avec accents et tirets', () => {
            const result = validateIdentity('Marie-Hélène');
            expect(result.valid).toBe(true);
        });

        test('doit accepter un nom avec apostrophe', () => {
            const result = validateIdentity("O'Connor");
            expect(result.valid).toBe(true);
        });

        test('doit accepter un nom avec espace', () => {
            const result = validateIdentity('De La Fontaine');
            expect(result.valid).toBe(true);
        });

        test('doit accepter des lettres majuscules et minuscules', () => {
            const result = validateIdentity('McDonald');
            expect(result.valid).toBe(true);
        });
    });

    describe('cas invalides - caractères interdits', () => {
        test('doit rejeter un nom contenant des chiffres', () => {
            const result = validateIdentity('Jean123');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_IDENTITY_FORMAT');
        });

        test('doit rejeter un nom contenant des caractères spéciaux', () => {
            const result = validateIdentity('Jean@Dupont');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_IDENTITY_FORMAT');
        });

        test('doit rejeter un nom contenant un underscore', () => {
            const result = validateIdentity('Jean_Pierre');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_IDENTITY_FORMAT');
        });

        test('doit rejeter une chaîne vide', () => {
            const result = validateIdentity('');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_IDENTITY_FORMAT');
        });
    });

    describe('sécurité XSS', () => {
        test('doit rejeter une balise script', () => {
            const result = validateIdentity('<script>alert("xss")</script>');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('XSS_DETECTED');
        });

        test('doit rejeter une balise HTML img avec onerror', () => {
            const result = validateIdentity('<img src="x" onerror="alert(1)">');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('XSS_DETECTED');
        });

        test('doit rejeter une balise HTML quelconque', () => {
            const result = validateIdentity('<div>Jean</div>');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('XSS_DETECTED');
        });

        test('doit rejeter un attribut onclick', () => {
            const result = validateIdentity('Jean onclick="alert(1)"');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('XSS_DETECTED');
        });

        test('doit rejeter javascript:', () => {
            const result = validateIdentity('javascript:alert(1)');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('XSS_DETECTED');
        });
    });

    describe('cas d\'erreur - entrées invalides', () => {
        test('doit retourner une erreur pour null', () => {
            const result = validateIdentity(null);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour undefined', () => {
            const result = validateIdentity(undefined);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour un objet vide', () => {
            const result = validateIdentity({});
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });

        test('doit retourner une erreur pour un nombre', () => {
            const result = validateIdentity(12345);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('INVALID_INPUT');
        });
    });
});
