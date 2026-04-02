# Déploiements AWS (même dépôt que l’app)

Deux briques distinctes sur AWS :

| Dossier | Rôle |
|---------|------|
| **`aws/registry/`** | Registre Docker **sécurisé** (HTTPS via Nginx, port **443** uniquement côté client ; **5000 fermé** sur Internet) — TP *Automatisation registre sécurisé*. |
| **`infra/prod/`** | Hôte pour la **stack applicative** (projet final, phase 1 Terraform — front 80 / API 8001). |

En production d’équipe : une EC2 peut servir de **registry** (`aws/registry`), une autre de **app** (`infra/prod`), ou le registry peut rester sur GHCR selon le choix du binôme.

Voir `aws/registry/README.md` pour le détail du registre HTTPS.
