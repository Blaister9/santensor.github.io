# Santensor V4 — entrega para revisión

## Acceso

- Experiencia EN: https://eos-luis-subsidiaries-equation.trycloudflare.com/
- Experiencia ES: https://eos-luis-subsidiaries-equation.trycloudflare.com/es/
- Galería de evidencia: https://eos-luis-subsidiaries-equation.trycloudflare.com/review/
- Rama: https://github.com/Blaister9/santensor.github.io/tree/feat/santensor-v4-cinematic-continuous
- Versión de la copia servida: https://eos-luis-subsidiaries-equation.trycloudflare.com/version.json

La URL es una preview pública temporal de Cloudflare Quick Tunnel. Requiere mantener este equipo conectado y los procesos de servidor/túnel activos. No cambia producción ni ofrece disponibilidad permanente. Todos los recursos de la experiencia, sus fuentes y las pruebas están versionados en GitHub; el túnel no es una dependencia del producto.

## Recorridos reales

- [Escritorio](https://eos-luis-subsidiaries-equation.trycloudflare.com/review/video/desktop.webm): cinco escenas, inspección contextual, EN/ES, edición de solicitud, revisión humana, fallo 503, recuperación, resultado, retroceso y navegación comercial.
- [Móvil emulado](https://eos-luis-subsidiaries-equation.trycloudflare.com/review/video/mobile.webm): el mismo recorrido con composición vertical y selección de las superficies funcionales.
- [WebGL forzado](https://eos-luis-subsidiaries-equation.trycloudflare.com/review/video/desktop-webgl.webm): cámara y geometría procedural durante todo el recorrido. Se grabó en Chromium con gráficos por software; no representa una GPU física.

Las cronologías, modo de render y tamaños están junto a cada vídeo en JSON. Las capturas de las cinco escenas y de error/recuperación están en `evidence/v4/scenes` y en la galería. Los vídeos no son un recurso del sitio ni sustituyen al scroll: son grabaciones de aceptación.

## Resultado técnico

El archivo se abre y separa en capas; una arquitectura con seis componentes interpreta la misma composición; tres superficies persistentes se alinean y se convierten en entrada editable, proceso y evidencia. La última escena conserva la evidencia y permite explorar tres especialidades. El visitante puede llegar directamente a laboratorio, proyectos y contacto desde la cabecera, también en móvil.

El simulador conserva su motor previo. Ejecuta reglas y una herramienta local, requiere decisión humana, impide aprobar solicitudes desconocidas, registra resultados en memoria y permite inspeccionar la respuesta 503 después de recuperarla. Las superficies y el estado se conservan al avanzar, retroceder y cambiar EN/ES. Recargar o abandonar el documento descarta la demo local.

La IA, la recuperación indexada y la predicción son componentes conceptuales identificados como tales. No se afirma inferencia real. Los casos conservan sus categorías de prototipo experimental y reconstrucción. No se añadieron clientes, certificaciones, resultados comerciales ni métricas de negocio.

## Validación y recursos

- 16 pruebas unitarias y 12 pruebas Playwright aprobadas en la revisión local final.
- Matriz EN/ES de cinco escenas y cuatro rutas a 1440×900, 768×1024, 390×844 y 360×740: 72 análisis axe sin infracciones detectadas, además de teclado y ausencia de desbordamiento horizontal.
- Pruebas de scroll continuo, poses intermedias, identidad de los tres elementos HTML y reversibilidad exacta del render WebGL. Pruebas reales de entrada, ejecución, rechazo/aprobación, clasificación manual, errores y recuperación.
- Verificación HTTPS de rutas, simulación, reproducción de los tres vídeos mediante controles nativos, enlaces de la galería y aislamiento de `/.git/config`, `/.env`, `/CNAME` y logs locales. Evidencia: `evidence/v4/https-verification.json`.
- Medición móvil emulada bajo CPU ×4 / 1,6 Mbps / RTT 150 ms: aproximadamente 232 KB iniciales, 269 KB durante el recorrido, LCP 3,02 s, CLS 0,0114. Corresponde a la alternativa 2.5D, no al render 3D.
- El paquete WebGL minificado ocupa aproximadamente 556 KB, 141 KB gzip. La alternativa solicita poses WebP originales progresivamente y evita descargar el renderer cuando detecta gráficos por software o preferencias de bajo consumo. El renderer descansa cuando no cambia la escena.
- `npm audit`: sin vulnerabilidades. El build de producción sigue bloqueado deliberadamente por la marca de preview.

Detalles: [recursos y validación](V4_RESOURCES_AND_VALIDATION.md), [progreso por hitos](V4_PROGRESS.md), [preservación](../evidence/v4/preservation.json).

## Reconstrucción

Node.js 22 y npm:

```sh
git switch feat/santensor-v4-cinematic-continuous
npm ci
npm run build
node scripts/serve-v4.mjs
npm test
npm run test:e2e
```

La preview local usa `http://127.0.0.1:4180`. Para regenerar recursos de bajo consumo, con el servidor activo: `node scripts/render-optical-stills.mjs`, seguido de otro build. Para grabar: `node scripts/record-v4-tour.mjs`; se puede pasar `mobile`, `desktop` o `desktop-webgl`. Después: `node scripts/gallery-v4.mjs` y `node scripts/package-v4-preview.mjs`.

En Windows, `scripts/start-v4-preview.ps1` prepara una copia estática aislada y crea un túnel gratuito en el puerto 4181. Descarga cloudflared oficial si no existe; deja las herramientas y los logs en `.local`, excluidos de Git. La URL nueva aparece en `.local/v4-tunnel.log` y cambia al crear otro túnel. El servidor solo expone `.local/v4-share`, nunca el checkout.

## Preservación y pendientes reales

`main` permanece en `84e3c855af9cf112cdfdf4938e6197acdd40fea4`. `CNAME`, el motor del simulador, el módulo de contacto y la identidad de Sites permanecen iguales a la base. No se usó GitHub CLI, force-push, merge, DNS, Railway, el entrenador ni servicios de pago. La observación de producción devuelve HTTP 200.

No hay bloqueos funcionales conocidos en los escenarios probados. Quedan fuera de la evidencia las pruebas en teléfono físico, GPU física y lector de pantalla real. El prototipo temporal aprobado no pudo recuperarse: su dominio no resuelve. La captura de Bruno Simon solo documenta una escena parcial de carga; no una auditoría completa de su interactividad.

La aceptación artística corresponde al propietario. Esta entrega permanece en la rama de desarrollo y no se ha convertido en producción.
