import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from '../context/UserContext';
import UserForm from './UserForm';
import axios from 'axios';

jest.mock('axios');

async function renderWithProviders(ui) {
    axios.get.mockResolvedValue({ data: [] });
    let result;
    await waitFor(() => {
        result = render(
            <MemoryRouter>
                <UserProvider>
                    {ui}
                </UserProvider>
            </MemoryRouter>
        );
    });
    return result;
}

describe('UserForm - Tests d\'intégration', () => {
    let user;

    beforeEach(() => {
        user = userEvent.setup();
        localStorage.clear();
        jest.clearAllMocks();
        axios.get.mockResolvedValue({ data: [] });
    });

    describe('Rendu initial', () => {
        test('doit afficher tous les champs du formulaire', () => {
            renderWithProviders(<UserForm />);
            expect(screen.getByLabelText('Nom')).toBeInTheDocument();
            expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
            expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
            expect(screen.getByLabelText('Ville')).toBeInTheDocument();
        });

        test('le bouton de soumission doit être désactivé au départ', () => {
            renderWithProviders(<UserForm />);
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).toBeDisabled();
        });
    });

    describe('Feedback immédiat - erreurs de validation', () => {
        test('doit afficher une erreur si le nom contient des chiffres', async () => {
            renderWithProviders(<UserForm />);
            const nomInput = screen.getByLabelText('Nom');
            await user.type(nomInput, 'Dupont123');
            await user.tab();
            expect(screen.getByText(/nom invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si le prénom contient du HTML (XSS)', async () => {
            renderWithProviders(<UserForm />);
            const prenomInput = screen.getByLabelText('Prénom');
            await user.type(prenomInput, '<script>');
            await user.tab();
            expect(screen.getByText(/xss/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si l\'email est invalide', async () => {
            renderWithProviders(<UserForm />);
            const emailInput = screen.getByLabelText('Email');
            await user.type(emailInput, 'invalid-email');
            await user.tab();
            expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si le code postal est invalide', async () => {
            renderWithProviders(<UserForm />);
            const cpInput = screen.getByLabelText('Code postal');
            await user.type(cpInput, '123');
            await user.tab();
            expect(screen.getByText(/code postal invalide/i)).toBeInTheDocument();
        });

        test('doit afficher une erreur si l\'utilisateur est mineur', async () => {
            renderWithProviders(<UserForm />);
            const dateInput = screen.getByLabelText('Date de naissance');
            await user.type(dateInput, '2020-01-01');
            await user.tab();
            expect(screen.getByText(/mineur/i)).toBeInTheDocument();
        });

        test('doit supprimer l\'erreur quand la valeur devient valide', async () => {
            renderWithProviders(<UserForm />);
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

    describe('Feedback immédiat - ville', () => {
        test('doit garder le bouton désactivé si la ville est vide', async () => {
            renderWithProviders(<UserForm />);
            await user.type(screen.getByLabelText('Nom'), 'Dupont');
            await user.type(screen.getByLabelText('Prénom'), 'Jean');
            await user.type(screen.getByLabelText('Email'), 'jean@example.com');
            await user.type(screen.getByLabelText('Date de naissance'), '1990-05-15');
            await user.type(screen.getByLabelText('Code postal'), '75001');
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).toBeDisabled();
        });

        test('le bouton devient actif quand la ville est remplie', async () => {
            renderWithProviders(<UserForm />);
            await fillValidForm(user);
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).not.toBeDisabled();
        });

        test('doit revalider la ville quand on la vide après saisie', async () => {
            renderWithProviders(<UserForm />);
            const villeInput = screen.getByLabelText('Ville');
            await user.type(villeInput, 'Paris');
            await user.tab();
            await user.clear(villeInput);
            await user.type(villeInput, ' ');
            await user.tab();
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).toBeDisabled();
        });
    });

    describe('Sécurité UI - bouton désactivé/activé', () => {
        test('le bouton reste désactivé si un champ est invalide', async () => {
            renderWithProviders(<UserForm />);
            const nomInput = screen.getByLabelText('Nom');
            await user.type(nomInput, 'Dupont');
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).toBeDisabled();
        });

        test('le bouton devient actif quand tous les champs sont valides', async () => {
            renderWithProviders(<UserForm />);
            await fillValidForm(user);
            const button = screen.getByRole('button', { name: /soumettre/i });
            expect(button).not.toBeDisabled();
        });
    });

    describe('Scénario utilisateur chaotique', () => {
        test('saisies invalides, corrections, re-saisies', async () => {
            renderWithProviders(<UserForm />);

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

    describe('Soumission réussie - API 201', () => {
        test('doit appeler l\'API POST et afficher le succès', async () => {
            axios.post.mockResolvedValueOnce({ data: { id: 11 }, status: 201 });
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith(
                    'https://jsonplaceholder.typicode.com/users',
                    expect.objectContaining({
                        name: 'Dupont',
                        firstName: 'Jean',
                        email: 'jean@example.com'
                    })
                );
            });

            await waitFor(() => {
                expect(screen.getByText(/succès/i)).toBeInTheDocument();
            });
        });

        test('doit vider les champs après soumission réussie', async () => {
            axios.post.mockResolvedValueOnce({ data: { id: 11 }, status: 201 });
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByLabelText('Nom')).toHaveValue('');
            });
            expect(screen.getByLabelText('Prénom')).toHaveValue('');
            expect(screen.getByLabelText('Email')).toHaveValue('');
            expect(screen.getByLabelText('Code postal')).toHaveValue('');
            expect(screen.getByLabelText('Ville')).toHaveValue('');
        });

        test('le bouton doit redevenir désactivé après soumission', async () => {
            axios.post.mockResolvedValueOnce({ data: { id: 11 }, status: 201 });
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(button).toBeDisabled();
            });
        });
    });

    describe('Erreur métier - API 400 (email déjà utilisé)', () => {
        test('doit afficher le message d\'erreur du serveur', async () => {
            axios.post.mockRejectedValueOnce({
                response: {
                    status: 400,
                    data: { message: 'Cet email est déjà utilisé' }
                }
            });
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByTestId('api-error')).toHaveTextContent('Cet email est déjà utilisé');
            });
        });

        test('ne doit pas vider le formulaire après une erreur 400', async () => {
            axios.post.mockRejectedValueOnce({
                response: {
                    status: 400,
                    data: { message: 'Cet email est déjà utilisé' }
                }
            });
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByTestId('api-error')).toBeInTheDocument();
            });
            expect(screen.getByLabelText('Nom')).toHaveValue('Dupont');
            expect(screen.getByLabelText('Email')).toHaveValue('jean@example.com');
        });
    });

    describe('Crash serveur - API 500', () => {
        test('doit afficher un message d\'erreur serveur sans planter', async () => {
            axios.post.mockRejectedValueOnce({
                response: {
                    status: 500,
                    data: { message: 'Internal Server Error' }
                }
            });
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByTestId('api-error')).toHaveTextContent(/serveur.*indisponible/i);
            });

            expect(screen.getByLabelText('Nom')).toBeInTheDocument();
            expect(button).not.toBeDisabled();
        });

        test('l\'application ne doit pas planter après une erreur 500', async () => {
            axios.post.mockRejectedValueOnce({
                response: {
                    status: 500,
                    data: {}
                }
            });
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByTestId('api-error')).toBeInTheDocument();
            });

            expect(screen.getByLabelText('Nom')).toHaveValue('Dupont');
            expect(screen.getByLabelText('Prénom')).toHaveValue('Jean');
        });
    });

    describe('Erreur réseau (pas de connexion)', () => {
        test('doit afficher un message d\'erreur réseau', async () => {
            axios.post.mockRejectedValueOnce(new Error('Network Error'));
            renderWithProviders(<UserForm />);
            await fillValidForm(user);

            const button = screen.getByRole('button', { name: /soumettre/i });
            await user.click(button);

            await waitFor(() => {
                expect(screen.getByTestId('api-error')).toHaveTextContent(/connexion|serveur/i);
            });
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
