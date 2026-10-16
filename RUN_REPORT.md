# SANTENSOR V2 — informe de ejecución

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

La preview, commits, PRs y resultados remotos se registrarán tras comprobarlos. No se ha fusionado esta rama ni sustituido el sitio comercial publicado.
