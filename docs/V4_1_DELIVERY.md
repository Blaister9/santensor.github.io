# Santensor V4.1 — entrega para revisión

Actualización del 17 de octubre: [identidad profesional confirmada de E. Santiago Paz](V4_1_IDENTITY.md), con metadatos, capturas y validación propios. El informe siguiente conserva la referencia de aceptación inicial; la actualización identifica el código posterior.

## HECHO

- El laboratorio conserva la solicitud y la ejecución. «Explorar el resultado» selecciona la decisión real incluso después de inspeccionar un evento histórico, sin abandonar el laboratorio.
- El skip link traslada el foco de forma síncrona. La regresión ejecuta Tab → Enter → Tab sin colocar el foco desde la prueba ni esperar entre Enter y Tab.
- Un único 404 estático reproduce GitHub Pages: localización por ruta con JavaScript; recuperación bilingüe y enlaces a ambos inicios sin JavaScript. Los enlaces de regreso están probados.
- La portada conserva las cinco escenas y explica aplicaciones con IA, software web, APIs y automatización. Presenta las tres disciplinas y accesos directos a proyectos/evidencia y contacto.
- Los casos distinguen el laboratorio de automatización, el portafolio como desarrollo de software y el entrenador privado en desarrollo. Incluyen problema, solución, contribución, arquitectura, evidencia y límites. Hay capturas reales, demostraciones, código público y notas técnicas. La captura del entrenador muestra una práctica sintética existente, sin datos de usuarios.
- Campos de 16 px, etiquetas/texto operativo de 14 px y botones de al menos 44 px en el laboratorio. Revisión humana y recuperación preceden a la cronología; exportar e inspeccionar resultados están al principio del panel.
- Contacto mediante correo confirmado y copia de dirección, sin formulario ni paso intermedio. No se afirma envío ni se incorpora backend.
- HTML generado con títulos/descripciones por ruta, canonical, hreflang EN/ES, Open Graph, Twitter Card, imagen social original de 1200 × 630 y WebSite y Person estructurados, con nombre y título autorizados. Sin datos de organización no confirmados.

## EVIDENCIADO

- Rama: [feat/santensor-v4-ux-hardening](https://github.com/Blaister9/santensor.github.io/tree/feat/santensor-v4-ux-hardening).
- Implementación validada: **23087eaee0e986252c2f0ab693bbb814815026e3**. El commit posterior de entrega incorpora documentación, capturas, utilidades de revisión y HTML generado; conserva el comportamiento validado.
- [CI de implementación: aprobado](https://github.com/Blaister9/santensor.github.io/actions/runs/38996211663). Despliegue omitido por la condición exclusiva de main. El workflow ofrece un artefacto de build para revisión.
- [Preview EN](https://eos-luis-subsidiaries-equation.trycloudflare.com/) · [Preview ES](https://eos-luis-subsidiaries-equation.trycloudflare.com/es/) · [Antes/después y vídeos](https://eos-luis-subsidiaries-equation.trycloudflare.com/review/).
- [Resultado del laboratorio independiente EN/ES](https://eos-luis-subsidiaries-equation.trycloudflare.com/review/tour/video/laboratory.webm). La galería también contiene recorridos de las cinco escenas en escritorio y móvil emulado.
- **18 pruebas unitarias, 12 Playwright de preview y 27 de producción aprobadas.** El archivo nuevo contiene 14 pruebas de defectos, claridad comercial, tipografía computada, controles, enlaces, metadatos, evidencia y contacto.
- Matriz EN/ES: 1440 × 900, 1363 × 936, 768 × 1024, 390 × 844 y 360 × 740. Axe sin violaciones detectadas en las comprobaciones ejecutadas. Sin desbordamiento horizontal ni errores atribuibles al sitio en esos recorridos. Revisión visual y capturas de las rutas modificadas.
- HTTPS comprobado en escritorio y móvil emulado: teclado rápido, resultado con estado conservado, proyectos, contacto, reproducción nativa de los tres vídeos y 404 con/sin JavaScript. Rutas sensibles devuelven 404.
- Recursos iniciales locales medidos por separado: aproximadamente **267 KB en 2.5D y 823 KB en WebGL forzado**. Este último utilizó SwiftShader, 135 draw calls y 4432 triángulos. No son mediciones de GPU física ni un benchmark de red de producción; los tiempos de navegación incluyen automatización.
- main permanece en **821c4d66abd04c59ed0f29cd3ac07c20a00c30f1**. Producción responde 200 y su hash HTML coincide con el observado antes del push. CNAME, identidad de Sites y motor del workflow intactos. Sin cambios en DNS, Pages, Railway ni el entrenador. Historial conservado; publicación mediante Git, sin force-push ni GitHub CLI.

Resultados: [evidence/v4.1](../evidence/v4.1/). Las rutas personales del equipo se sustituyen por `<workspace>` en los informes JSON. No se distribuyen credenciales, conversaciones reales ni material institucional.

```sh
npm ci
npm test
npm run lint
npm run build:preview
npm run test:e2e
npm run build:production
npm run check:production
npm run test:e2e:production
```

Preview local del build: `npm run preview` → http://127.0.0.1:4173. La copia aislada existente se sirve en http://127.0.0.1:4181 y mediante el túnel autorizado. Es temporal y depende del equipo; no se modificó alojamiento para obtener un enlace. `/version.json` distingue el commit del build del commit de evidencia/revisión.

## PENDIENTE

- Identidad pública confirmada e incorporada: E. Santiago Paz, Ingeniero Mecatrónico, con posicionamiento AI & Software Engineering, experiencia técnica y colaboración remota autorizadas. No quedan datos de identidad pendientes. Véase la [lista editorial](V4_1_EDITORIAL_REVIEW.md).
- Revisión del nuevo contenido comercial y composición por el propietario antes de sustituir producción. **No se declara production-ready ni se fusiona con main.**
- Pruebas físicas de tacto, teclado virtual, lector de pantalla y GPU. La evidencia del entrenador no valida físicamente voz ni utilidad de evaluación.

## BLOQUEADO

Ninguna dependencia externa impide revisar los entregables. La identidad profesional requiere información autorizada antes de cerrar su presentación definitiva. Un eventual formulario con entrega real exigiría autorización y revisión independiente de infraestructura, privacidad y spam; queda fuera de esta implementación.
