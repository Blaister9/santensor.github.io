# Santensor V3 — acceso para revisión

Verificado el 16 de octubre de 2026. Sin modificaciones visuales ni nuevas funcionalidades del producto en esta entrega.

## Enlaces

- Concepto A EN: https://futures-regular-antiques-operator.trycloudflare.com/
- Concepto A ES: https://futures-regular-antiques-operator.trycloudflare.com/es/
- Concepto B EN: https://futures-regular-antiques-operator.trycloudflare.com/concept-b/
- Concepto B ES: https://futures-regular-antiques-operator.trycloudflare.com/es/concept-b/
- Galería: https://futures-regular-antiques-operator.trycloudflare.com/review/
- Rama: https://github.com/Blaister9/santensor.github.io/tree/feat/santensor-v3-independent

Preview temporal pública mediante Cloudflare Quick Tunnel. No requiere herramientas de desarrollo ni autenticación. Depende de que este equipo siga encendido, conectado y con los dos procesos de publicación temporal activos. No es alojamiento permanente ni tiene garantía de disponibilidad. Reiniciar el túnel puede cambiar la URL.

## Comprobaciones

- Commit de implementación: `dcfb6b41066201fb461d265e181554615cf3fc11`, subido con `git push` directamente. Sin GitHub CLI, force-push, merge ni PR nuevo. CI de ese commit: https://github.com/Blaister9/santensor.github.io/actions/runs/38952869016 — aprobado.
- Las 23 pruebas de navegador existentes pasan contra el origen HTTPS, incluyendo EN/ES, menús móviles, navegación por idioma, capítulos, simulación, revisión humana, recuperación de errores y borrador de contacto. Resultado: `public-navigation-results.json`.
- A/B EN/ES devuelven HTTP 200 en Chromium a 1440 × 900 y 390 × 844. Fuentes cargadas y sin errores de JavaScript o recursos en esas comprobaciones.
- Enlaces y recursos enlazados de la galería responden HTTP 200. Incluye capturas completas de A y B en escritorio/móvil, comparativas V2.1/V3 y cuatro vídeos. Reproducción comprobada con los controles nativos mediante teclado, sin invocar `video.play()`.
- Evidencia de acceso: `access-check.json`. La comprobación web remota de texto no pudo abrir el túnel; la verificación HTTPS sí se realizó con Chromium limpio y peticiones HTTP normales. No se afirma validación desde una segunda conexión de Internet o dispositivo físico.
- No se expone el repositorio: sólo una copia estática en `.local/v3-share`. `/CNAME`, `/.git/config` y `/.env` devuelven 404. `robots.txt` impide indexación; el sitio conserva su marca de preview y sus bloqueos editoriales.
- Lint, 16 pruebas unitarias y build de preview aprobados. No se cambiaron estilos, escenas ni copy del producto para esta publicación temporal.

## Procesos

| Proceso | Puerto / PID al verificar | Función | Mantener |
| --- | --- | --- | --- |
| `node scripts/serve.mjs` | 4173 / 70700 | Preview local V3 en `dist` | Opcional para HTTPS; conservado para revisión local |
| `node scripts/serve.mjs` | 4174 / 34516 | Baseline V2.1 original | Opcional para HTTPS; conservado para comparación local |
| `node scripts/serve.mjs` | 4175 / 15076 | Galería local `evidence/v3` | Opcional para HTTPS; conservado para revisión local |
| `node scripts/serve.mjs` | 4176 / 52292 | Copia estática aislada con sitio y galería | Necesario para los enlaces HTTPS |
| `cloudflared.exe tunnel ...` | PID 12524 | Túnel HTTPS hacia 4176 | Necesario para los enlaces HTTPS |

Los tres primeros son los tres terminales originalmente señalados. No se ha cerrado ninguno. Los otros dos se añadieron para esta entrega temporal; sus PIDs son informativos y cambian al reiniciarlos.

## Preservación

Comprobación antes/después en `preservation-check.json`:

- `main` sigue en `84e3c855af9cf112cdfdf4938e6197acdd40fea4`.
- GitHub Pages sigue en `main:/`, build legacy, HTTPS obligatorio y CNAME `santensor.com`. Su configuración se consultó por API en modo lectura.
- `https://santensor.com/` responde 200 y su HTML conserva el mismo hash antes y después del push.
- Registros A y NS del dominio sin cambios observados. No se ejecutaron operaciones de escritura de DNS.
- `CNAME`, `.openai/hosting.json`, `js/workflow.mjs` y `js/contact.mjs` no cambiaron respecto a la base V2.1.
- Entrenador limpio antes/después y HEAD intacto: `2a72d2e88d0e7b1dbe4aa2b8dbacfe9ebfcdc156`. No se utilizó `stage-preview.mjs`, ni se desplegó en Railway.

No hay bloqueo de acceso detectado en Chromium. La única dependencia operativa es mantener activo el equipo y el túnel temporal. La aceptación artística permanece pendiente del propietario.
