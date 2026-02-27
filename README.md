# TP1 - Moteur de validation

![Build Passing](https://github.com/snaike71/TU_TP1/actions/workflows/build_test_react.yml/badge.svg)

Application multi-pages React avec formulaire d'inscription, appels API (Axios/JSONPlaceholder), tests unitaires/intégration avec mocks (Jest), tests E2E (Cypress) et pipeline CI/CD.

## Installation

```bash
npm install
```

## Scripts disponibles

```bash
npm test                # Tests unitaires et d'intégration (Jest)
npm run test:coverage   # Tests avec rapport de couverture
npm run lint            # Linting ESLint
npm run cypress:open    # Tests E2E Cypress (interface graphique)
npm run cypress:run     # Tests E2E Cypress (headless)
npm run dev             # Serveur de développement Vite
npm run build           # Build de production
npm run jsdoc           # Génération de la documentation JSDoc
```

## Architecture

- **`/`** (Accueil) : Message de bienvenue, compteur d'inscrits, liste des utilisateurs
- **`/register`** (Inscription) : Formulaire avec validation en temps réel
- **État partagé** : React Context (`UserProvider`) pour le tableau des utilisateurs
- **API** : Axios vers JSONPlaceholder (`GET /users`, `POST /users`)

## Stratégie de Mocking

### Tests d'intégration (Jest)

Les appels réseau sont **isolés** via `jest.mock('axios')`. Aucun appel réel n'est effectué.

Scénarios couverts :
- **Succès (201)** : Inscription nominale, formulaire vidé, toast succès
- **Erreur métier (400)** : Email déjà utilisé → message d'erreur spécifique affiché
- **Crash serveur (500)** : Serveur indisponible → l'app ne plante pas, alerte utilisateur
- **Erreur réseau** : Pas de connexion → message d'erreur

### Tests E2E (Cypress)

Les routes API sont **bouchonnées** via `cy.intercept()` pour ne pas dépendre d'un backend réel.

Scénarios couverts :
- `register.cy.js` : Inscription, validation, erreurs 400/500, données anonymisées (Faker.js)
- `navigation.cy.js` : Parcours multi-pages nominal + scénario d'erreur

## Pipeline CI/CD

Le workflow GitHub Actions exécute automatiquement :
1. **Installation** des dépendances
2. **Linting** (ESLint)
3. **Tests unitaires** (Jest) avec rapport de couverture + upload Codecov
4. **Tests E2E** (Cypress) en mode headless
5. **Publication NPM** conditionnelle (skip si la version locale n'est pas strictement supérieure à la version NPM)
6. **Déploiement** app + documentation JSDoc sur GitHub Pages (si tests verts)

La publication NPM utilise le secret GitHub `NPM_TOKEN`.

## Package NPM

- **Package** : https://www.npmjs.com/package/@snaike7/tp-ynov
- **Build package** : `npm run build-npm-ci` (Linux/macOS CI) et `npm run build-npm` (Windows local)

## Documentation

La documentation JSDoc est générée et déployée automatiquement sur GitHub Pages :

- **Live** : https://snaike71.github.io/TU_TP1/docs/
- **Locale** : `npm run jsdoc` puis ouvrir `docs/index.html`

## Codecov

Le rapport de couverture est uploadé automatiquement sur [Codecov](https://codecov.io/) à chaque push.
Pour activer : ajouter le secret `CODECOV_TOKEN` dans les settings du repo GitHub.

Test bypass publish 02/27/2026 14:13:15
