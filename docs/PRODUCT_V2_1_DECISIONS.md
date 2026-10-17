# Santensor V2.1 — Intelligent Systems in Motion

## Auditoría y alcance

Base inspeccionada: `3af1fe350b02067d6edb15c64154f51fe4f63d15`, rama `feat/santensor-v2-experience-i18n`, PR #3 abierto en borrador. El checkout estaba limpio. La V2 tenía rutas estáticas bilingües, SVG conectado al simulador, control humano y contacto honesto. No tenía pinning, scrubbing ni narrativa reversible. La página de casos conservaba evidencia y límites útiles, pero su presentación era principalmente texto.

Se conservan el generador estático, catálogos, motor `workflow.mjs`, APIs anteriores, pruebas, fuentes locales, historial, CNAME y configuración de Pages. No se modifica el repositorio del entrenador ni se utiliza `stage-preview.mjs`: su destino pertenece al servicio Railway excluido de esta misión. La referencia existente al entrenador en un caso describe contenido previo; no implica trabajo nuevo ni validación de ese producto.

## Referencias y decisiones visuales

- [Bruno Simon](https://bruno-simon.com/): convertir una demostración funcional en el centro del portafolio. Aquí el visitante sigue una solicitud y después controla sus decisiones. No se reproduce su mundo 3D ni su navegación.
- [Linear, diseño de interfaz](https://linear.app/now/how-we-redesigned-the-linear-ui): reducir ruido y reforzar jerarquía con tipografía, contraste y alineación. Se traduce a filas editoriales, inspector y telemetría, sin copiar componentes.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): timeline vinculada al desplazamiento y pin temporal sobre scroll nativo. No se usan ScrollSmoother, snapping, interceptores de wheel ni scroll hijacking.

Midnight, lima y cian conservados. Titulares amplios, documentación técnica en mono, conexiones dirigidas y un campo de coordenadas determinista. Los documentos fragmentados se ordenan espacialmente antes de conectar interpretación, política, API, revisión y registro. El tercer acto detiene el flujo ante 503, muestra recuperación, requiere revisión ilustrativa y termina con un registro. El color se acompaña de texto, símbolos y trazos diferenciados.

## Arquitectura de movimiento

`render-story.mjs` genera los tres capítulos como HTML legible sin JavaScript. `story-copy.mjs` contiene EN/ES y se integra en los catálogos existentes, por lo que la prueba de paridad comprueba también sus claves.

`story.mjs` coordina una timeline GSAP con `scrub: true`. La posición del scroll determina transformaciones de documentos, dibujo de conexiones, movimiento del paquete y ocho estados de telemetría. Retroceder revierte el mismo timeline, sin volver a ejecutar decisiones del laboratorio. `data-act` y `data-story-state` permiten verificar estado observable, además de comprobar geometría y trazos SVG.

Pinning solo desde 1100 px de ancho y 700 px de alto, sin movimiento reducido. En tableta, móvil y movimiento reducido se presentan tres capítulos verticales con diagramas propios; no hay espacio fijado ni textos ocultos. Los cambios de media query limpian pin, estilos e inert. Un enlace de salida lleva el foco al acceso al laboratorio.

`animation.mjs` carga los bundles oficiales como scripts clásicos locales, porque el paquete UMD no puede importarse directamente como módulo estricto. Se comparten GSAP y su carga; ScrollTrigger se solicita solo desde la portada. No se añaden WebGL, framework, backend, CDN ni bibliotecas alternativas de movimiento. `motion.mjs` controla la entrada editorial finita del hero. La escena grande permanece visible durante la entrada para no retrasar LCP.

La narrativa es arquitectura ilustrativa, no ejecución ni inferencia real. El laboratorio sigue usando la máquina determinista existente: su estado controla badges, conexiones, partículas, indicador de ejecución, pausa, error y revisión. El SVG pausa sus animaciones al detenerse. Selección e inspector histórico permanecen separados del estado en ejecución.

## Navegación, casos y contacto

Se evaluó la [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) con opt-in entre documentos. Chromium registró un aborto de transición durante navegación automatizada. Se retiró ese opt-in en esta entrega: enlaces nativos entre páginas e idiomas, sin interceptar historial ni depender de soporte de API. Es una decisión de estabilidad, no una función anunciada como implementada.

Los casos incorporan un esquema de arquitectura y jerarquía entre problema, decisiones, implementación y verificación. Se conservan etiquetas de prototipo y reconstrucción; no se inventan proyectos reales, clientes ni métricas. El formulario muestra los tres pasos hasta el envío desde el cliente de correo y marca campos inválidos. Preparar, copiar y abrir un borrador no equivale a enviar.

## Publicación y límites

La preview utiliza Sites con `.openai/hosting.json` en este mismo repositorio. Es un destino de revisión independiente; no reemplaza la arquitectura ni el repositorio GitHub. El helper sincroniza el commit del código existente a su remoto de publicación sin alterar `origin`, sin force-push y sin tocar `main`.

`prepare-review.mjs` genera `dist`, añade noindex y robots de revisión únicamente al artefacto e incluye `version.json`. El build ordinario de Pages conserva metadatos de producción. El destino de revisión nace privado para la cuenta propietaria. No se crea un servicio Railway ni se configura un plan de pago, dominio o DNS.

La aceptación de dirección artística corresponde al usuario. Pruebas automáticas y revisión del agente no sustituyen esa aprobación, una auditoría con lector de pantalla ni pruebas físicas en dispositivos.
