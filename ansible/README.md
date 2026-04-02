# Phase 2 — Configuration Management (Ansible)

## Rôle de cette phase

Cette phase sert à partir d’un serveur Ubuntu neuf (celui créé par Terraform) et à tout installer dessus sans rien faire à la main sur la machine : Ansible se connecte en SSH, met Docker en place, récupère le compose de prod et lance les conteneurs. L’objectif c’est un déploiement reproductible, idéal pour la CI.

## Structure des fichiers

```
ansible/
├── ansible.cfg
├── requirements.yml
├── inventory.ini.example
├── playbook.yml
└── roles/
    └── docker/
        ├── tasks/
        │   └── main.yml
        └── vars/
            └── main.yml
```

## Ce que fait le playbook

1. Installation de Docker et ses dépendances sur le serveur Ubuntu  
2. Authentification sur le registry privé ghcr.io avec le token GitHub  
3. Transfert du fichier `docker-compose.prod.yml` vers le serveur dans `/app`  
4. Démarrage de la stack avec docker compose  

## Prérequis

- Le fichier `inventory.ini` doit être généré par la CI (tu peux t’inspirer de `inventory.ini.example` pour le format)  
- Le fichier `key.pem` doit être sur le runner avec les droits `600` (sinon SSH râle)  
- Les variables `ghcr_token` et `ghcr_user` doivent être passées en `--extra-vars` au lancement du playbook  
- La collection `community.docker` doit être installée avant, via `requirements.yml` (avec `ansible-galaxy`)  

## Commande d'exécution manuelle (pour tests)

Depuis la racine du repo :

```bash
ansible-galaxy collection install -r ansible/requirements.yml
ansible-playbook ansible/playbook.yml -i ansible/inventory.ini --extra-vars "ghcr_token=TON_TOKEN ghcr_user=TON_USERNAME"
```

(Remplace `TON_TOKEN` et `TON_USERNAME` par des vraies valeurs pour tester.)

## Variables attendues

| Variable | Fournie par | Description |
|----------|-------------|-------------|
| `ghcr_token` | GitHub Secrets | Token d’accès au registry privé ghcr.io |
| `ghcr_user` | GitHub Actions (`github.actor`) | Nom d’utilisateur GitHub |
| `SERVER_IP` | Sortie Terraform | IP publique de l’instance AWS (utilisée dans l’inventaire) |
