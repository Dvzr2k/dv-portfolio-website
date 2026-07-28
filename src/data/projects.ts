export interface Project {
	slug: string;
	title: string;
	tech: string[];
	github: string;
	description: { en: string; es: string };
}

export const projects: Project[] = [
	{
		slug: 'agentic-petclinic-eks-platform',
		title: 'Agentic Petclinic EKS Platform',
		tech: ['Kubernetes', 'EKS', 'Terraform', 'ArgoCD', 'AWS'],
		github: 'https://github.com/Dvzr2k/agentic-petclinic-eks-platform',
		description: {
			en: 'Multi-service Spring Petclinic deployment on EKS — VPC, GitOps via ArgoCD, CI/CD with GitHub Actions, built with an agentic Claude Code workflow (hooks, review agents, safety guardrails).',
			es: 'Despliegue multi-servicio de Spring Petclinic en EKS — VPC, GitOps con ArgoCD, CI/CD con GitHub Actions, construido con un flujo de trabajo agéntico en Claude Code (hooks, agentes de revisión, barreras de seguridad).',
		},
	},
	{
		slug: 'my-react-app',
		title: 'my-react-app',
		tech: ['React', 'Terraform', 'AWS S3', 'CloudFront'],
		github: 'https://github.com/Dvzr2k/my-react-app',
		description: {
			en: 'React SPA deployed to S3 + CloudFront, infrastructure fully defined in Terraform and generated/reviewed through a Claude Code agentic workflow.',
			es: 'SPA en React desplegada en S3 + CloudFront, con infraestructura definida completamente en Terraform, generada y revisada mediante un flujo de trabajo agéntico en Claude Code.',
		},
	},
	{
		slug: 'dv-portfolio-website',
		title: 'This portfolio',
		tech: ['Astro', 'TypeScript', 'GCP Cloud Run', 'Terraform'],
		github: 'https://github.com/Dvzr2k/dv-portfolio-website',
		description: {
			en: "You're looking at it — Astro app containerized and deployed to Cloud Run, DNS on Route 53, built end to end with Claude Code.",
			es: 'Lo estás viendo — app en Astro empaquetada en contenedor y desplegada en Cloud Run, DNS en Route 53, construida de principio a fin con Claude Code.',
		},
	},
];
