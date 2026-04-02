# Registre Docker Sécurisé (HTTPS)

Architecture : EC2 t3.micro + Registry + UI + Nginx SSL  
Ports : **22** (SSH) + **443** (HTTPS) — port 5000 fermé sur Internet.

## 1. Terraform

```bash
cd aws/registry/terraform
terraform init
terraform apply
# Noter l'output public_ip
```

## 2. Ansible

Mettre l'IP dans `aws/registry/ansible/inventory.ini` :

```ini
registry-host ansible_host=<IP> ansible_user=ubuntu ansible_ssh_private_key_file=../terraform/registry-key-terraform.pem
```

```bash
chmod 400 aws/registry/terraform/registry-key-terraform.pem
cd aws/registry/ansible
ansible-playbook -i inventory.ini playbook.yml
```

## 3. Test client

Ajouter dans `/etc/docker/daemon.json` :

```json
{ "insecure-registries": ["<IP>:443"] }
```

Redémarrer Docker puis :

```bash
docker login <IP>:443
# User: admin  Password: admin123
docker pull alpine
docker tag alpine <IP>:443/alpine:test
docker push <IP>:443/alpine:test
```

UI : https://<IP> (accepter l'alerte certificat auto-signé).
