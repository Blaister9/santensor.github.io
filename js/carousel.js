function initServicesCarousel() {
    // 1. Verificación de seguridad: Buscamos la rueda en el HTML
    // Si no existe (porque estamos en otra página), la función se detiene aquí para no dar error.
    const wheel = document.getElementById('main-wheel');
    if (!wheel) return;

    // 2. TUS DATOS DE SERVICIOS (Configurados completamente)
    const servicesData = [
        {
            id: "01",
            icon: "💻",
            title: "Desarrollo de Software",
            desc: "Diseñamos y desarrollamos aplicaciones modernas, seguras y escalables, alineadas con objetivos del negocio.",
            list: [
                "Desarrollo de software a la medida.",
                "Apps web rápidas, responsivas y SEO-friendly.",
                "Integración con sistemas existentes y APIs.",
                "Automatización de procesos empresariales."
            ]
        },
        {
            id: "02",
            icon: "☁️",
            title: "Arquitectura Cloud",
            desc: "Diseñamos e implementamos infraestructura y entornos cloud seguros y eficientes, con buenas prácticas del sector.",
            list: [
                "Arquitectura y despliegue en AWS y Azure.",
                "Alta disponibilidad, escalabilidad y seguridad.",
                "Migración on-premise a la nube.",
                "Optimización de costos y rendimiento."
            ]
        },
        {
            id: "03",
            icon: "🧭",
            title: "Consultoría IT",
            desc: "Acompañamos decisiones tecnológicas con consultoría especializada para mejorar control, desempeño y seguridad.",
            list: [
                "Diagnóstico y evaluación de infraestructura.",
                "Auditoría de código y arquitectura.",
                "Hojas de ruta de transformación digital.",
                "Acompañamiento técnico estratégico."
            ]
        },
        {
            id: "04",
            icon: "📂",
            title: "Implementación SGDEA",
            desc: "Implementamos SGDEA para asegurar control, trazabilidad y eficiencia documental, con adopción guiada.",
            list: [
                "Diseño e implementación de SGDEA.",
                "Digitalización y organización documental.",
                "Automatización de flujos documentales.",
                "Integración con plataformas institucionales."
            ]
        },
        {
            id: "05",
            icon: "🤖",
            title: "IA y Automatización",
            desc: "Aplicamos IA para convertir datos en valor y automatizar procesos críticos en software y gestión documental.",
            list: [
                "Automatización inteligente de procesos.",
                "Análisis de datos para toma de decisiones.",
                "Procesamiento inteligente de documentos.",
                "Integración de IA en software y SGDEA."
            ]
        }
    ];

    // 3. Referencias a los elementos del HTML
    const wNumber = document.getElementById('w-number');
    const wTitle = document.getElementById('w-title');
    const wDesc = document.getElementById('w-desc');
    const wList = document.getElementById('w-list');
    const btnNext = document.getElementById('w-next');
    const btnPrev = document.getElementById('w-prev');
    const textContent = document.querySelector('.wheel-text-content');

    // 4. Variables de Estado (Matemáticas del círculo)
    let activeIndex = 0;
    const totalItems = servicesData.length;
    const theta = 360 / totalItems; // Ángulo entre cada item
    const radius = 350; // Radio del círculo (debe coincidir aprox con tu CSS)

    // 5. Inicializar: Crear las burbujas
    function initWheel() {
        wheel.innerHTML = ''; // Limpiar contenido previo

        servicesData.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('wheel-item');
            div.innerHTML = item.icon; // Pone el emoji
            
            // Posicionamiento matemático: Girar eje -> Mover radio -> Des-girar eje
            div.style.transform = `rotate(${theta * index}deg) translate(${radius}px) rotate(${-theta * index}deg)`;
            
            // Hacer clic en la burbuja lleva a ese servicio
            div.addEventListener('click', () => {
                activeIndex = index;
                updateWheel();
            });

            wheel.appendChild(div);
        });

        // Aplicar estado inicial
        updateWheel();
    }

    // 6. Actualizar vista (Al girar)
    function updateWheel() {
        // A. Girar la rueda grande principal
        wheel.style.transform = `rotate(${-activeIndex * theta}deg)`;

        // B. Actualizar items (Clase Active y mantener iconos derechos)
        const items = document.querySelectorAll('.wheel-item');
        items.forEach((item, index) => {
            item.classList.remove('active');
            
            // Cálculo para contrarrestar la rotación y que el icono no quede de cabeza
            const totalRotation = (theta * index) + (-activeIndex * theta);
            item.style.transform = `rotate(${theta * index}deg) translate(${radius}px) rotate(${-totalRotation}deg)`;
            
            if (index === activeIndex) {
                item.classList.add('active');
            }
        });

        // C. Actualizar Texto con efecto Fade (Desvanecimiento)
        if (textContent) {
            textContent.style.opacity = 0; // Ocultar
            
            setTimeout(() => {
                const data = servicesData[activeIndex];
                
                // Llenar datos si los elementos existen
                if(wNumber) wNumber.innerText = data.id;
                if(wTitle) wTitle.innerText = data.title;
                if(wDesc) wDesc.innerText = data.desc;
                
                if(wList) {
                    // Generar HTML de la lista
                    wList.innerHTML = data.list.map(li => `<li>${li}</li>`).join('');
                }

                textContent.style.opacity = 1; // Mostrar
            }, 300); // Esperar 300ms a que se oculte para cambiar el texto
        }
    }

    // 7. Event Listeners (Botones Siguiente / Anterior)
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            activeIndex++;
            if (activeIndex >= totalItems) activeIndex = 0; // Loop infinito
            updateWheel();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            activeIndex--;
            if (activeIndex < 0) activeIndex = totalItems - 1; // Loop infinito
            updateWheel();
        });
    }
    
    // Arrancar la creación de elementos
    initWheel();
}
