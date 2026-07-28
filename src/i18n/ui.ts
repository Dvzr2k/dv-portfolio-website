export const languages = {
	en: 'English',
	es: 'Español',
} as const;

export const defaultLang = 'en';

export const ui = {
	en: {
		'nav.about': 'About',
		'nav.projects': 'Projects',
		'nav.contact': 'Contact',
		'hero.greeting': "Hi, I'm Diego",
		'hero.tagline': 'DevOps engineer who builds the infrastructure, then ships the app on top of it.',
		'hero.cta': 'See my work',
		'about.heading': 'About',
		'about.bio':
			"I come from a DevOps background — infrastructure, CI/CD, Kubernetes, Terraform. This portfolio is my first time building the application layer myself, end to end, with the same rigor I'd bring to production infrastructure.",
		'skills.heading': 'Skills & tools',
		'projects.heading': 'Projects',
		'contact.heading': "Let's talk",
		'contact.cta': 'Reach out on GitHub or LinkedIn.',
		'footer.rights': 'All rights reserved.',
	},
	es: {
		'nav.about': 'Sobre mí',
		'nav.projects': 'Proyectos',
		'nav.contact': 'Contacto',
		'hero.greeting': 'Hola, soy Diego',
		'hero.tagline': 'Ingeniero DevOps que construye la infraestructura y luego despliega la app sobre ella.',
		'hero.cta': 'Ver mi trabajo',
		'about.heading': 'Sobre mí',
		'about.bio':
			'Vengo de un perfil DevOps — infraestructura, CI/CD, Kubernetes, Terraform. Este portafolio es la primera vez que construyo la capa de aplicación yo mismo, de principio a fin, con el mismo rigor que aplicaría a infraestructura en producción.',
		'skills.heading': 'Herramientas y tecnologías',
		'projects.heading': 'Proyectos',
		'contact.heading': 'Hablemos',
		'contact.cta': 'Contáctame por GitHub o LinkedIn.',
		'footer.rights': 'Todos los derechos reservados.',
	},
} as const;
