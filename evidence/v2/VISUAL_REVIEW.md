# Revisión visual de la propuesta

Revisión del agente sobre capturas reales de Playwright, no aprobación del usuario. La dirección de arte continúa pendiente de revisión explícita antes de reemplazar producción.

- **1440 × 900:** jerarquía asimétrica entre promesa comercial y sistema interactivo; ambos CTA y controles de ejecución visibles. Paleta midnight/lima/cian y tipografía propia con fuentes locales. No hay cuadrícula de tarjetas en la portada.
- **390 × 844, EN y ES:** cabecera con idioma y menú, titular, CTA, escena compacta y controles caben en el primer pantallazo. Se ampliaron las etiquetas del sistema tras revisar su legibilidad. No se observan solapamientos ni desbordamiento horizontal.
- **Página completa:** alternancia de marfil y navy, tres disciplinas con igual jerarquía, acceso al proceso, estudios rotulados, método y contacto. Los casos explicitan procedencia y límites de evidencia.
- **Laboratorio:** inspección del estado de fallo simulado, respuesta 503, traza y recuperación visible. El contraste de la selección y las conexiones permite distinguir etapa actual, historial y pasos pendientes.
- **Navegación:** el menú móvil abre y cierra; Escape devuelve el foco; cambiar idioma conserva la ruta y el fragmento. El inspector se puede recorrer con teclado. Con movimiento reducido se mantiene el control del sistema sin animaciones.
- **Accesibilidad:** axe no encontró violaciones A/AA en las rutas y viewports automatizados. Los JSON conservan resultados incompletos que requieren revisión manual; no equivalen a una auditoría exhaustiva con lector de pantalla.

Las capturas primarias de la preview están en `preview/home-en-1440.png`, `preview/home-en-390.png`, `preview/home-es-1440.png` y `preview/home-es-390.png`. `manifest.json` registra tamaños, hashes, URL y commit de fuente. Las imágenes `-full` y `lab-failure-*` permiten revisar composición completa y evidencia de interacción.

No se utilizó Lighthouse como criterio de aprobación visual. No se afirma una prueba física de Android/Samsung ni aceptación del usuario.
