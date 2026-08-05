export interface Project {
	slug: string;
	title: string;
	/* 'deployed' — live right now at a reachable URL. 'shipped' — built and
	   delivered, but not left running continuously (e.g. an EKS demo cluster,
	   torn down after recording to avoid ongoing cloud cost). */
	status: 'deployed' | 'shipped';
	tech: string[];
	github: string;
	description: { en: string; es: string };
	architecture: { en: string; es: string };
	/* optional — a live site or a demo recording. Omitted entirely for
	   projects with neither (e.g. this portfolio, before it has a public
	   domain to link to). */
	demo?: { url: string; label: { en: string; es: string } };
}

export const projects: Project[] = [
	{
		slug: 'agentic-petclinic-eks-platform',
		title: 'Agentic Petclinic EKS Platform',
		status: 'shipped',
		tech: ['Kubernetes', 'EKS', 'Terraform', 'ArgoCD', 'AWS'],
		github: 'https://github.com/Dvzr2k/agentic-petclinic-eks-platform',
		description: {
			en: 'Multi-service Spring Petclinic deployment on EKS — VPC, GitOps via ArgoCD, CI/CD with GitHub Actions, built with an agentic Claude Code workflow (hooks, review agents, safety guardrails).',
			es: 'Despliegue multi-servicio de Spring Petclinic en EKS — VPC, GitOps con ArgoCD, CI/CD con GitHub Actions, construido con un flujo de trabajo agéntico en Claude Code (hooks, agentes de revisión, barreras de seguridad).',
		},
		architecture: {
			en: '8 Spring Boot microservices (API Gateway, Config Server, Discovery, Admin, Customers, Visits, Vets, GenAI) running on EKS behind an ALB, with Route 53 and ACM handling DNS and TLS. RDS MySQL is shared across services in a single-AZ setup. ArgoCD watches the platform repo and syncs changes; GitHub Actions builds, scans, and pushes images to ECR. Prometheus, Grafana, Loki, and Zipkin cover metrics, logs, and traces. Dev and prod share this same shape — prod differs only in replica counts, HPA, and manual ArgoCD sync.',
			es: '8 microservicios de Spring Boot (API Gateway, Config Server, Discovery, Admin, Customers, Visits, Vets, GenAI) corriendo en EKS detrás de un ALB, con Route 53 y ACM gestionando el DNS y el TLS. RDS MySQL se comparte entre los servicios en una configuración de una sola zona de disponibilidad. ArgoCD observa el repositorio de la plataforma y sincroniza los cambios; GitHub Actions construye, escanea y publica las imágenes en ECR. Prometheus, Grafana, Loki y Zipkin cubren métricas, logs y trazas. Dev y prod comparten esta misma forma — prod se diferencia solo en el número de réplicas, HPA y la sincronización manual de ArgoCD.',
		},
		demo: {
			url: 'https://drive.google.com/file/d/108DxbGT0QErEHmow4BqM0hqDFBDXJ9KQ/view?usp=drive_link',
			label: { en: 'Watch the demo video', es: 'Ver el video demo' },
		},
	},
	{
		slug: 'my-react-app',
		title: 'Agentic React SPA',
		status: 'deployed',
		tech: ['React', 'Terraform', 'AWS S3', 'CloudFront'],
		github: 'https://github.com/Dvzr2k/my-react-app',
		description: {
			en: 'React SPA deployed to S3 + CloudFront, infrastructure fully defined in Terraform and generated/reviewed through a Claude Code agentic workflow.',
			es: 'SPA en React desplegada en S3 + CloudFront, con infraestructura definida completamente en Terraform, generada y revisada mediante un flujo de trabajo agéntico en Claude Code.',
		},
		architecture: {
			en: "A GitHub Actions workflow builds the app and pushes it straight to S3 on every push to main, authenticating to AWS via IAM OIDC — no long-lived access keys stored anywhere. CloudFront serves the built assets over HTTPS and gets its cache invalidated on each deploy. The Terraform, the OIDC role, and the CI workflow itself were all generated and reviewed through a Claude Code agentic workflow — infrastructure written by a dedicated agent, then checked by a security review pass before anything was applied.",
			es: 'Un workflow de GitHub Actions construye la app y la publica directamente en S3 en cada push a main, autenticándose en AWS mediante IAM OIDC — sin claves de acceso de larga duración almacenadas en ningún lado. CloudFront sirve los archivos generados por HTTPS y su caché se invalida en cada despliegue. El Terraform, el rol OIDC y el propio workflow de CI fueron generados y revisados mediante un flujo de trabajo agéntico con Claude Code — infraestructura escrita por un agente dedicado, revisada luego por una pasada de seguridad antes de aplicar cualquier cambio.',
		},
		demo: {
			url: 'https://d255xh9kackac4.cloudfront.net',
			label: { en: 'Visit live site', es: 'Ver sitio en vivo' },
		},
	},
	{
		slug: 'dv-portfolio-website',
		title: 'This portfolio',
		status: 'deployed',
		tech: ['Astro', 'TypeScript', 'GCP Cloud Run', 'Terraform'],
		github: 'https://github.com/Dvzr2k/dv-portfolio-website',
		description: {
			en: "You're looking at it — Astro app containerized and deployed to Cloud Run, DNS on Route 53, built end to end with Claude Code.",
			es: 'Lo estás viendo — app en Astro empaquetada en contenedor y desplegada en Cloud Run, DNS en Route 53, construida de principio a fin con Claude Code.',
		},
		architecture: {
			en: 'Built page by page with Astro and TypeScript, with English and Spanish as first-class routes rather than a bolted-on translation layer. Packaged into a container and deployed to Cloud Run, with DNS managed through Route 53. Every part of it, from the color system to this project page, was designed and implemented through an agentic Claude Code workflow — plan, build, review, repeat.',
			es: 'Construido página por página con Astro y TypeScript, con inglés y español como rutas de primera clase en lugar de una capa de traducción añadida después. Empaquetado en un contenedor y desplegado en Cloud Run, con el DNS gestionado a través de Route 53. Cada parte de este sitio, desde el sistema de color hasta esta misma página de proyecto, fue diseñada e implementada mediante un flujo de trabajo agéntico con Claude Code — planear, construir, revisar, repetir.',
		},
	},
];
