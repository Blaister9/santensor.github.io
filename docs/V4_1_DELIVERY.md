# Santensor V4.1 — entrega y verificación de producción

## HECHO

- Santensor conserva la dirección artística y las cinco escenas de V4. E. Santiago Paz, Ingeniero Mecatrónico, está autorizado e incorporado en EN/ES, metadatos y datos Person/WebSite. No quedan datos de identidad por autorizar ni placeholders públicos.
- El laboratorio muestra el resultado de la ejecución real sin perder solicitud ni historial. El skip link funciona con Tab → Enter → Tab, sin foco artificial en la prueba. El 404 estático se localiza por ruta con JavaScript y ofrece recuperación bilingüe sin JavaScript.
- La portada explica IA, software e integraciones y ofrece proyectos y contacto directamente. Los tres casos distinguen dos desarrollos públicos independientes y el entrenador privado en desarrollo. Las fichas comerciales resumen las limitaciones; las notas conservan el detalle técnico.
- Los enlaces a fuentes usan el snapshot permanente **ae65c593f0d5b6a0bf291d25628791efb2a5e614**, que contiene las implementaciones y regresiones citadas. No dependen de la rama de desarrollo. Las notas se regeneran en cada build desde `scripts/v41-evidence-pages.mjs`; la revisión privada previa permanece como evidencia histórica y no se repite durante el build.
- Proyectos EN abre `#en` y proyectos ES abre `#es` en las tres notas. Los anclajes nativos funcionan sin JavaScript, muestran el encabezado correspondiente y conservan el retroceso del navegador.
- Contacto al final de los casos en ambos idiomas. Se mantiene el correo autorizado, con mailto y copia de dirección, sin simular entrega ni incorporar servicios externos.
- Texto operativo legible, controles táctiles de al menos 44 px y revisión humana/recuperación visibles. No se reprodujo solapamiento de las acciones de portada a 360 × 740, 390 × 844 o 1440 × 900. Se conserva su composición.
- CNAME, DNS, configuración de Pages, Railway y entrenador preservados. La única ampliación del pipeline comprueba enlaces públicos de evidencia. No se usa GitHub CLI ni force-push.

## EVIDENCIADO

- Código de las correcciones: **b48169d47a2e984f2bac6ef1952e42f57f6e7036**; [CI 39009382327: aprobado](https://github.com/Blaister9/santensor.github.io/actions/runs/39009382327). Pasaron 18 pruebas unitarias, 12 de preview, 33 de producción y la comprobación externa de evidencia. El despliegue se omitió por ser una rama de desarrollo. El commit posterior de informe/capturas se valida nuevamente antes de integrar; el SHA de producción y su CI definitivo se consultan en `release.json`.

- Rama de integración: `feat/santensor-v4-ux-hardening`. Punto inicial: `ae65c593f0d5b6a0bf291d25628791efb2a5e614`.
- Restauración: [rollback/pre-v4.1-production-20261017](https://github.com/Blaister9/santensor.github.io/tree/rollback/pre-v4.1-production-20261017), tag anotado cuyo destino es **821c4d66abd04c59ed0f29cd3ac07c20a00c30f1**, el `main` previo a V4.1.
- Se ejecutan 18 pruebas unitarias, 12 de preview y 33 de producción. Seis regresiones nuevas cubren destinos técnicos localizados con/sin JavaScript, desplazamiento, retroceso, contacto, referencias permanentes y separación de controles. La comprobación externa verifica siete destinos GitHub y el contenido real de seis archivos fijados al SHA.
- Matriz EN/ES: 1440 × 900, 1363 × 936, 768 × 1024, 390 × 844 y 360 × 740. Incluye axe, teclado real, cinco escenas, laboratorio, revisión humana, clasificación manual, fallo 503 y recuperación, enlaces internos, recursos, metadatos y contacto. Se comprueban errores atribuibles al sitio y desbordamiento horizontal.
- Capturas antes/después y recorridos en [evidence/v4.1/final-release](../evidence/v4.1/final-release/). El workflow publica también el artefacto `v4-production-verification` con resultados y capturas del candidato exacto. No se atribuyen resultados CSS/SwiftShader a una GPU física.
- Producción: [EN](https://santensor.com/) · [ES](https://santensor.com/es/) · [proyectos ES](https://santensor.com/es/cases/) · [laboratorio ES](https://santensor.com/es/labs/) · [contacto](https://santensor.com/es/contact/).
- Identificación verificable del despliegue: [release.json](https://santensor.com/release.json) publica el SHA servido y la URL de su ejecución de GitHub Actions. El éxito de una ejecución anterior no sustituye el CI del candidato definitivo.
- La integración solo se publica después de CI satisfactorio para el SHA exacto de la rama. Después se comprueban de nuevo el CI y despliegue del SHA de `main`, el `release.json` servido y las rutas HTTPS. `scripts/verify-v41-release.mjs` falla si discrepan SHA remoto, SHA servido, workflow, validación o despliegue.

Reproducción:

```sh
npm ci
npm audit
npm run lint
npm test
npm run build:preview
npm run test:e2e
npm run build:production
npm run check:production
npm run test:links
npm run test:e2e:production
```

Smoke contra producción, después del despliegue (sustituir `<SHA_MAIN>` por el commit integrado):

```sh
node scripts/verify-v41-release.mjs <SHA_MAIN>
# PowerShell: $env:SITE_TEST_URL='https://santensor.com'
# POSIX: export SITE_TEST_URL=https://santensor.com
npm run test:e2e:production
```

El build es estático y reproducible. Producción utiliza GitHub Pages, sin depender de previews o túneles temporales. No se ha reconfigurado infraestructura para esta entrega.

## PENDIENTE

- Comprobación en dispositivos físicos de tacto, teclado virtual, lectores de pantalla y rendimiento de GPU. La emulación de navegador no sustituye estas validaciones.
- En el entrenador: audio físico y utilidad de la evaluación. Se mantiene como producto privado en desarrollo; no se realizaron modificaciones ni nuevas llamadas a proveedores.

## BLOQUEADO

Ninguna dependencia externa identificada impide las correcciones. El correo directo no necesita infraestructura nueva. Un formulario con entrega mediante backend queda fuera del alcance autorizado.
