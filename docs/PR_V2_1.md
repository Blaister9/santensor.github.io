La portada V2 funcionaba, pero su SVG no construía una historia vinculada al scroll. Esta iteración añade tres actos reversibles: documentos fragmentados, interpretación/reglas/API y resultado con fallo recuperable, revisión humana y registro. En escritorio la escena se fija temporalmente; móvil, tableta, movimiento reducido y ausencia de JavaScript conservan capítulos verticales legibles.

El laboratorio mantiene su motor y escenarios existentes, con estados visuales explícitos, conexiones dirigidas, pausa real de animaciones e inspector histórico. Los casos ganan esquemas de arquitectura; contacto mantiene preparación de correo y mejora validación. Todo el contenido nuevo tiene EN/ES. Se conserva HTML estático, Pages, CNAME e historial; no se toca el entrenador ni Railway.

Validación: 13 pruebas unitarias, 20 pruebas Playwright, build y lint. Capturas de tres actos, composiciones en 1440/768/390, vídeo y trazas: [evidence/v2.1/VISUAL_REVIEW.md](https://github.com/Blaister9/santensor.github.io/blob/feat/santensor-v2-experience-i18n/evidence/v2.1/VISUAL_REVIEW.md). El informe describe mediciones sintéticas y sus límites.

Preview publicada: https://santensor-v21-review.easy-chair-5765.chatgpt.site (privada para la cuenta propietaria de ChatGPT). Fuente desplegada: `81ed9187c291fc78e8dcaba6d0f4c2c6d17af2c5`. Estado del proveedor: succeeded. Suite completa local y CI; no se afirma ejecución E2E contra el acceso privado remoto.

CI verificada: https://github.com/Blaister9/santensor.github.io/actions/runs/38930946062 — success. Vídeos y trazas disponibles en el artefacto `site-verification`. Producción conserva el mismo hash de HTML y main no cambia.

Pendiente: revisión artística del usuario. No fusionar con main ni reemplazar santensor.com en esta iteración.
