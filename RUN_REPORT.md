# Santensor V4 publicada y verificada en producci?n

El dominio principal sirve la direcci?n V4 aprobada por el propietario. Comprobaci?n HTTPS: 2026-10-17 UTC (2026-10-16 en Bogot?). Producci?n: [EN](https://santensor.com/) ? [ES](https://santensor.com/es/).

Integraci?n con historial preservado: `4f81e7d07aef97c2e401b6b599a9a7f48e819a0a`. Incorpora la referencia art?stica aprobada `b4be51950948bd7e69234481769d4c2a009b57f4` y la preparaci?n de producci?n `93b0120dc20638a4a86cffa97daabae45019288b`. SHA remoto de main comprobado despu?s del push. El commit posterior de este informe y sus evidencias no modifica la aplicaci?n; su SHA se puede consultar en main y en [release.json](https://santensor.com/release.json).

[GitHub Actions de integraci?n](https://github.com/Blaister9/santensor.github.io/actions/runs/38992588641): **success** en validaci?n y despliegue. Incluye auditor?a de dependencias, lint, 18 unitarias, 12 E2E de preview, 12 E2E del paquete de producci?n y comprobaci?n del artefacto. Pages deployment `7133292118`: **success**, entorno github-pages, URL https://santensor.com/.

La comprobaci?n del dominio valid? el identificador V4/production y el SHA, y compar? mediante SHA-256 el contenido EN/ES, CSS y tres m?dulos JavaScript con el build validado. Evidencia: [deployed-version.json](evidence/v4-production/deployed-version.json). El paquete p?blico contiene 40 archivos y 12 HTML; excluye galer?as, informes, scripts internos, conceptos anteriores y hooks de inspecci?n. Las rutas internas comprobadas responden 404 intencionalmente. Se conservan las advertencias de simulaci?n determinista y datos sint?ticos.

**Pruebas contra HTTPS real: 12/12 aprobadas**, cero omitidas, fallidas o inestables. [Resultado Playwright](evidence/v4-production/https/browser-results.json).

- Cinco escenas, scroll nativo continuo y reversible, permanencia de las tres superficies y transici?n a controles operativos.
- Solicitud editable, ejecuci?n, aprobaci?n y rechazo, fallo 503 controlado, recuperaci?n sin duplicar la recepci?n, historial y exportaci?n real de trazas, reinicio, validaci?n de entrada y revisi?n manual de cuenta desconocida. Cero escrituras externas.
- EN/ES durante un fallo conserva escena, eventos y recuperaci?n. Navegaci?n comercial, laboratorio, casos experimentales identificados y contacto que prepara un borrador real sin afirmar env?o.
- Tama?os 1440?900, 768?1024, 390?844 y 360?740; teclado, movimiento reducido, rutas sin JavaScript y ausencia de bloqueos de scroll/desbordamientos. 72 an?lisis axe WCAG 2/2.1 A/AA: cero violaciones autom?ticas.
- Cero errores cr?ticos JS/consola, recursos ausentes o solicitudes de recursos a otros or?genes en las sesiones observadas. No existe dependencia de un t?nel temporal.
- WebGL ejercitado mediante anulaci?n de detecci?n de GPU solo dentro de la prueba, con cinco capturas distintas; no equivale a hardware gr?fico f?sico. [Capturas](evidence/v4-production/https/) y [evidencia WebGL](evidence/v4-production/https/webgl.json).

**Rendimiento del dominio**: Chromium, sesi?n nueva por perfil, muestra de laboratorio con CPU ?4, RTT 150 ms, descarga 1,6 Mbps, viewport 390?844 y DPR 3. M?vil: LCP **2,356 s**, CLS **0,01145**, transferencia inicial **112.890 bytes**, recorrido **174.826 bytes**; modo 2.5D. Escritorio: LCP 1,444 s. Movimiento reducido: LCP 1,324 s, sin descargar el renderer WebGL. Los presupuestos de recursos pasan. [Medici?n y recursos](evidence/v4-production/performance-https/performance.json).

La comparaci?n local controlada antes/despu?s pas? de LCP 3,016 s a 2,516 s y de 232.088 a 185.599 bytes iniciales; la medici?n HTTPS usa compresi?n del servidor y no se atribuye toda su diferencia al c?digo. La optimizaci?n descubre el primer render en HTML, selecciona su variante m?vil, difiere el siguiente y agrupa m?dulos; no cambia los renders aprobados. Estas muestras no son Core Web Vitals de usuarios reales ni INP de campo.

V?deos reales de producci?n: [escritorio](evidence/v4-production/https/video/desktop.webm) y [m?vil emulado](evidence/v4-production/https/video/mobile.webm), con l?nea temporal, fuente y errores registrados junto a cada v?deo. Incluyen las cinco escenas, operaci?n, fallo, recuperaci?n, regreso entre escenas y navegaci?n comercial.

CNAME santensor.com y HTTPS obligatorio conservados; Pages cambi? de legacy main:/ a workflow para servir exclusivamente dist validado. Consultas A/NS antes y despu?s coinciden; no se escribi? DNS. [Configuraci?n](evidence/v4-production/pages-workflow.json) y [Actions, Pages y DNS](evidence/v4-production/production-deployment.json). No se modificaron el entrenador, Railway, otros repositorios ni credenciales.

**Pendientes y l?mites**: ning?n bloqueo funcional detectado en este alcance. No se realizaron pruebas en tel?fono/GPU f?sicos, lector de pantalla ni redes de campo independientes; las verificaciones son Chromium automatizado y emulaci?n. El contacto prepara borradores y la IA/API son simulaciones expl?citas, conforme a las funcionalidades existentes.

**Restauraci?n**: tag remoto `rollback/pre-v4-production-20261016` ? `84e3c855af9cf112cdfdf4938e6197acdd40fea4`. Revertir la integraci?n mediante `git revert -m 1 4f81e7d07aef97c2e401b6b599a9a7f48e819a0a`, revisar y publicar main sin force-push; restaurar Pages a legacy main:/ conservando el dominio. Procedimiento completo: [V4_PRODUCTION_RELEASE.md](docs/V4_PRODUCTION_RELEASE.md). No se ejecut? rollback sobre producci?n.

---

## Informes anteriores (históricos)

# Informe vigente: Santensor V4

La entrega actual está en [docs/V4_HANDOFF.md](docs/V4_HANDOFF.md). Progreso de los siete hitos: [docs/V4_PROGRESS.md](docs/V4_PROGRESS.md).

El informe que sigue es histórico y corresponde a versiones anteriores.

---

# SANTENSOR V2.1 — informe de ejecución

## Entrega V2.1 · 2026-10-16

Sitio comercial únicamente. Se parte del checkout limpio en `3af1fe3`, se conserva `feat/santensor-v2-experience-i18n` y el PR #3. No se fusiona con main ni se trabaja en el entrenador.

- Narrativa de tres actos, ocho estados, scrubbing GSAP, conexiones y paquetes SVG; pin temporal reversible en escritorio, salida accesible y capítulos verticales en móvil/tableta/movimiento reducido/sin JS.
- Hero editorial con entrada finita; laboratorio con estados reales diferenciados, selección histórica, conexiones dirigidas, progreso y pausa de animaciones. Casos con arquitectura y límites conservados. Contacto prepara un borrador y marca errores, sin envío automático.
- EN/ES completo, cambios de idioma equivalentes, navegación nativa. View Transitions evaluado y retirado tras un aborto observado; no se ocultan errores de consola para aprobarlo.
- Build, lint y **13/13 unitarias** pasan. Suite final local: **20/20 Playwright**, incluyendo las 12 anteriores. Axe sin violaciones A/AA en rutas/tamaños comprobados, estados de scroll reversibles, limpieza responsive, teclado y fallos recuperables.
- Medición sintética local: **LCP 1,3 s, TBT 30 ms, CLS 0,002**. No hay INP medido ni datos de usuarios reales. No se usa Lighthouse como aprobación visual.
- [Revisión visual y evidencias](evidence/v2.1/VISUAL_REVIEW.md): tres actos EN/ES, 1440×900, 768×1024, 390×844, composiciones completas, laboratorio, vídeos y trazas. Trazas disponibles localmente y en artefacto CI, sin duplicarlas en Git.
- [Decisiones de arquitectura y referencias](docs/PRODUCT_V2_1_DECISIONS.md). Se conservan HTML estático, motor, fuentes locales, Pages y CNAME. Solo GSAP y ScrollTrigger como nueva dependencia de movimiento, servidos localmente.
- Preview publicada: https://santensor-v21-review.easy-chair-5765.chatgpt.site — estado `succeeded` confirmado por Sites el 2026-10-16. Es privada para la cuenta propietaria de ChatGPT; no se cambia el acceso ni se genera un token para eludirlo. La suite completa se ejecutó localmente y en CI, no contra el acceso autenticado remoto.
- Preparación: `node scripts/prepare-review.mjs`. No usar `stage-preview.mjs` para esta misión: escribe en el repositorio del entrenador. No se modifica Railway ni DNS ni se contrata un plan de pago.

Pendiente real: aprobación artística del usuario. Se mantienen fuera de alcance el transporte de correo y la inferencia de IA real. La validación local no equivale a auditoría completa con lector de pantalla ni pruebas físicas de dispositivos.

Reproducción: `npm ci`, `npm run build`, `npm run lint`, `npm test`, `npx playwright install chromium`, `npm run test:e2e`. Para rendimiento, establecer `SITE_EVIDENCE_DIR=evidence/v2.1/local` y ejecutar `node scripts/audit.mjs`.

## Publicación V2.1 verificada

- Commit de código y artefacto desplegado: `81ed9187c291fc78e8dcaba6d0f4c2c6d17af2c5` (`feat: complete Santensor V2.1 scroll narrative and interactive states`). Los commits posteriores de informe no cambian el producto desplegado.
- CI de PR: https://github.com/Blaister9/santensor.github.io/actions/runs/38930946062 — **success**. CI de push: https://github.com/Blaister9/santensor.github.io/actions/runs/38930940774 — **success**. Incluyen 13 unitarias y 20 E2E, auditoría de dependencias, lint y build. Vídeos y trazas en el artefacto `site-verification`.
- Detalles de publicación: [deployment.json](evidence/v2.1/deployment.json). Preview EN `/`, ES `/es/`, laboratorio `/labs/` y `/es/labs/`.
- Comprobación HTTPS sin sesión: HTTP 401, coherente con acceso privado. Para revisar la interfaz publicada hay que iniciar sesión con la cuenta propietaria de ChatGPT. No se genera un bypass ni se presenta ese 401 como una prueba de renderizado remoto.
- `preservation-before.json` y `preservation-after.json`: producción HTTP 200, mismo SHA-256 `e004c60d7bb84461a757b5b349ad5781f754838fc3e23503cb3aa6b7b2e03bb5`, main en `84e3c855af9cf112cdfdf4938e6197acdd40fea4`, CNAME `santensor.com`.
- PR #3 preparado para revisión visual; ninguna fusión. La aceptación artística continúa pendiente.
- Empaquetado en Windows con Git Bash y `TAR_OPTIONS=--force-local`, evitando que tar interprete `C:` como host remoto. No se altera el paquete distribuido de GSAP: las observaciones de whitespace de `git diff --check` provienen de sus archivos de proveedor.

---

# Informe histórico V2 (anterior a esta misión)

## Implementado y verificado localmente

- Base pública conservada: `84e3c855af9cf112cdfdf4938e6197acdd40fea4`; trabajo en `feat/santensor-v2-experience-i18n`. Pages continúa configurado en `main:/`, CNAME `santensor.com` y HTTPS activo.
- Diez rutas estáticas EN/ES, selector persistente con prioridad de enlaces directos, equivalencia de rutas/fragmentos, contenido completo y metadatos por idioma.
- Portada «Intelligent Systems in Motion» con fuentes locales licenciadas, escena SVG conectada al motor, disciplinas, estudios, método y contacto. Capturas reales de Playwright de 1440 × 900 y 390 × 844 en `evidence/v2/`.
- Laboratorio determinista con seis etapas, ejecución/pausa/paso/reinicio, inspector histórico, revisión humana, corrección de ruta, rechazo y recuperación de fallo simulado.
- Contacto con correo confirmado, validación bilingüe, consentimiento, honeypot, borrador mailto y copia manual. Ningún éxito de entrega simulado.
- `npm test`: 13 pruebas unitarias pasan, incluidas las cinco originales. `npm run lint` y `npm run build`: pasan. `npm run test:e2e`: 12 pruebas pasan.
- Axe: cero violaciones automáticas A/AA en cinco rutas × dos idiomas × dos tamaños. Se probaron navegación móvil, foco tras Escape, teclado del inspector, ausencia de overflow, errores traducidos, protección ante HTML ingresado y movimiento reducido.

## Pendiente antes de reemplazar producción

- Aprobación visual explícita del usuario. Las capturas son propuestas revisables, no aprobación implícita.
- Transporte de correo servidor autorizado y prueba real de recepción. Se verificó preparación de borrador, no envío ni entrega.
- Backend/modelo/budget y controles para IA real. El laboratorio entregado es una simulación identificada; no llama a un LLM.
- Validación física Samsung/Android del entrenador. Los tests de voz usan mocks y no consumen proveedor.

## Reproducción

`npm ci`, `npm run build`, `npm test`, `npm run lint`, `npx playwright install chromium`, `npm run test:e2e`.

Las capturas sin sufijo `-full` corresponden al viewport exacto. Las capturas `-full` muestran la composición completa. Los JSON de accesibilidad incluyen comprobaciones que requieren revisión manual; cero violaciones automáticas no implica auditoría humana completa.

## Preview y verificación remota

- Preview EN: https://trainer-web-production-f2e9.up.railway.app/commercial-preview/
- Preview ES: https://trainer-web-production-f2e9.up.railway.app/commercial-preview/es/
- Laboratorio: https://trainer-web-production-f2e9.up.railway.app/commercial-preview/labs/
- PR en borrador: https://github.com/Blaister9/santensor.github.io/pull/3
- Fuente desplegada: `7538f8c49ebb409b5e67e5870df2941c4ff71449`, comprobada mediante `/commercial-preview/version.json`.
- CI del commit funcional: https://github.com/Blaister9/santensor.github.io/actions/runs/38920652946 — **success**. Incluye build, lint, audit, 13 unitarias y las 12 E2E completas.
- Suite contra HTTPS: **12/12 pasan** en 1,1 minutos. Resultado completo: `evidence/v2/preview/browser-results.json`. Repite idiomas, rutas, menú móvil, ausencia de JS, lab, contacto, axe y movimiento reducido sobre la preview real.
- Capturas de preview EN/ES: `evidence/v2/preview/home-{en,es}-{1440,390}.png`. `evidence/v2/manifest.json` comprueba 1440 × 900 y 390 × 844, hashes y commit. Se inspeccionaron visualmente escritorio, móvil, página completa y fallo del lab; véase `evidence/v2/VISUAL_REVIEW.md`.
- Revisión móvil adicional: 3/3 pruebas locales después de ampliar etiquetas. Recuperación de entrada inválida durante ejecución: 2/2 pruebas locales EN/ES, además de su inclusión en CI y suite remota final.

El primer ensayo remoto detectó normalización de barras finales por Next.js en el host de preview. Se corrigió en el repositorio anfitrión y se añadió una regresión de rutas, fuentes y errores 404. La suite remota final pasa sin relajar sus aserciones de URL.

`evidence/v2/preservation-before.json` y `preservation-after.json` registran HTTP 200 y el mismo SHA-256 del HTML de producción: `e004c60d7bb84461a757b5b349ad5781f754838fc3e23503cb3aa6b7b2e03bb5`. `main` sigue en `84e3c855af9cf112cdfdf4938e6197acdd40fea4`; `CNAME` y el workflow de publicación no cambian. Esto es evidencia puntual, no una garantía de disponibilidad continua. Hubo fallos transitorios de resolución DNS en comandos del equipo de ejecución; las comprobaciones posteriores terminaron correctamente.

No se ha fusionado esta rama ni sustituido el sitio comercial publicado. Los commits posteriores al de fuente despliegan únicamente informes y evidencias en GitHub; no representan otra versión del producto.

Comando remoto: establecer `SITE_TEST_URL=https://trainer-web-production-f2e9.up.railway.app`, `SITE_PATH_PREFIX=/commercial-preview` y `SITE_EVIDENCE_DIR=evidence/v2/preview`, y ejecutar `npm run test:e2e`. Ejecutar `node scripts/verify-preview.mjs after` y `node scripts/evidence-manifest.mjs` para las verificaciones complementarias.
