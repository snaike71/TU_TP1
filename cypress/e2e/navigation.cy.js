import { faker } from '@faker-js/faker/locale/fr';

describe('Navigation multi-pages', () => {
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
    });

    describe('Scénario Nominal', () => {
        it('doit inscrire un utilisateur et le voir sur l\'accueil', () => {
            cy.visit('/');
            cy.wait('@getUsers');

            cy.get('h1').should('contain', 'Bienvenue');
            cy.get('[data-testid="user-count"]').should('contain', '0 utilisateur');
            cy.get('[data-testid="user-list"]').should('not.exist');

            cy.get('.register-link').click();

            cy.url().should('include', '/register');
            cy.get('h1').should('contain', 'Formulaire');

            const user = generateValidUser();
            const formattedDate = user.birthDate.toISOString().split('T')[0];

            cy.get('#name').type(user.name);
            cy.get('#firstName').type(user.firstName);
            cy.get('#email').type(user.email);
            cy.get('#birthDate').type(formattedDate);
            cy.get('#postalCode').type(user.postalCode);
            cy.get('#city').type(user.city);

            cy.get('button[type="submit"]').should('not.be.disabled');
            cy.get('button[type="submit"]').click();

            cy.wait('@createUser');
            cy.contains('succès', { matchCase: false }).should('be.visible');

            cy.url().should('not.include', '/register');
            cy.get('[data-testid="user-count"]').should('contain', '1 utilisateur inscrit');
            cy.get('[data-testid="user-list"]').should('exist');
            cy.get('[data-testid="user-list"] li')
                .should('have.length', 1)
                .and('contain', user.name)
                .and('contain', user.firstName);
        });
    });

    describe('Scénario d\'Erreur', () => {
        it('ne doit pas ajouter un utilisateur invalide à la liste', () => {
            cy.visit('/');
            cy.wait('@getUsers');

            const validUser = generateValidUser();
            const formattedDate = validUser.birthDate.toISOString().split('T')[0];

            cy.get('.register-link').click();
            cy.get('#name').type(validUser.name);
            cy.get('#firstName').type(validUser.firstName);
            cy.get('#email').type(validUser.email);
            cy.get('#birthDate').type(formattedDate);
            cy.get('#postalCode').type(validUser.postalCode);
            cy.get('#city').type(validUser.city);
            cy.get('button[type="submit"]').click();
            cy.wait('@createUser');

            cy.get('[data-testid="user-count"]').should('contain', '1 utilisateur inscrit');

            cy.get('.register-link').click();
            cy.url().should('include', '/register');

            cy.get('#name').type('123Invalid').blur();
            cy.get('.error').should('exist');

            cy.get('#email').type('bad-email').blur();
            cy.get('.error').should('exist');

            cy.get('button[type="submit"]').should('be.disabled');

            cy.get('.back-link').click();

            cy.get('[data-testid="user-count"]').should('contain', '1 utilisateur inscrit');
            cy.get('[data-testid="user-list"] li').should('have.length', 1);
        });
    });
});
