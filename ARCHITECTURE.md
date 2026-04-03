# Architecture — Zero Touch Registry & Application

## Vue d'ensemble

Deux EC2 distinctes sur AWS (eu-west-3) :

```
Internet
   │
   ├──► EC2 Registre (15.188.14.11)
   │         Port 443 (HTTPS)  ──► Nginx ──► registry:5000 (interne)
   │                            └──► ui:80    (interne)
   │
   └──► EC2 Application (IP générée par Terraform)
             Port 80   ──► Frontend (Vite)
             Port 8000 ──► API FastAPI
             (MySQL / Adminer : internes uniquement)
```

---

## EC2 Registre Docker (`registry/`)

| Composant | Rôle |
|-----------|------|
| Terraform (`registry/terraform/`) | Provision EC2 t3.micro, SG (22+443), clé SSH |
| Ansible (`registry/ansible/`) | Docker, Nginx SSL, htpasswd, stack Docker Compose |
| Nginx | Reverse proxy SSL — route `/v2/` → registry, `/` → UI |
| Certificat | Auto-signé (openssl, SAN = IP publique) |
| Auth | htpasswd (admin / voir .env.sample) |

**Ports ouverts :** 22 (SSH admin) + 443 (HTTPS public)
**Port 5000 :** fermé sur Internet, accessible uniquement en interne

---

## EC2 Application (`infra/`)

| Composant | Rôle |
|-----------|------|
| Terraform (`infra/prod/`) | Provision EC2 t3.micro, SG (22+80+8000), clé SSH volatile |
| Ansible (`ansible/`) | Docker CE, docker login registry, docker compose up |
| docker-compose.prod.yml | Stack complète (MySQL, API, Frontend, Adminer) |

**Ports ouverts :** 22 (SSH Ansible) + 80 (Frontend) + 8000 (API)
**MySQL / Adminer :** réseau interne uniquement

---

## Pipeline CI/CD (`/.github/workflows/deploy.yml`)

Déclenchement : **manuel** (`workflow_dispatch`)

```
1. Build & Push images ──► registry AWS (api, frontend, mysql)
2. Terraform apply     ──► nouvelle EC2 application
3. Bridge              ──► IP + clé SSH extraites → inventory.ini
4. Ansible playbook    ──► Docker + stack déployée
5. curl validation     ──► Frontend (port 80) + API (port 8000)
```

Tous les secrets passent par **GitHub Secrets** (voir `.env.sample`).

---

## Structure du dépôt

```
.
├── registry/           ← Registre Docker sécurisé (Terraform + Ansible)
│   ├── terraform/
│   └── ansible/
├── infra/
│   └── prod/           ← Infrastructure hôte applicatif (Terraform)
├── ansible/            ← Configuration hôte applicatif (Ansible)
├── .github/
│   └── workflows/
│       └── deploy.yml  ← Pipeline Zero Touch
├── docker-compose.prod.yml
├── .env.sample
├── rendu.txt
└── ARCHITECTURE.md
```
