import { faker } from '@faker-js/faker/locale/fr';

describe('Inscription utilisateur - Parcours complet', () => {
    const generateValidUser = () => ({
        name: faker.person.lastName(),
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        postalCode: faker.helpers.fromRegExp(/[0-9]{5}/),
        city: faker.location.city()
    });

    beforeEach(() => {
        cy.visit('/');
    });

    it('doit afficher le formulaire d\'inscription', () => {
        cy.get('h1').should('contain', 'Formulaire d\'inscription');
        cy.get('form').should('exist');
        cy.get('#name').should('exist');
        cy.get('#firstName').should('exist');
        cy.get('#email').should('exist');
        cy.get('#birthDate').should('exist');
        cy.get('#postalCode').should('exist');
        cy.get('#city').should('exist');
        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('doit afficher des erreurs de validation pour des données invalides', () => {
        cy.get('#name').type('123Invalid').blur();
        cy.get('.error').should('contain', 'Nom invalide');

        cy.get('#email').type('not-an-email').blur();
        cy.get('.error').should('contain', 'Email invalide');

        cy.get('#postalCode').type('123').blur();
        cy.get('.error').should('contain', 'Code postal invalide');
    });

    it('doit compléter le parcours : arrivée -> remplissage -> validation -> succès', () => {
        const user = generateValidUser();
        const formattedDate = user.birthDate.toISOString().split('T')[0];

        cy.get('button[type="submit"]').should('be.disabled');

        cy.get('#name').type(user.name);
        cy.get('#firstName').type(user.firstName);
        cy.get('#email').type(user.email);
        cy.get('#birthDate').type(formattedDate);
        cy.get('#postalCode').type(user.postalCode);
        cy.get('#city').type(user.city);

        cy.get('.error').should('not.exist');

        cy.get('button[type="submit"]').should('not.be.disabled');

        cy.get('button[type="submit"]').click();

        cy.contains('succès', { matchCase: false }).should('be.visible');

        cy.get('#name').should('have.value', '');
        cy.get('#firstName').should('have.value', '');
        cy.get('#email').should('have.value', '');
        cy.get('#postalCode').should('have.value', '');
        cy.get('#city').should('have.value', '');

        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('doit sauvegarder les données dans le localStorage', () => {
        const user = generateValidUser();
        const formattedDate = user.birthDate.toISOString().split('T')[0];

        cy.get('#name').type(user.name);
        cy.get('#firstName').type(user.firstName);
        cy.get('#email').type(user.email);
        cy.get('#birthDate').type(formattedDate);
        cy.get('#postalCode').type(user.postalCode);
        cy.get('#city').type(user.city);
        cy.get('button[type="submit"]').click();

        cy.window().then((win) => {
            const stored = JSON.parse(win.localStorage.getItem('user'));
            expect(stored.name).to.equal(user.name);
            expect(stored.firstName).to.equal(user.firstName);
            expect(stored.email).to.equal(user.email);
            expect(stored.city).to.equal(user.city);
        });
    });

    it('doit rejeter un utilisateur mineur', () => {
        const minorDate = faker.date.birthdate({ min: 1, max: 17, mode: 'age' });
        const formattedDate = minorDate.toISOString().split('T')[0];

        cy.get('#name').type(faker.person.lastName());
        cy.get('#firstName').type(faker.person.firstName());
        cy.get('#email').type(faker.internet.email());
        cy.get('#birthDate').type(formattedDate).blur();
        cy.get('#postalCode').type(faker.helpers.fromRegExp(/[0-9]{5}/));
        cy.get('#city').type(faker.location.city());

        cy.get('.error').should('contain', 'mineur');
        cy.get('button[type="submit"]').should('be.disabled');
    });

    it('doit permettre de corriger les erreurs et soumettre', () => {
        const user = generateValidUser();
        const formattedDate = user.birthDate.toISOString().split('T')[0];

        cy.get('#name').type('123Bad').blur();
        cy.get('.error').should('contain', 'Nom invalide');

        cy.get('#name').clear().type(user.name).blur();
        cy.get('.error').should('not.exist');

        cy.get('#firstName').type(user.firstName);
        cy.get('#email').type(user.email);
        cy.get('#birthDate').type(formattedDate);
        cy.get('#postalCode').type(user.postalCode);
        cy.get('#city').type(user.city);

        cy.get('button[type="submit"]').should('not.be.disabled');
        cy.get('button[type="submit"]').click();
        cy.contains('succès', { matchCase: false }).should('be.visible');
    });
});
