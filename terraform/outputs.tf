output "cloud_run_url" {
  description = "The live URL of the deployed Cloud Run service"
  value       = google_cloud_run_v2_service.site.uri
}

output "artifact_registry_repo" {
  description = "Full path of the Artifact Registry Docker repo, for use in image tags"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.images.repository_id}"
}

output "workload_identity_provider" {
  description = "Full resource name of the WIF provider — goes in the GitHub Actions workflow"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "deployer_service_account" {
  description = "Email of the service account GitHub Actions impersonates to deploy"
  value       = google_service_account.deployer.email
}
