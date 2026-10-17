# Revisión visual V2.1

Revisión del agente sobre capturas de Chromium. Pendiente de aprobación artística del usuario.

## Recorrido de revisión

1. Abrir la portada y seguir el scroll de escritorio. Los documentos dispersos se alinean, las conexiones se dibujan y el paquete recorre el sistema.
2. Detenerse en inteligencia, subir hasta el primer acto y volver a avanzar. La posición del scroll controla el mismo estado en ambos sentidos.
3. En el tercer acto observar 503, recuperación, revisión humana y registro. Continuar hasta la invitación al laboratorio o activar «Saltar al laboratorio» con teclado.
4. En el laboratorio ejecutar éxito, ambigüedad y fallo. Pausar, inspeccionar etapas previas, recuperar la herramienta y aprobar/rechazar/derivar.
5. Cambiar a ES; repetir en 768 × 1024 y 390 × 844. En estas dimensiones la narrativa es vertical, sin pin.

## Evidencia local reproducible

- [Acto I EN](local/act-1-en-1440.png), [acto II EN](local/act-2-en-1440.png), [acto III EN](local/act-3-en-1440.png).
- [Acto I ES](local/act-1-es-1440.png), [acto II ES](local/act-2-es-1440.png), [acto III ES](local/act-3-es-1440.png).
- [Fallo narrativo](local/act-3-error-es-1440.png), [recuperación](local/act-3-recovered-es-1440.png), [revisión humana](local/act-3-review-es-1440.png).
- [Vídeo EN](local/video/story-en.webm), [vídeo ES](local/video/story-es.webm). Incluyen scroll, retroceso, salida y fallo/recuperación en el laboratorio.
- Trazas locales `local/story-en.zip` y `local/story-es.zip`. Abrir con `npx playwright show-trace evidence/v2.1/local/story-en.zip`. Se conservan en el workspace y en el artefacto de CI `site-verification`; se excluyen de Git por tamaño. Los vídeos sí se versionan.
- [Composición completa EN escritorio](local/home-en-1440-full.png), [ES escritorio](local/home-es-1440-full.png). Se capturan con movimiento reducido para mostrar los tres capítulos completos, sin huecos producidos por un pin.
- [Composición EN tableta](local/home-en-768-composition.png), [ES tableta](local/home-es-768-composition.png), [EN móvil](local/home-en-390-composition.png), [ES móvil](local/home-es-390-composition.png).
- [Laboratorio EN](local/lab-complete-en-1440.png), [ES](local/lab-complete-es-1440.png), [fallo ES](local/lab-error-es-1440.png).
- Casos y contacto: `local/cases-{en,es}-{1440,390}.png`, `local/contact-{en,es}-{1440,390}.png`, y composiciones completas de 768/390.
- [Resultados del navegador](local/browser-results.json), [estados de scroll EN](local/scroll-states-en.json), [estados ES](local/scroll-states-es.json), [Lighthouse local](local/lighthouse-summary.json).

## Correcciones surgidas de la revisión

Se corrigió la superposición de los documentos SVG: los destinos conservan sus coordenadas absolutas. Se retiró una rotación de órbita cuyo centro desplazaba la geometría; el entramado permanece centrado en interpretación. El badge de resultado se separó de su etiqueta. Se aumentó el contraste de telemetría pendiente. Los tests comprueban separación entre documentos, columnas y ausencia de overflow; no son una prueba universal de cualquier solapamiento posible.

La entrada del hero conserva visible la escena principal, evitando que un fade prolongue su aparición. La narrativa mantiene textos legibles en vertical sin depender de una animación. El circuito del laboratorio distingue error y revisión mediante forma, texto y color.

## Límites de evidencia

Chromium automatizado, no pruebas físicas de móvil ni auditoría completa con lector de pantalla. Axe no sustituye revisión humana. Lighthouse es una medición sintética local: LCP 1,3 s, TBT 30 ms, CLS 0,002; no hay mediciones de campo ni INP medido. Una ejecución previa bajo carga concurrente dio LCP 2,9 s; no se atribuye la diferencia completa a un solo cambio visual. La preview privada se valida adicionalmente por estado del proveedor; no se confunde con una suite E2E remota sin autenticar.
