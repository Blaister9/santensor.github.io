document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargador de Componentes (Component Loader)
    const components = [
        { id: 'hero-placeholder', url: './components/hero.html' },
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
