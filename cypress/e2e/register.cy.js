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
        cy.intercept('GET', '**/users', []).as('getUsers');
        cy.intercept('POST', '**/users', { statusCode: 201, body: { id: 11 } }).as('createUser');
        cy.visit('/register');
    });

    it('doit afficher le formulaire d\'inscription', () => {
        cy.get('h1').should('contain', 'Formulaire');
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

        cy.wait('@createUser');
        cy.contains('succès', { matchCase: false }).should('be.visible');
    });

    it('doit appeler l\'API POST avec les bonnes données', () => {
        const user = generateValidUser();
        const formattedDate = user.birthDate.toISOString().split('T')[0];

        cy.get('#name').type(user.name);
        cy.get('#firstName').type(user.firstName);
        cy.get('#email').type(user.email);
        cy.get('#birthDate').type(formattedDate);
        cy.get('#postalCode').type(user.postalCode);
        cy.get('#city').type(user.city);
        cy.get('button[type="submit"]').click();

        cy.wait('@createUser').its('request.body').should('include', { name: user.name, email: user.email });
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

    it('doit afficher une erreur quand l\'email existe déjà (400)', () => {
        cy.intercept('POST', '**/users', {
            statusCode: 400,
            body: { message: 'Cet email est déjà utilisé' }
        }).as('createUserFail');

        const user = generateValidUser();
        const formattedDate = user.birthDate.toISOString().split('T')[0];

        cy.get('#name').type(user.name);
        cy.get('#firstName').type(user.firstName);
        cy.get('#email').type(user.email);
        cy.get('#birthDate').type(formattedDate);
        cy.get('#postalCode').type(user.postalCode);
        cy.get('#city').type(user.city);
        cy.get('button[type="submit"]').click();

        cy.wait('@createUserFail');
        cy.get('[data-testid="api-error"]').should('contain', 'email est déjà utilisé');
    });

    it('doit afficher une erreur quand le serveur crash (500)', () => {
        cy.intercept('POST', '**/users', { statusCode: 500, body: {} }).as('serverCrash');

        const user = generateValidUser();
        const formattedDate = user.birthDate.toISOString().split('T')[0];

        cy.get('#name').type(user.name);
        cy.get('#firstName').type(user.firstName);
        cy.get('#email').type(user.email);
        cy.get('#birthDate').type(formattedDate);
        cy.get('#postalCode').type(user.postalCode);
        cy.get('#city').type(user.city);
        cy.get('button[type="submit"]').click();

        cy.wait('@serverCrash');
        cy.get('[data-testid="api-error"]').should('contain', 'serveur');
        cy.get('#name').should('have.value', user.name);
    });
});
