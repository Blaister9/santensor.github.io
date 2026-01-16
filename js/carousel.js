// js/carousel.js

// 1. TUS DATOS (Extraídos de tu HTML anterior)
const servicesData = [
    {
        id: "01",
        icon: "💻", // Emojis o puedes poner rutas a imágenes SVG
        title: "Desarrollo de Software",
        desc: "Diseñamos y desarrollamos aplicaciones modernas, seguras y escalables, alineadas con objetivos del negocio.",
        list: [
            "Desarrollo de software a la medida.",
            "Apps web rápidas y responsivas.",
            "Integración con APIs.",
            "Automatización de procesos."
        ]
    },
    {
        id: "02",
        icon: "☁️",
        title: "Arquitectura Cloud",
        desc: "Diseñamos e implementamos infraestructura y entornos cloud seguros y eficientes.",
        list: [
            "Arquitectura en AWS y Azure.",
            "Alta disponibilidad y seguridad.",
            "Migración on-premise a la nube.",
            "Optimización de costos."
        ]
    },
    {
        id: "03",
        icon: "🧭",
        title: "Consultoría IT",
        desc: "Acompañamos decisiones tecnológicas con consultoría especializada para mejorar control y seguridad.",
        list: [
            "Diagnóstico de infraestructura.",
            "Auditoría de código.",
            "Hojas de ruta digital.",
            "Acompañamiento técnico."
        ]
    },
    {
        id: "04",
        icon: "📂",
        title: "Implementación SGDEA",
        desc: "Aseguramos control, trazabilidad y eficiencia documental con adopción guiada.",
        list: [
            "Diseño de SGDEA.",
            "Digitalización documental.",
            "Flujos documentales automáticos.",
            "Integración institucional."
        ]
    },
    {
        id: "05",
        icon: "🤖",
        title: "IA y Automatización",
        desc: "Aplicamos IA para convertir datos en valor y automatizar procesos críticos.",
        list: [
            "Automatización inteligente.",
            "Análisis de datos.",
            "Procesamiento inteligente de documentos.",
            "Integración de IA en software."
        ]
    }
];

// 2. REFERENCIAS DOM
const wheel = document.getElementById('main-wheel');
const wNumber = document.getElementById('w-number');
const wTitle = document.getElementById('w-title');
const wDesc = document.getElementById('w-desc');
const wList = document.getElementById('w-list');
const btnNext = document.getElementById('w-next');
const btnPrev = document.getElementById('w-prev');

let activeIndex = 0;
const totalItems = servicesData.length;
const theta = 360 / totalItems; 
const radius = 350; // Radio del círculo en px

// 3. INICIALIZAR
function initWheel() {
    // Limpiar rueda
    wheel.innerHTML = '';

    servicesData.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('wheel-item');
        div.innerHTML = item.icon; // Pone el emoji
        
        // Posicionamiento matemático circular
        // Rotamos el eje Y luego trasladamos
        div.style.transform = `rotate(${theta * index}deg) translate(${radius}px) rotate(${-theta * index}deg)`;
        
        div.addEventListener('click', () => {
            activeIndex = index;
            updateWheel();
        });

        wheel.appendChild(div);
    });

    updateWheel();
}

// 4. ACTUALIZAR VISTA
function updateWheel() {
    // Girar la rueda principal
    wheel.style.transform = `rotate(${-activeIndex * theta}deg)`;

    // Actualizar items (Clase Active y Contra-rotación para que el icono no quede chueco)
    const items = document.querySelectorAll('.wheel-item');
    items.forEach((item, index) => {
        item.classList.remove('active');
        
        // Matemáticas para mantener el icono derecho mientras la rueda gira
        const totalRotation = (theta * index) + (-activeIndex * theta);
        item.style.transform = `rotate(${theta * index}deg) translate(${radius}px) rotate(${-totalRotation}deg)`;
        
        if (index === activeIndex) {
            item.classList.add('active');
        }
    });

    // Actualizar Texto (con pequeña animación de opacidad)
    const textContainer = document.querySelector('.wheel-text-content');
    textContainer.style.opacity = 0;
    
    setTimeout(() => {
        const data = servicesData[activeIndex];
        wNumber.innerText = data.id;
        wTitle.innerText = data.title;
        wDesc.innerText = data.desc;
        
        // Generar lista
        wList.innerHTML = data.list.map(li => `<li>${li}</li>`).join('');

        textContainer.style.opacity = 1;
    }, 300);
}

// 5. CONTROLES
btnNext.addEventListener('click', () => {
    activeIndex++;
    if (activeIndex >= totalItems) activeIndex = 0;
    updateWheel();
});

btnPrev.addEventListener('click', () => {
    activeIndex--;
    if (activeIndex < 0) activeIndex = totalItems - 1;
    updateWheel();
});

// Arrancar si existe el elemento (evita errores en otras páginas)
if (document.getElementById('main-wheel')) {
    initWheel();
}
