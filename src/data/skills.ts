export interface Skill {
	name: string;
	/* 'simple-icons' entries render from that package's SVG path data at
	   build time (see TechIcon.astro). 'file' points at a self-hosted SVG
	   in src/assets/icons — used for brands simple-icons doesn't carry
	   (AWS and Azure were both pulled after Amazon/Microsoft trademark
	   requests, so those two come from devicon instead). */
	icon: { source: 'simple-icons'; slug: string; hex: string } | { source: 'file'; file: string };
}

export const skills: Skill[] = [
	{ name: 'Terraform', icon: { source: 'simple-icons', slug: 'siTerraform', hex: '#844FBA' } },
	{ name: 'AWS', icon: { source: 'file', file: 'aws.svg' } },
	{ name: 'Azure', icon: { source: 'file', file: 'azure.svg' } },
	{ name: 'GCP', icon: { source: 'simple-icons', slug: 'siGooglecloud', hex: '#4285F4' } },
	{ name: 'Kubernetes', icon: { source: 'simple-icons', slug: 'siKubernetes', hex: '#326CE5' } },
	{ name: 'Docker', icon: { source: 'simple-icons', slug: 'siDocker', hex: '#2496ED' } },
	{ name: 'GitHub Actions', icon: { source: 'simple-icons', slug: 'siGithubactions', hex: '#2088FF' } },
	{ name: 'Jenkins', icon: { source: 'simple-icons', slug: 'siJenkins', hex: '#D24939' } },
	{ name: 'Git', icon: { source: 'simple-icons', slug: 'siGit', hex: '#F03C2E' } },
	{ name: 'Bash', icon: { source: 'simple-icons', slug: 'siGnubash', hex: '#4EAA25' } },
	{ name: 'Python', icon: { source: 'simple-icons', slug: 'siPython', hex: '#3776AB' } },
	{ name: 'Linux', icon: { source: 'simple-icons', slug: 'siLinux', hex: '#FCC624' } },
	{ name: 'Dynatrace', icon: { source: 'simple-icons', slug: 'siDynatrace', hex: '#1496FF' } },
	{ name: 'Jira', icon: { source: 'simple-icons', slug: 'siJira', hex: '#0052CC' } },
	{ name: 'Confluence', icon: { source: 'simple-icons', slug: 'siConfluence', hex: '#172B4D' } },
	{ name: 'Astro', icon: { source: 'simple-icons', slug: 'siAstro', hex: '#FF5D01' } },
	{ name: 'React', icon: { source: 'simple-icons', slug: 'siReact', hex: '#61DAFB' } },
	{ name: 'Claude Code', icon: { source: 'simple-icons', slug: 'siAnthropic', hex: '#D97757' } },
];
