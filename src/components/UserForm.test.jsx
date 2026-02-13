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
            expect(screen.getByLabelText('Nom')).toBeInTheDocument();
            expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
            expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
            expect(screen.getByLabelText('Ville')).toBeInTheDocument();
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
            const nomInput = screen.getByLabelText('Nom');
            await user.type(nomInput, 'Dupont123');
            await user.tab();
            expect(screen.getByText(/nom invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si le prénom contient du HTML (XSS)', async () => {
            render(<UserForm />);
            const prenomInput = screen.getByLabelText('Prénom');
            await user.type(prenomInput, '<script>');
            await user.tab();
            expect(screen.getByText(/xss/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si l\'email est invalide', async () => {
            render(<UserForm />);
            const emailInput = screen.getByLabelText('Email');
            await user.type(emailInput, 'invalid-email');
            await user.tab();
            expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si le code postal est invalide', async () => {
            render(<UserForm />);
            const cpInput = screen.getByLabelText('Code postal');
            await user.type(cpInput, '123');
            await user.tab();
            expect(screen.getByText(/code postal invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si l\'utilisateur est mineur', async () => {
            render(<UserForm />);
            const dateInput = screen.getByLabelText('Date de naissance');
            await user.type(dateInput, '2020-01-01');
            await user.tab();
            expect(screen.getByText(/mineur/i)).toBeInTheDocument();
        });

        test('doit supprimer l\'erreur quand la valeur devient valide', async () => {
            render(<UserForm />);
            const nomInput = screen.getByLabelText('Nom');
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
            const nomInput = screen.getByLabelText('Nom');
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

            const nomInput = screen.getByLabelText('Nom');
            const prenomInput = screen.getByLabelText('Prénom');
            const emailInput = screen.getByLabelText('Email');

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

            expect(screen.getByLabelText('Nom')).toHaveValue('');
            expect(screen.getByLabelText('Prénom')).toHaveValue('');
            expect(screen.getByLabelText('Email')).toHaveValue('');
            expect(screen.getByLabelText('Code postal')).toHaveValue('');
            expect(screen.getByLabelText('Ville')).toHaveValue('');
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
    await user.type(screen.getByLabelText('Nom'), 'Dupont');
    await user.type(screen.getByLabelText('Prénom'), 'Jean');
    await user.type(screen.getByLabelText('Email'), 'jean@example.com');
    await user.type(screen.getByLabelText('Date de naissance'), '1990-05-15');
    await user.type(screen.getByLabelText('Code postal'), '75001');
    await user.type(screen.getByLabelText('Ville'), 'Paris');
}
