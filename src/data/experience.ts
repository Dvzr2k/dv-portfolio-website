export interface ExperienceEntry {
	company: string;
	location: string;
	role: { en: string; es: string };
	dates: { en: string; es: string };
	highlights: { en: string[]; es: string[] };
}

/* reverse chronological — most recent role first */
export const experience: ExperienceEntry[] = [
	{
		company: 'Zoluxiones',
		location: 'Lima, Perú',
		role: { en: 'DevOps Engineer / Specialist', es: 'DevOps Engineer / Specialist' },
		dates: { en: 'Nov 2025 – Apr 2026', es: 'Nov 2025 – abr 2026' },
		highlights: {
			en: [
				'Led DevOps adoption and CI/CD training across multiple development teams',
				'Automated deployment for roughly 50% of an 880+ application ecosystem',
				'Administered GCP and Azure services (Cloud Run, Functions, Jobs) and applied AI tooling to pre-deploy validation, working directly with the GenAI team',
			],
			es: [
				'Lideré la adopción de DevOps y capacitaciones de CI/CD en múltiples equipos de desarrollo',
				'Automaticé el despliegue de aproximadamente el 50% de un ecosistema de más de 880 aplicaciones',
				'Administré servicios de GCP y Azure (Cloud Run, Functions, Jobs) y apliqué herramientas de IA en validaciones pre-despliegue, trabajando directamente con el equipo de GenAI',
			],
		},
	},
	{
		company: 'Métrica Andina',
		location: 'Lima, Perú',
		role: { en: 'Windows/VMware Jr — AgileOps & DevOps', es: 'Windows/VMware Jr — AgileOps & DevOps' },
		dates: { en: '2024 – Aug 2025', es: '2024 – ago 2025' },
		highlights: {
			en: [
				'Operated critical applications across a mixed mainframe, on-prem, and cloud environment under a DevOps-legacy model',
				'Designed and ran CI/CD pipelines for build, test, and deploy, coordinating with SecOps, QA, and architecture',
				'Deployed containerized apps and microservices, improving portability across hybrid environments',
			],
			es: [
				'Operación de aplicaciones críticas en un entorno mixto de mainframe, on-premise y cloud bajo un modelo DevOps-Legacy',
				'Diseño y ejecución de pipelines CI/CD de build, testing y despliegue, coordinando con SecOps, QA y arquitectura',
				'Despliegue de aplicaciones contenerizadas y microservicios, mejorando la portabilidad en entornos híbridos',
			],
		},
	},
	{
		company: 'TIVIT Perú',
		location: 'Lima, Perú',
		role: { en: 'DevOps Trainee → IT Operator', es: 'Practicante DevOps → Operador TI' },
		dates: { en: '2023 – 2024', es: '2023 – 2024' },
		highlights: {
			en: [
				'Automated recurring Linux/Windows operations tasks, cutting down manual work',
				'Supported CI/CD integrations and deployments across environments',
				'Ran pre-deploy quality checks and 24/7 monitoring for Pacífico Seguros, Prima AFP, and a clinic network, catching incidents early',
			],
			es: [
				'Automatización de tareas operativas recurrentes en Linux y Windows, reduciendo el trabajo manual',
				'Apoyo en integraciones y despliegues CI/CD en distintos entornos',
				'Validaciones de calidad pre-despliegue y monitoreo 24/7 para Pacífico Seguros, Prima AFP y una red de clínicas, detectando incidentes de forma temprana',
			],
		},
	},
];
