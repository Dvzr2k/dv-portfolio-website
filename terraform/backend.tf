terraform {
  backend "gcs" {
    bucket = "dv-portfolio-website-tfstate"
    prefix = "terraform/state"
  }
}
