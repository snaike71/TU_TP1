# TP1 - Moteur de validation

![Build Passing](https://github.com/snaike71/TU_TP1/actions/workflows/ci.yml/badge.svg)

Module de validation en JavaScript avec tests unitaires (TDD), tests E2E (Cypress) et pipeline CI/CD.

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

## Pipeline CI/CD

Le workflow GitHub Actions exécute automatiquement :
1. **Installation** des dépendances
2. **Linting** (ESLint)
3. **Tests unitaires** (Jest) avec rapport de couverture
4. **Tests E2E** (Cypress)

Le pipeline échoue (rouge) si un seul test ne passe pas.

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
