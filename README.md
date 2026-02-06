# TP1 - Moteur de validation

Module de validation en JavaScript avec tests unitaires (TDD).

## Installation

```bash
npm install
```

## Scripts disponibles

```bash
npm test              # Lancer les tests
npm run test:coverage # Lancer les tests avec couverture
npm run jsdoc         # Générer la documentation
```

## Voir la documentation

```bash
start docs/index.html
```

## Voir le rapport de couverture

```bash
npm run test:coverage
start coverage/lcov-report/index.html
```

## Fonctions disponibles

- `validateAge(birthDate)` - Valide l'âge (>= 18 ans)
- `validatePostalCode(postalCode)` - Valide un code postal français (5 chiffres)
- `validateIdentity(name)` - Valide un nom/prénom (protection XSS)
- `validateEmail(email)` - Valide une adresse email
