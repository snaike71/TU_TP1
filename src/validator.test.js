const { validateAge, validatePostalCode, validateIdentity } = require('./validator');

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
