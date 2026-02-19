# TP1 - Moteur de validation

![Build Passing](https://github.com/snaike71/TU_TP1/actions/workflows/ci.yml/badge.svg)

Application multi-pages React avec formulaire d'inscription, validation, tests unitaires/intégration (Jest), tests E2E (Cypress) et pipeline CI/CD.

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

## Tests E2E Cypress

```bash
# Lancer le serveur puis les tests
npm run dev
npm run cypress:run
```

Scénarios couverts :
- `register.cy.js` : Inscription, validation, erreurs, données anonymisées (Faker.js)
- `navigation.cy.js` : Parcours multi-pages nominal + scénario d'erreur

## Pipeline CI/CD

Le workflow GitHub Actions exécute automatiquement :
1. **Installation** des dépendances
2. **Linting** (ESLint)
3. **Tests unitaires** (Jest) avec rapport de couverture
4. **Tests E2E** (Cypress)
5. **Déploiement** GitHub Pages (si tests verts)

## Voir la documentation

```bash
npm run jsdoc
xdg-open docs/index.html
```

## Voir le rapport de couverture

```bash
npm run test:coverage
xdg-open coverage/lcov-report/index.html
```
