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
	/* raw mermaid source, copied verbatim from the project's own GitHub
	   README — same diagram a visitor would see there, rendered client-side
	   to match this site's dark theme instead of GitHub's default styling */
	diagram?: string;
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
		diagram: `flowchart TD
    CLIENT["Client (Browser)"]
    R53["Route 53<br/>petclinic.app-valdezr.link"]
    ACM["ACM — TLS cert"]
    ALB["ALB — Ingress<br/>public subnet"]

    subgraph ACCOUNT["AWS Account · eu-central-1"]
        subgraph VPC["VPC 10.0.0.0/16 — public subnets only, no NAT"]
            subgraph EKS["EKS Cluster — petclinic-{env}"]
                APIGW["API Gateway :8080"]
                CFG["Config Server :8888"]
                DISC["Discovery Server :8761"]
                ADMIN["Admin Server :9090"]
                CUST["Customers Svc :8081"]
                VIS["Visits Svc :8082"]
                VETS["Vets Svc :8083"]
                GENAI["GenAI Svc :8084"]
                ARGOCD["ArgoCD"]
                OBS["Prometheus · Grafana · Loki · Zipkin"]
            end
            RDS["RDS MySQL<br/>shared · single-AZ"]
        end
        ECR["ECR — image registry"]
        SECRETS["Secrets Manager"]
    end

    GHREPO["GitHub — platform repo"]
    GHA["GitHub Actions<br/>build → scan → push"]

    CLIENT --> R53 --> ALB
    ACM -.-> ALB
    ALB --> APIGW
    CFG --> DISC
    APIGW --> CUST
    APIGW --> VIS
    APIGW --> VETS
    APIGW --> GENAI
    CUST --> RDS
    VIS --> RDS
    VETS -->|SQL| RDS
    ECR -.->|image pull| EKS
    SECRETS -.->|secret sync| EKS
    GHA -.->|push image| ECR
    GHREPO -.->|watches & syncs| ARGOCD`,
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
		diagram: `flowchart TD
    DEV["👨‍💻 Developer\\n(local)"]
    GH["🐙 GitHub\\npush to main"]
    GHA["⚙️ GitHub Actions\\nnpm ci + npm run build\\nOIDC → AWS auth"]
    OIDC["🔑 IAM OIDC Role\\nno stored keys"]

    subgraph CLAUDE ["🤖 Claude Code — AI Orchestration"]
        direction TB
        TFW["tf-writer\\nTerraform gen"]
        SEC["security-auditor\\nTF audit · Sonnet"]
        COST["cost-optimizer\\nHaiku"]
        DRIFT["drift-detector\\nHaiku"]
        HOOKS["🛡️ Safety Hooks\\nUserPromptSubmit · PreToolUse · PostToolUse"]
        SKILLS["Skills: /deploy · /tf-plan · /tf-apply · /infra-audit"]
    end

    TF["🏗️ Terraform\\nIaC Provisioning"]

    subgraph AWS ["☁️ AWS Infrastructure"]
        S3["🪣 S3 Bucket\\nStatic hosting · OAC"]
        CF["☁️ CloudFront\\nCDN · Cache invalidation"]
        TFSTATE["🔒 TF State\\nS3 backend\\n(DynamoDB lock optional)"]
    end

    USER["🌐 End User\\nReact SPA"]

    DEV -->|git push| GH
    GH -->|trigger workflow| GHA
    GHA -->|assume role| OIDC
    GHA -->|sync build/| S3
    GHA -->|invalidate cache| CF
    DEV -.->|invoke skills| CLAUDE
    CLAUDE --> TF
    TF -->|provision| S3
    TF -->|provision| CF
    TF -->|provision| OIDC
    TF -->|manage| TFSTATE
    CF -->|serve static assets| USER

    style CLAUDE fill:#1c1c2e,stroke:#d2a8ff,color:#d2a8ff
    style AWS fill:#1a1f2e,stroke:#e3b341,color:#e3b341`,
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
		diagram: `flowchart TD
    DEV["👨‍💻 Developer (local)\\nAstro app"]
    GH["🐙 GitHub repo\\npush to main"]
    GHA["⚙️ GitHub Actions\\nbuild Astro → build Docker image → push"]

    subgraph CLAUDE ["🤖 Claude Code — Agentic Workflow"]
        direction TB
        TFW["tf-writer\\nTerraform gen"]
        SEC["security-reviewer"]
        HOOKS["🛡️ Safety Hooks\\nblock-destroy · block-secret-commit"]
        SKILLS["Skills: /plan · /apply · /deploy · /audit"]
    end

    subgraph GCP ["☁️ GCP — Cloud Run (free tier)"]
        AR["📦 Artifact Registry\\ncontainer image"]
        CR["🚀 Cloud Run\\nscale-to-zero, min-instances 0\\nno Load Balancer"]
        DM["🔐 Domain Mapping\\nfree Google-managed TLS cert"]
    end

    R53["🌐 AWS Route 53\\nDNS for the existing domain"]
    USER["🌍 End user — browser"]

    DEV -->|git push| GH
    GH -->|trigger workflow| GHA
    GHA -->|push image| AR
    AR -->|pull image| CR
    GHA -->|deploy new revision| CR
    CR --> DM
    DEV -.->|invoke skills/agents| CLAUDE
    CLAUDE -.->|generates/reviews| GHA

    USER -->|HTTPS request| R53
    R53 -->|DNS record| DM
    DM --> CR
    CR -->|response| USER

    style CLAUDE fill:#1c1c2e,stroke:#d2a8ff,color:#d2a8ff
    style GCP fill:#1a1f2e,stroke:#4285F4,color:#4285F4`,
	},
];
