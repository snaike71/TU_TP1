variable "aws_region" {
  description = "AWS region (TP: eu-west-3 Paris)"
  type        = string
  default     = "eu-west-3"
}

variable "instance_type" {
  description = "EC2 instance type (Free Tier friendly)"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Prefix for generated key pair name"
  type        = string
  default     = "tp1-app-key"
}

variable "admin_ssh_cidr" {
  description = "CIDR allowed to SSH (phase 2+ ; a restreindre en production)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "root_volume_gb" {
  description = "Root disk size (GiB)"
  type        = number
  default     = 20
}
