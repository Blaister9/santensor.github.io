document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargador de Componentes (Component Loader)
    const components = [
        { id: 'navbar-placeholder', url: './components/navbar.html' },
        { id: 'hero-placeholder', url: './components/hero.html' },
        { id: 'about-placeholder', url: './components/about.html' },
        { id: 'services-placeholder', url: './components/services.html' },
        { id: 'process-placeholder', url: './components/process.html' },
        { id: 'contact-placeholder', url: './components/contact.html' }
    ];

    const loadComponents = async () => {
        for (const component of components) {
            const element = document.getElementById(component.id);
            if (element) {
                try {
                    const response = await fetch(component.url);
                    if (response.ok) {
                        const html = await response.text();
                        element.innerHTML = html;
                    } else {
                        console.error(`Error cargando ${component.url}`);
                    }
                } catch (error) {
                    console.error(`Error de red al cargar ${component.url}`, error);
                }
            }
        }
        
        // Inicializar lógica que depende del DOM cargado
        initInteractions();
    };

    // 2. Lógica de Interacciones
    const initInteractions = () => {
        // --- LOGICA DEL MENÚ HAMBURGUESA ---
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        const navLinks = document.querySelectorAll(".nav-link");

        if (hamburger && navMenu) {
            // Toggle menú al clickear hamburguesa
            hamburger.addEventListener("click", () => {
                hamburger.classList.toggle("active");
                navMenu.classList.toggle("active");
            });

            // Cerrar menú al clickear un link (UX importante)
            navLinks.forEach(n => n.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            }));
        }
        // Scroll Suave para anclas
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Manejo del Formulario
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Gracias por contactarnos. Responderemos en breve.');
                form.reset();
            });
        }
    };

    // Ejecutar carga
    loadComponents();
});
