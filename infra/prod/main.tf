terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_ami" "ubuntu_lts" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

resource "tls_private_key" "app" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key_pem" {
  filename        = "${path.root}/${var.key_name}.pem"
  file_permission = "0400"
  content         = tls_private_key.app.private_key_pem
}

resource "aws_key_pair" "app" {
  key_name_prefix = "${var.key_name}-"
  public_key      = tls_private_key.app.public_key_openssh
}

resource "aws_security_group" "app" {
  name_prefix = "tp1-app-"
  description = "SSH for Ansible; public HTTP frontend and API only"

  ingress {
    description = "SSH (administration)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_ssh_cidr]
  }

  ingress {
    description = "Frontend (nginx)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API FastAPI"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.ubuntu_lts.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.app.key_name
  vpc_security_group_ids = [aws_security_group.app.id]

  root_block_device {
    volume_size = var.root_volume_gb
    volume_type = "gp3"
  }

  tags = {
    Name = "tp1-app-zero-touch"
  }
}

output "public_ip" {
  description = "Public IPv4 of the application host"
  value       = aws_instance.app.public_ip
}

output "private_key_pem" {
  description = "Volatile SSH private key (sensitive)"
  value       = tls_private_key.app.private_key_pem
  sensitive   = true
}

output "private_key_path" {
  description = "Local path to PEM when running terraform locally"
  value       = abspath(local_file.private_key_pem.filename)
}

output "ssh_command" {
  description = "SSH example for debugging (not used in zero-touch path)"
  value       = "ssh -i ${local_file.private_key_pem.filename} ubuntu@${aws_instance.app.public_ip}"
}
