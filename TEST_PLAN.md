# Plan de Test - Moteur de Validation

## 1. Tests Unitaires (UT)

Les tests unitaires couvrent chaque fonction de validation de manière isolée.

### validateAge (`age.test.js`)
| Scénario | Type | Couvert |
|----------|------|---------|
| Personne de 25 ans | Cas nominal | UT |
| Exactement 18 ans aujourd'hui | Cas limite | UT |
| Date en format string ISO | Cas nominal | UT |
| Personne de 17 ans | Cas invalide | UT |
| 18 ans demain | Cas limite | UT |
| Nouveau-né | Cas invalide | UT |
| Né le 29 février | Cas limite | UT |
| null / undefined / objet vide | Erreur d'entrée | UT |
| Chaîne invalide | Erreur d'entrée | UT |
| Date dans le futur | Erreur d'entrée | UT |

### validatePostalCode (`postalCode.test.js`)
| Scénario | Type | Couvert |
|----------|------|---------|
| Code postal 5 chiffres (75001) | Cas nominal | UT |
| Code postal 00000 / 99999 | Cas limite | UT |
| Code postal en nombre | Cas nominal | UT |
| Moins de 5 chiffres | Cas invalide | UT |
| Plus de 5 chiffres | Cas invalide | UT |
| Contient des lettres | Cas invalide | UT |
| Caractères spéciaux / espaces | Cas invalide | UT |
| Chaîne vide | Cas limite | UT |
| null / undefined / objet / tableau | Erreur d'entrée | UT |

### validateIdentity (`identity.test.js`)
| Scénario | Type | Couvert |
|----------|------|---------|
| Nom simple (Dupont) | Cas nominal | UT |
| Nom avec accent (Bérénice) | Cas nominal | UT |
| Nom composé avec tiret (Jean-Pierre) | Cas nominal | UT |
| Nom avec apostrophe (O'Connor) | Cas nominal | UT |
| Nom avec espace (De La Fontaine) | Cas nominal | UT |
| Nom avec chiffres | Cas invalide | UT |
| Caractères spéciaux (@, _) | Cas invalide | UT |
| Chaîne vide | Cas limite | UT |
| Balise `<script>` | Sécurité XSS | UT |
| Balise `<img onerror>` | Sécurité XSS | UT |
| Balise HTML quelconque | Sécurité XSS | UT |
| Attribut onclick | Sécurité XSS | UT |
| javascript: | Sécurité XSS | UT |
| null / undefined / objet / nombre | Erreur d'entrée | UT |

### validateEmail (`email.test.js`)
| Scénario | Type | Couvert |
|----------|------|---------|
| Email simple (test@example.com) | Cas nominal | UT |
| Email avec sous-domaine | Cas nominal | UT |
| Email avec chiffres, point, tiret, underscore, plus | Cas nominal | UT |
| Domaine court (.fr) | Cas nominal | UT |
| Sans @ | Cas invalide | UT |
| Sans domaine / sans partie locale | Cas invalide | UT |
| Sans extension de domaine | Cas invalide | UT |
| Avec espaces / double @ | Cas invalide | UT |
| Chaîne vide | Cas limite | UT |
| Caractères spéciaux (`<script>`) | Cas invalide | UT |
| null / undefined / objet / nombre | Erreur d'entrée | UT |

### validateUser (`validateUser.test.js`)
| Scénario | Type | Couvert |
|----------|------|---------|
| Utilisateur complet valide | Cas nominal | UT |
| Utilisateur mineur | Cas invalide | UT |
| Code postal invalide | Cas invalide | UT |
| Nom / prénom invalide | Cas invalide | UT |
| Email invalide | Cas invalide | UT |
| null / undefined / chaîne | Erreur d'entrée | UT |

## 2. Tests d'Intégration (IT)

Les tests d'intégration vérifient le comportement du composant React `UserForm` avec le module `validator.js`.

### UserForm (`UserForm.test.jsx`)
| Scénario | Type | Couvert |
|----------|------|---------|
| Affichage de tous les champs | Rendu initial | IT |
| Bouton désactivé au départ | Sécurité UI | IT |
| Erreur si nom contient des chiffres | Feedback immédiat | IT |
| Erreur si prénom contient du HTML (XSS) | Feedback + Sécurité | IT |
| Erreur si email invalide | Feedback immédiat | IT |
| Erreur si code postal invalide | Feedback immédiat | IT |
| Erreur si utilisateur mineur | Feedback immédiat | IT |
| Suppression de l'erreur après correction | Feedback immédiat | IT |
| Bouton reste désactivé si champ invalide | Sécurité UI | IT |
| Bouton actif quand tout est valide | Sécurité UI | IT |
| Utilisateur chaotique (saisies invalides, corrections, re-saisies) | Scénario réel | IT |
| Sauvegarde localStorage avec bonnes données | Soumission + Spy | IT |
| Champs vidés après soumission | Soumission | IT |
| Message de succès (toaster) affiché | Soumission | IT |
| Bouton désactivé après soumission | Sécurité UI | IT |

## 3. Couverture

| Fichier | Statements | Branches | Functions | Lines |
|---------|-----------|----------|-----------|-------|
| validator.js | 100% | 100% | 100% | 100% |
| UserForm.jsx | 95.71% | 87.23% | 100% | 96.87% |

## 4. Outils utilisés

- **Jest** : framework de test
- **React Testing Library** : tests d'intégration DOM
- **userEvent** : simulation d'interactions utilisateur réalistes
- **jest.spyOn** : espionnage de `localStorage.setItem`
