import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UserForm from './UserForm';

describe('UserForm - Tests d\'intégration', () => {
    let user;

    beforeEach(() => {
        user = userEvent.setup();
        localStorage.clear();
        jest.restoreAllMocks();
    });

    describe('Rendu initial', () => {
        test('doit afficher tous les champs du formulaire', () => {
            render(<UserForm />);
            expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/date de naissance/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/code postal/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/ville/i)).toBeInTheDocument();
        });

        test('le bouton de soumission doit être désactivé au départ', () => {
            render(<UserForm />);
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).toBeDisabled();
        });
    });

    describe('Feedback immédiat - erreurs de validation', () => {
        test('doit afficher une erreur si le nom contient des chiffres', async () => {
            render(<UserForm />);
            const nomInput = screen.getByLabelText(/nom/i);
            await user.type(nomInput, 'Dupont123');
            await user.tab();
            expect(screen.getByText(/nom invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si le prénom contient du HTML (XSS)', async () => {
            render(<UserForm />);
            const prenomInput = screen.getByLabelText(/prénom/i);
            await user.type(prenomInput, '<script>');
            await user.tab();
            expect(screen.getByText(/xss/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si l\'email est invalide', async () => {
            render(<UserForm />);
            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'invalid-email');
            await user.tab();
            expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si le code postal est invalide', async () => {
            render(<UserForm />);
            const cpInput = screen.getByLabelText(/code postal/i);
            await user.type(cpInput, '123');
            await user.tab();
            expect(screen.getByText(/code postal invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si l\'utilisateur est mineur', async () => {
            render(<UserForm />);
            const dateInput = screen.getByLabelText(/date de naissance/i);
            await user.type(dateInput, '2020-01-01');
            await user.tab();
            expect(screen.getByText(/mineur/i)).toBeInTheDocument();
        });

        test('doit supprimer l\'erreur quand la valeur devient valide', async () => {
            render(<UserForm />);
            const nomInput = screen.getByLabelText(/nom/i);
            await user.type(nomInput, '123');
            await user.tab();
            expect(screen.getByText(/nom invalide/i)).toBeInTheDocument();
            await user.clear(nomInput);
            await user.type(nomInput, 'Dupont');
            await user.tab();
            expect(screen.queryByText(/nom invalide/i)).not.toBeInTheDocument();
        });
    });

    describe('Sécurité UI - bouton désactivé/activé', () => {
        test('le bouton reste désactivé si un champ est invalide', async () => {
            render(<UserForm />);
            const nomInput = screen.getByLabelText(/nom/i);
            await user.type(nomInput, 'Dupont');
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).toBeDisabled();
        });

        test('le bouton devient actif quand tous les champs sont valides', async () => {
            render(<UserForm />);
            await fillValidForm(user);
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).not.toBeDisabled();
        });
    });

    describe('Scénario utilisateur chaotique', () => {
        test('saisies invalides, corrections, re-saisies', async () => {
            render(<UserForm />);

            const nomInput = screen.getByLabelText(/nom/i);
            const prenomInput = screen.getByLabelText(/prénom/i);
            const emailInput = screen.getByLabelText(/email/i);

            await user.type(nomInput, '123Invalid');
            await user.tab();
            expect(screen.getByText(/nom invalide/i)).toBeInTheDocument();

            await user.clear(nomInput);
            await user.type(nomInput, 'Dupont');
            await user.tab();
            expect(screen.queryByText(/nom invalide/i)).not.toBeInTheDocument();

            await user.type(prenomInput, '<script>alert("xss")</script>');
            await user.tab();
            expect(screen.getByText(/xss/i)).toBeInTheDocument();

            await user.clear(prenomInput);
            await user.type(prenomInput, 'Jean');
            await user.tab();
            expect(screen.queryByText(/xss/i)).not.toBeInTheDocument();

            await user.type(emailInput, 'bad-email');
            await user.tab();
            expect(screen.getByText(/email invalide/i)).toBeInTheDocument();

            await user.clear(emailInput);
            await user.type(emailInput, 'jean@example.com');
            await user.tab();
            expect(screen.queryByText(/email invalide/i)).not.toBeInTheDocument();
        });
    });

    describe('Soumission réussie', () => {
        test('doit sauvegarder dans le localStorage avec les bonnes données', async () => {
            const spySetItem = jest.spyOn(Storage.prototype, 'setItem');
            render(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            expect(spySetItem).toHaveBeenCalledWith(
                'user',
                expect.stringContaining('Dupont')
            );
            expect(spySetItem).toHaveBeenCalledWith(
                'user',
                expect.stringContaining('Jean')
            );
            expect(spySetItem).toHaveBeenCalledWith(
                'user',
                expect.stringContaining('jean@example.com')
            );
        });

        test('doit vider les champs après soumission', async () => {
            render(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            expect(screen.getByLabelText(/nom/i)).toHaveValue('');
            expect(screen.getByLabelText(/prénom/i)).toHaveValue('');
            expect(screen.getByLabelText(/email/i)).toHaveValue('');
            expect(screen.getByLabelText(/code postal/i)).toHaveValue('');
            expect(screen.getByLabelText(/ville/i)).toHaveValue('');
        });

        test('doit afficher un message de succès (toaster)', async () => {
            render(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByText(/succès/i)).toBeInTheDocument();
            });
        });

        test('le bouton doit redevenir désactivé après soumission', async () => {
            render(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            expect(button).toBeDisabled();
        });
    });
});

async function fillValidForm(user) {
    await user.type(screen.getByLabelText(/nom/i), 'Dupont');
    await user.type(screen.getByLabelText(/prénom/i), 'Jean');
    await user.type(screen.getByLabelText(/email/i), 'jean@example.com');
    await user.type(screen.getByLabelText(/date de naissance/i), '1990-05-15');
    await user.type(screen.getByLabelText(/code postal/i), '75001');
    await user.type(screen.getByLabelText(/ville/i), 'Paris');
}
