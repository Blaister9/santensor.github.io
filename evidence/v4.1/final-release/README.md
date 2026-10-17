# V4.1 — evidencia final

Capturas de Chromium con tamaños emulados. No constituyen pruebas físicas de hardware, tacto, teclado virtual, lectores de pantalla ni voz. La portada mantiene la dirección artística y las cinco escenas aprobadas.

| Comprobación | Evidencia |
| --- | --- |
| Portada ES, 360 × 740 | [Antes](before-es-360.png) · [Después](candidate/after-es-360.png) |
| Portada EN, 1440 × 900 | [Antes](before-en-1440.png) · [Después](candidate/after-en-1440.png) |
| Casos y presentación comercial | [EN](candidate/en-cases-1440.png) · [ES](candidate/es-cases-1440.png) |
| Contacto al terminar los casos | [ES móvil](candidate/cases-contact-es-360.png) · [EN escritorio](candidate/cases-contact-en-1440.png) |
| Nota de procesos localizada | [EN](candidate/note-workflow-en-js-true.png) · [ES](candidate/note-workflow-es-js-true.png) |
| Nota de arquitectura localizada | [EN](candidate/note-portfolio-en-js-true.png) · [ES](candidate/note-portfolio-es-js-true.png) |
| Nota del entrenador localizada | [EN](candidate/note-trainer-en-js-true.png) · [ES](candidate/note-trainer-es-js-true.png) |
| Resultado real conservado | [EN](candidate/lab-result-en.png) · [ES](candidate/lab-result-es.png) |
| Pruebas de navegador locales | [33 aprobadas](candidate/browser-results.json) |
| Destinos externos y contenido de fuentes | [Informe](candidate/external-links.json) |
| Conservación y restauración | [SHA, tag y hashes](preservation.json) · [Pages previo](pages-before.json) |
| Posiciones computadas antes del cambio | [Rectángulos EN/ES](baseline.json) |

Las pruebas locales se ejecutaron sobre el árbol que dio lugar al commit de correcciones. Su build local conserva el SHA anterior en `release.json` porque se construyó antes de crear el commit. El CI del candidato vuelve a construir y probar desde un checkout del SHA exacto; sus resultados se publican en el artefacto `v4-production-verification` de GitHub Actions. La identidad del despliegue final se obtiene de [release.json](https://santensor.com/release.json), que enlaza su ejecución de CI.

Las regresiones de idioma utilizan clic nativo, desplazamiento al encabezado español/inglés y retroceso, con JavaScript activado y desactivado. No se coloca artificialmente el foco para el skip link. La comprobación externa verifica tanto el destino GitHub como el contenido bruto fijado al commit; no acepta únicamente HTTP 200.
