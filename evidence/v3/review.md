# Santensor V3 — revisión independiente y entrega de preview

Fecha: 16 de octubre de 2026. Rama: `feat/santensor-v3-independent`. Base auditada: `4b94f81` en `feat/santensor-v2-experience-i18n`.

La recomendación es **A, Interactive Engineering Studio**. Se entrega implementado en Home, Labs, Cases y Contact, con EN/ES. **B, Intelligent Systems Workbench**, es una alternativa navegable de primera experiencia, también con adaptación móvil y EN/ES. La decisión artística final pertenece al propietario.

La preview no está lista para producción: faltan una propuesta comercial confirmada y casos profesionales autorizados. No se han creado métricas, clientes ni resultados comerciales ficticios. El único caso desarrollado describe el experimento público que efectivamente se puede ejecutar.

## Abrir y reproducir

- Preview A: `http://127.0.0.1:4173/es/` y `http://127.0.0.1:4173/`.
- Preview B: `http://127.0.0.1:4173/es/concept-b/` y `/concept-b/`.
- Comparador navegable: `http://127.0.0.1:4173/es/concepts/`.
- Galería de evidencias: `http://127.0.0.1:4175/`.
- Baseline V2.1 preservada durante esta sesión: `http://127.0.0.1:4174/es/`.

Desde `site`, ejecutar `npm run build` y `npm run preview`. El build de npm es explícitamente una preview. La aplicación es estática y funciona con Node y las dependencias del repositorio; no requiere backend, credenciales ni servicios remotos.

Para abrir la galería en otra sesión de PowerShell:

```powershell
$env:SITE_STATIC_ROOT='evidence/v3'
$env:SITE_STATIC_PORT='4175'
node scripts/serve.mjs
```

La baseline original está en `.local/v2-baseline`, excluida de Git. Se guardó antes de modificar la implementación. `node scripts/build-legacy-preview.mjs` permite reconstruir la dirección antigua en `.local/v2-reconstructed` usando el renderer y los estilos conservados. Esa reconstrucción no reemplaza la evidencia tomada de la base original.

## A. Auditoría de V2.1

La auditoría incluyó ejecución local, capturas completas en 1440 × 900 y 390 × 844, navegación grabada y las 20 pruebas originales de navegador. Las 20 pasaron. Eso verifica comportamientos concretos; no constituye aceptación de la dirección artística.

| Área | Defecto verificable | Evidencia e implicación |
| --- | --- | --- |
| Dirección de arte | La portada se divide en titular a la izquierda y orquestador a la derecha. El motivo dominante es un globo de líneas con nodos circulares. | `evidence/v3/v2.1/home-1440.png`. La ingeniería se representa mediante símbolos, sin mostrar el documento o producto que un comprador pueda reconocer. |
| Composición | Portada, relato y laboratorio vuelven a la pareja texto/diagrama. | Vídeo V2.1 de escritorio y capturas de laboratorio. Cambia el estado, pero se mantiene el tipo de escena. |
| Identidad | Azul casi negro, lima, monoespaciada y retícula constituyen casi toda la expresión visual. | Capturas Home/Labs. Son coherentes entre sí, pero no aportan una metáfora propia más allá de una interfaz técnica. |
| Tipografía | El titular de portada ocupa cinco líneas en la captura de escritorio y móvil; las etiquetas secundarias del sistema son muy pequeñas. | `home-1440.png`, `home-390.png`; CSS anterior usa varias etiquetas entre 8 y 11 px. Las afirmaciones generales reciben más peso que la información verificable. |
| Gráficos | El diagrama de laboratorio y el de portada comparten la misma estructura. Los casos dependen de texto y esquemas de flujo. | Capturas completas de Home, Labs y Cases. No hay una progresión de documentos a una interfaz de producto. |
| Scrollytelling | El relato fija una escena durante aproximadamente 3,3 alturas de viewport y va iluminando componentes y rutas. | `js/story.mjs`, vídeo V2.1. Hay movimiento real, pero la composición sigue siendo el mismo esquema; el coste de scroll supera la transformación visual. |
| Descubrimiento | La invitación a seguir explorando queda fuera de la captura inicial de 390 × 844 y al borde inferior en escritorio. | Comparación de portadas. El simulador compite con la indicación de continuación. |
| Responsive | El grafo de portada se comprime en móvil; el relato inferior cambia a placas con símbolos y títulos. | Vídeo móvil completo. Es operable, pero conserva la abstracción del escritorio y reduce la legibilidad de las etiquetas. |
| Claridad comercial | El mensaje general no identifica un público o un problema empresarial suficientemente específico. | Titular y descripción iniciales. Una especialización técnica no sustituye evidencia de encaje comercial. |
| Contenido | Se repiten fórmulas de transformación y fragmentos como «Más herramientas. Menos contexto.»; los casos incluyen material profesional que esta revisión no puede confirmar. | Vídeos y renderer anterior. La V3 sustituye las afirmaciones pendientes por un expediente editorial explícito. |
| Experiencias | El motor sí ofrece revisión humana, inspección histórica, ambigüedad y recuperación. Su interfaz presenta todo como estados de nodos. | Pruebas originales y recorrido 503 → reintento → aprobación. Se conserva el comportamiento, pero se cambia su presentación. |

No se interpreta el aprobado de Lighthouse o axe como prueba de atractivo, diferenciación, comprensión comercial o calidad cinematográfica.

## Referencias investigadas

Se consultaron fuentes originales y se guardaron capturas propias en `evidence/v3/references/`. Son referencias de análisis, no recursos incorporados al producto.

| Referencia | Principio observado | Aplicación propia |
| --- | --- | --- |
| [makemepulse](https://www.makemepulse.com/) | Jerarquía de gran escala y composición tipográfica que ocupa el espacio; los proyectos tienen presencia visual. | A separa introducción editorial, escena de documentos y software. No reproduce su distribución tipográfica ni sus piezas. |
| [Instrument — Work](https://www.instrument.com/work) | El trabajo aparece como material visual con categorías y composiciones amplias; la escala cambia al avanzar. | Las especialidades tienen tres estudios gráficos diferentes y el caso público tiene una pieza propia. No se simulan proyectos de clientes para llenar la página. |
| [Linear — proceso de rediseño](https://linear.app/now/how-we-redesigned-the-linear-ui) | La explicación del equipo vincula alineación, densidad, jerarquía y reducción del ruido con la evolución real de la aplicación. | El laboratorio prioriza solicitud, estados, acciones y evidencia. La política de revisión permanece visible. No se copia su navegación ni su sistema de componentes. |
| [Active Theory](https://activetheory.net/) y su [presentación anterior](https://v5.activetheory.net/) | Referencia de desarrollo creativo e integración entre diseño e ingeniería. | La página actual devolvió «Not Supported» en Chromium automatizado. No se atribuye una revisión visual completa de su experiencia WebGL. Ese límite refuerza la necesidad de una alternativa accesible sin GPU para esta preview. |

La elección de transiciones por CSS y scroll nativo es una decisión de esta implementación. No existe una necesidad espacial tridimensional que justifique incorporar Three.js o WebGL a una solicitud documental. GSAP permanece disponible para la reconstrucción antigua, pero V3 no lo carga. No se añadió ninguna dependencia.

## B. Dos conceptos implementados

| Criterio | A — Interactive Engineering Studio | B — Intelligent Systems Workbench |
| --- | --- | --- |
| Primera impresión | Fondo papel, cobalto, titular amplio y documentos con profundidad. | Mesa oscura verde mineral, documentos seleccionables y una hoja central de trabajo. |
| Entrada | Presenta la especialidad antes de pedir interacción. | Pide explorar una solicitud desde el inicio. |
| Metáfora | Solicitud dispersa → campos y reglas → software con revisión. | Una mesa donde se consultan solicitud, ficha y política. |
| Interacción | Scroll o capítulos; entrega directa al simulador funcional. | Selección de documentos, procesamiento local hasta revisión y acceso al laboratorio. |
| Móvil | Capítulos de tres botones, sin fijación larga; la escena se recompone. | Tres selectores horizontales; documento y resultado apilados, sin miniaturizar un dashboard. |
| Viabilidad | DOM, CSS, SVG y máquina de estados existente. | La misma base y el mismo motor; sin nuevas dependencias. |
| Límite | La propuesta de valor comercial aún necesita información del propietario. | La interacción inicial puede hacer pensar que Santensor vende únicamente este producto. |
| Recomendación | Principal: permite presentar las tres áreas y demostrar una de ellas sin exigir contexto previo. | Alternativa útil para una campaña de laboratorio o una audiencia técnica que ya conoce el estudio. |

La selección es un juicio de diseño razonado, no el resultado de una prueba con compradores reales. No se afirma una mejora de conversión.

## C. Implementación desarrollada

### Identidad y composición

Marca geométrica original, cobalto `#233ed1`, papel `#f0eee7`, carbón y acentos de terracota y verde. Tipografía local Space Grotesk para titulares, Inter para lectura y Plex Mono para referencias. Se reutilizan las fuentes licenciadas del repositorio.

La portada utiliza todo el ancho para presentar la disciplina. A continuación aparece una escena amplia de correo, ficha, directorio y una nota sobre autorización. Las tres especialidades tienen motivos diferentes: extracción tipográfica, capas de aplicación y recuperación de un servicio. Cases y Contact comparten escala, espaciado, controles y lenguaje visual.

### Movimiento y entrega del control

En pantallas de al menos 1100 px de ancho y 740 px de alto, y con movimiento habilitado, la escena ocupa 250 vh incluyendo su viewport fijo. El avance real dentro de la escena es de aproximadamente 150 vh. Los capítulos se activan al 33 % y 68 % del recorrido. Cambian los protagonistas y su escala: documentos, evidencia estructurada e interfaz.

Las transiciones de transformación duran aproximadamente 750–800 ms. El scroll no modifica el estado del simulador ni concede autorizaciones. La historia desemboca inmediatamente en el laboratorio de Home. El visitante debe ejecutar y decidir explícitamente.

Hay indicación visible de scroll en la primera pantalla, progreso, navegación por capítulos, enlace para saltar al laboratorio y transferencia de foco a ese destino. Los capítulos se pueden activar con teclado. Con movimiento reducido no hay fijación ni transiciones. En móvil la navegación por capítulos es deliberada y el scroll sigue siendo normal.

### Funcionalidad y seguridad

`js/workflow.mjs` y `js/contact.mjs` no cambian. Se conservan aprobación humana obligatoria, rechazo, corrección de solicitudes ambiguas, reintento explícito, historial de eventos, límites de entrada y uso de texto como datos. El nuevo documento visible del laboratorio se actualiza con la solicitud cargada, incluida una entrada hostil mostrada como texto.

Contacto prepara un borrador para revisión, no lo envía. Los vídeos usan exclusivamente nombres y direcciones sintéticos. No se tocaron el entrenador, producción, DNS, CNAME ni la configuración de hosting. No se fusionó el PR #3, no se creó un commit y no se publicó una preview remota.

### Contenido editorial y producción

Los campos `[HERO_HEADLINE: …]`, `[HERO_DESCRIPTION: …]`, `[CASE_TITLE: …]`, `[CASE_PROBLEM: …]`, `[CASE_ENGINEERING: …]` y `[CASE_RESULT: …]` existen en EN/ES y llevan `data-editorial-placeholder`. En Home aparecen dentro de apartados identificados como contenido pendiente; en Cases, el caso sin evidencia se presenta explícitamente pendiente.

`npm run build:production` falla antes de escribir el build cuando encuentra placeholders, la cinta de preview o metadatos `noindex`. También se rechaza el modo preview con `NODE_ENV=production`. `npm run build` usa `--preview` de forma explícita. Esta protección verifica el proceso de compilación; no puede impedir que alguien copie manualmente archivos de una preview a un alojamiento.

## Validación funcional y accesibilidad

| Ejecución | Resultado |
| --- | --- |
| Suite original V2.1, antes de editar | 20/20 pruebas de navegador aprobadas. |
| `npm test` | 16/16; conserva las 13 pruebas anteriores y agrega 3 comprobaciones V3. |
| `npm run test:e2e` | 23/23; 12 pruebas funcionales heredadas y 11 de V3. |
| `npm run lint` | Comprobaciones de sintaxis aprobadas. |
| `npm run build` | Preview estática generada. |
| `npm run build:production` | Rechazo esperado por preview y contenido editorial pendiente. |
| Preservación | Sin cambios en CNAME, configuración de hosting, motor de simulación ni controlador de contacto. |

Las pruebas de la coreografía anterior siguen en `tests/browser/story.spec.mjs` y se ejecutan con `playwright.legacy.config.mjs` contra la baseline. No se usan sus expectativas de círculos y cables para imponer el diseño antiguo a V3. En la prueba heredada de movimiento reducido se comprueba el equivalente nuevo cuando existe la escena V3; la aserción anterior permanece para la baseline.

Cobertura funcional: navegación recíproca EN/ES, hashes, recarga, prioridad de rutas directas, menú móvil, Escape y foco, ausencia de JavaScript, pausa, inspección histórica, teclado del inspector, autorización, ambigüedad, rechazo, recuperación, entradas hostiles, borradores y su invalidación tras editar. V3 añade capítulos reversibles, selección por teclado, limpieza al cambiar viewport o preferencias, interacción B y carga de un escenario mediante URL.

axe no detecta infracciones de las reglas WCAG 2 A/AA y 2.1 AA ejecutadas. Se comprobaron las páginas principales en ambos idiomas a 1440 y 390 px, los tres estados narrativos y los conceptos. Las pruebas responsive adicionales cubren 320 y 768 px sin desbordamiento horizontal. Se revisaron manualmente capturas y navegación por teclado.

Esto no equivale a certificar conformidad completa: faltan lectura con NVDA/VoiceOver, Safari/iOS, Firefox y una sesión táctil en dispositivo físico. Las pequeñas anotaciones gráficas son decorativas; el contenido funcional equivalente está en el relato y el laboratorio.

## Rendimiento medido

Lighthouse local, perfil móvil simulado, una ejecución por versión. Son mediciones de laboratorio en esta máquina, no datos de usuarios. Las capturas y pruebas pueden introducir variación; no se debe interpretar una diferencia pequeña como una tendencia de campo.

| Métrica | V2.1 | V3 |
| --- | ---: | ---: |
| Performance | 100 | 97 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 66 |
| FCP | 1,2 s | 1,9 s |
| LCP | 1,4 s | 2,1 s |
| TBT | 0 ms | 0 ms |
| CLS | 0,002 | 0,008 |
| Solicitudes registradas | 16 | 12 |
| Bytes transferidos registrados | 289.665 | 177.567 |

V3 tiene `noindex,nofollow` por ser una preview. El umbral SEO del auditor anterior devuelve salida no exitosa; se conserva ese resultado sin presentarlo como una aprobación. No se retira `noindex` para mejorar artificialmente la puntuación. La preparación SEO de producción requiere una revisión posterior a la aprobación editorial.

V3 descarga menos recursos, pero su primera pintura y LCP fueron más lentos en esta medición. El resultado visual no se justifica afirmando una mejora de rendimiento inexistente. No hay dependencia de modelos, bibliotecas 3D ni recursos gráficos externos durante el uso del sitio.

## Revisión de vídeo

Se revisó la duración completa de los recorridos mediante hojas temporales de fotogramas a 2 fps, además de las capturas de cada estado. Esta es una revisión visual secuencial, no una medición instrumental de fluidez ni una prueba de 60 fps. Los originales WebM están disponibles para reproducción a velocidad real en la galería.

Se detectó y corrigió un fallo móvil real durante la grabación: una capa documental transparente interceptaba el enlace al laboratorio tras seleccionar el tercer capítulo. Se corrigió el hit testing de toda la capa decorativa y se añadió una regresión a 320, 390 y 768 px en ambos idiomas.

También se separó la grabación final de las capturas de página completa: Playwright podía producir un fotograma con una escala diferente al capturar una página larga durante la grabación. `scripts/record-v3-tour.mjs` graba navegación sin capturas durante el vídeo. Los archivos `tour-timeline-*.json` registran los tiempos de cada acción.

Observaciones visuales:

- V2.1: el flujo se vuelve progresivamente legible, pero la figura y su distribución permanecen constantes. El móvil contiene un tramo largo de placas abstractas.
- V3 escritorio: documentos dispersos, tabla de evidencia e interfaz son escenas distinguibles. El movimiento orienta la atención hacia los datos necesarios para decidir. La transición al laboratorio mantiene la solicitud como hilo conductor.
- V3 móvil: los documentos se recomponen; los capítulos se seleccionan y el laboratorio ocupa el ancho de lectura. No hay secuestro del scroll ni un grafo de escritorio miniaturizado.
- Estados funcionales: el error cambia la etapa y expone reintento; la revisión muestra acciones explícitas; el resultado se puede inspeccionar. No hay aprobación automática provocada por el scroll.
- B: cambiar documentos mantiene el contexto de NS-204. Procesar termina en revisión humana, y el enlace lleva al experimento completo. No se presenta como una aplicación empresarial desplegada.

El recorrido automatizado avanza más rápido que una lectura comercial completa. Sirve para juzgar composición, transiciones y respuesta; no demuestra comprensión por usuarios nuevos.

## Matriz de defectos

| ID | Severidad | Defecto | Estado y evidencia |
| --- | --- | --- | --- |
| V2-01 | Alta | Composición inicial convencional de texto y grafo | Corregido: titular editorial de ancho amplio y escena documental. Comparaciones 1440/390. |
| V2-02 | Alta | Scrollytelling conserva casi siempre el mismo diagrama | Corregido: tres superficies distintas; capítulos y vídeo. |
| V2-03 | Alta | La continuidad no se descubre en el primer viewport móvil | Corregido: enlace explícito de scroll visible en `v3/home-390.png`. |
| V2-04 | Media | Móvil reduce el grafo de escritorio | Corregido: capítulos táctiles, documentos recompuestos y estados en rejilla de lectura. |
| V2-05 | Media | Especialidades y casos con poca variedad gráfica | Corregido: tipografía/extracción, capas de software, recuperación y recibo del caso público. |
| V2-06 | Alta | Lenguaje comercial abstracto y repetitivo | Parcial: copy funcional concreto implementado; propuesta comercial específica pendiente de información confirmada. |
| V2-07 | Alta | Casos profesionales sin validación independiente | Pendiente editorial, contenido identificado y build de producción bloqueado. |
| V3-01 | Media | Contraste insuficiente de textos secundarios en primera iteración | Corregido; axe sin infracciones tras ajustar los colores. |
| V3-02 | Media | Titular de escritorio demasiado alto en primera iteración | Corregido: dos líneas naturales en la captura 1440; sin saltos `<br>` forzados. |
| V3-03 | Alta | Capa invisible intercepta salto al laboratorio en móvil | Corregido y cubierto por regresión en tres anchos y dos idiomas. |
| V3-04 | Media | La ficha de laboratorio podía mostrar la solicitud inicial tras cambiar escenario | Corregido: texto, categoría y referencia reflejan el estado real con `textContent`. |
| V3-05 | Media | Capturas completas dentro de un vídeo podían alterar temporalmente el encuadre | Corregido en la grabación final separada. |
| V3-06 | Media | Compatibilidad real con Safari y dispositivos físicos no medida | Pendiente; no se afirma cobertura multiplataforma completa. |
| V3-07 | Baja | Anotaciones decorativas pequeñas en móvil | Aceptable en la preview porque no son controles ni contenido único; revisar con pruebas de lectura reales. |
| V3-08 | Alta | Aceptación de marca, dirección artística y propuesta comercial | Pendiente del propietario. |

## Inventario de entrega

- `evidence/v3/index.html`: galería local de revisión.
- `evidence/v3/compare-1440.png` y `compare-390.png`: parejas de capturas al tamaño solicitado, sin reencuadrar el contenido de cada viewport.
- `evidence/v3/v2.1/home-*-full.png` y `evidence/v3/v3/home-*-full.png`: páginas completas.
- `evidence/v3/v2.1/tour-*.webm` y `evidence/v3/v3/tour-*.webm`: recorridos reales.
- `evidence/v3/v3/concept-b-*.png`: segunda dirección, escritorio y móvil.
- `evidence/v3/tests/`: pruebas, accesibilidad y tres capítulos.
- `evidence/v3/baseline-tests/`: resultado de las pruebas originales antes de editar.
- `evidence/v3/performance-v2/` y `performance-v3/`: mediciones de Lighthouse.
- `evidence/v3/manifest.json`: rutas, tamaños y hashes SHA-256 de los entregables locales.

La preview ofrece una alternativa visual concreta y verificable. La publicación exige resolver el contenido editorial y obtener aceptación del propietario; no forma parte de esta entrega local.
