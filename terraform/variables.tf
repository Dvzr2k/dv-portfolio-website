variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "dv-portfolio-website"
}

variable "region" {
  description = "GCP region for Cloud Run and Artifact Registry"
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
  default     = "dv-portfolio-website"
}

variable "github_repo" {
  description = "GitHub repo allowed to deploy via Workload Identity Federation, as owner/name"
  type        = string
  default     = "Dvzr2k/dv-portfolio-website"
}

variable "domain" {
  description = "Custom domain mapped to the Cloud Run service — must already be verified with Google (gcloud domains list-user-verified)"
  type        = string
  default     = "app-valdezr.link"
}
