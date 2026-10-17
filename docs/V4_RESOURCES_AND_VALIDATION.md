# V4 — recursos, arquitectura y límites de verificación

## Arquitectura

El recorrido tiene un único contenedor persistente, un progreso reversible de 0 a 4 y tres superficies HTML cuya identidad se conserva. El scroll nativo controla interpolaciones continuas de posición, perspectiva y escala. La cámara WebGL usa el mismo progreso. No se intercepta la rueda ni se bloquea el desplazamiento de la página.

`js/cinematic-world.mjs` construye geometría original: quince láminas ópticas, monturas metálicas, grabados, luz direccional, suelo reflectante, seis módulos físicos y un bus de ejecución. No utiliza modelos ni texturas descargados. La iluminación de estudio se genera con Canvas. Three.js está fijado en `0.186.1`; esbuild en `0.25.12`; el lockfile permite reconstruir con `npm ci`.

`js/cinematic.mjs` coordina escenas, idioma y vistas; `js/cinematic-operation.mjs` presenta el motor `createRun`/`stepRun` existente, sin modificar `js/workflow.mjs`. Los estados son reales y locales: entrada, interpretación por reglas, política, herramienta simulada, revisión humana y resultado. El fallo 503 y su recuperación generan eventos distintos. Las instantáneas de eventos conservan la evidencia del fallo después de recuperar el servicio.

Las visualizaciones de modelos de IA, recuperación indexada, predicción y evaluación de modelos se identifican como conceptuales. La demo no ejecuta inferencia, no consulta APIs externas y no envía correos. El contacto conserva la preparación de un borrador en la aplicación de correo del visitante.

## Presupuesto visual y adaptación

- Renderer WebGL: aproximadamente 556 KB sin comprimir / 141 KB gzip. Solo se solicita cuando hay aceleración suficiente. Instancias reducen las llamadas de dibujo de 369 a 135, conservando 4.432 triángulos en el encuadre inicial.
- Resolución WebGL limitada por DPR y ancho interno máximo de 1.200 px. No hay bucle de render permanente: se dibuja cuando cambia el scroll, el tamaño o la operación.
- Diez WebP originales, cinco encuadres por composición de escritorio/móvil: aproximadamente 402 KB en conjunto. Se exportan del mismo mundo mediante `scripts/render-optical-stills.mjs`. No son imágenes del prototipo inaccesible.
- La alternativa de bajo consumo solicita progresivamente el encuadre actual y el siguiente, mantiene las transformaciones HTML y mezcla las capas según el scroll. Conserva el simulador completo. El movimiento reducido presenta poses discretas.
- Se activa ante ausencia de WebGL, renderizado por software, bajo presupuesto del dispositivo, ahorro de datos o preferencia de movimiento reducido. También existe degradación adaptativa después de cuadros lentos y recuperación funcional ante pérdida del contexto gráfico.
- Fuentes autoalojadas con sus licencias. Sin analítica, fuentes remotas, vídeos de fondo ni grandes secuencias precargadas.

## Mediciones de laboratorio

Resultados detallados en `evidence/v4/performance.json`. Chromium de este entorno identifica gráficos sin aceleración; por eso estas mediciones corresponden a la alternativa 2.5D. No prueban rendimiento de una GPU física.

| Condición | Carga inicial | Recorrido completo | LCP | CLS | Intervalo mediano / p95 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Escritorio 1440×900 | 328 KB | 479 KB | 1,32 s | 0,0018 | 16,7 / 33,4 ms |
| Móvil 390×844, DPR 3, CPU ×4, 1,6 Mbps, RTT 150 ms | 232 KB | 269 KB | 3,02 s | 0,0114 | 16,7 / 33,4 ms |
| Movimiento reducido | 232 KB | 289 KB | 1,25 s | 0,0077 | 16,7 / 33,3 ms |

Son mediciones locales emuladas, no datos de usuarios ni pruebas en teléfonos físicos. El presupuesto automatizado exige menos de 950 KB iniciales y 1,25 MB para todo el recorrido normal, menos de 300 KB en la prueba móvil con movimiento reducido, ningún recurso externo y descanso del renderer cuando no hay cambios. Los WebP se solicitan durante la prueba; sus tamaños no se ocultan tras una puntuación de Lighthouse.

Una medición anterior que forzaba gráficos por software registró intervalos de 100–250 ms. Esa observación motivó la detección temprana y la alternativa original optimizada. El modo WebGL forzado se conserva para verificar geometría, cámara y reversibilidad; no se atribuye el rendimiento del modo ligero al renderizado 3D.

## Verificación funcional y accesibilidad

- Playwright: recorrido continuo, posiciones intermedias, avance y retroceso, identidad de las tres superficies, ejecución, aprobación/rechazo, clasificación manual, entrada inválida, fallo/recuperación, instantánea histórica 503, resultados y navegación comercial.
- EN/ES conserva cámara, entrada y ejecución en memoria, incluso durante un fallo. Los enlaces directos conservan el idioma de su ruta. Recargar descarta la demo, como indica la política de privacidad.
- Cuatro tamaños: 1440×900, 768×1024, 390×844 y 360×740. Pruebas de teclado y axe WCAG 2 A/AA y 2.1 AA en cinco escenas y cuatro rutas, en ambos idiomas.
- Camino sin JavaScript, sin WebGL y con movimiento reducido. Contacto accesible desde la navegación fija.
- Prueba WebGL independiente: hashes de los renders en cinco poses y equivalencia exacta al volver a dos poses anteriores. `evidence/v4/webgl-reversibility.json`.
- El build de producción se rechaza deliberadamente mientras exista la marca de preview. Esto preserva la revisión visual requerida por el propietario.

## Comparación visual

Se capturaron las referencias públicas en `evidence/v4/references`. Scrollytelling aporta composición a pantalla completa, contraste oscuro y luz como elemento narrativo. Santensor utiliza esos principios con un archivo original y una transición a controles editables. No reproduce su cohete, vídeo, métricas comerciales ni recursos.

La captura automatizada de Bruno Simon alcanzó un estado de carga/escena parcial; no acredita una inspección completa de su mundo interactivo. Su referencia de exploración espacial se utiliza como orientación, no como equivalencia de complejidad. El prototipo aprobado devuelve `ERR_NAME_NOT_RESOLVED`; no hay comparación píxel a píxel ni recursos recuperados. La dirección de cristal, estructuras oscuras y luz dorada procede de la descripción del propietario.

La aceptación artística sigue correspondiendo al propietario. No quedan integraciones de IA reales pendientes dentro de esta demo: están explícitamente fuera de su alcance. Permanecen sin verificar teléfonos físicos, lectores de pantalla reales y rendimiento de hardware gráfico físico.
