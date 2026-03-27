import { faker } from '@faker-js/faker/locale/fr';

describe('Fullstack E2E - Real API', () => {
    it('inscrit un utilisateur via API réelle', () => {
        const user = {
            name: faker.person.lastName(),
            firstName: faker.person.firstName(),
            email: faker.internet.email(),
            birthDate: '1995-06-15',
            postalCode: '75001',
            city: 'Paris'
        };

        cy.visit('/register');

        cy.get('#name').type(user.name);
        cy.get('#firstName').type(user.firstName);
        cy.get('#email').type(user.email);
        cy.get('#birthDate').type(user.birthDate);
        cy.get('#postalCode').type(user.postalCode);
        cy.get('#city').type(user.city);

        cy.get('button[type="submit"]').should('not.be.disabled').click();

        cy.contains('succès', { matchCase: false }).should('be.visible');
        cy.url().should('include', '/');
        cy.get('[data-testid="user-count"]').should('exist');
    });
});
