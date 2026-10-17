# Santensor V4 — promoción autorizada a producción

## Base y restauración

El propietario aprobó expresamente la dirección V4 y su integración en `main`. Referencia aprobada: `b4be51950948bd7e69234481769d4c2a009b57f4`.

La auditoría comenzó con checkout limpio en esa referencia. `origin/main` era `84e3c855af9cf112cdfdf4938e6197acdd40fea4` y es ancestro de V4. Se publicó y verificó el tag anotado `rollback/pre-v4-production-20261016` apuntando al main anterior, antes de preparar la promoción.

Pages: publicación legacy desde `main:/`, dominio `santensor.com`, HTTPS obligatorio y certificado aprobado para el dominio y `www`. El entorno `github-pages` permite exclusivamente la rama `main`. Evidencia de estado previo y consultas DNS de solo lectura: `evidence/v4-production/before.json`.

## Preparación

- El build por defecto y `build:production` generan la versión aprobada para producción. `build:preview` mantiene noindex y los controles de inspección para las pruebas existentes.
- Los controles editoriales siguen rechazando previews, marcadores sin resolver, enlaces a túneles y contenido interno. Dos pruebas nuevas comprueban que ambos modos permanecen separados.
- La producción elimina el texto y la etiqueta de preview. Los avisos de reglas deterministas, solicitudes ficticias, herramientas simuladas y borradores de correo se conservan.
- El paquete público se genera por lista permitida: diez rutas EN/ES, errores localizados, CNAME, sitemap, robots, dos módulos de interfaz agrupados, renderer opcional, fuentes licenciadas y diez renders propios. No incluye `evidence`, `review`, `docs`, scripts, pruebas, conceptos anteriores, herramientas ni configuración privada.
- Los hooks globales de inspección se eliminan al compilar producción. Las pruebas públicas usan controles, trazas exportadas y DOM real, sin depender de esos hooks.
- El primer encuadre óptico se descubre desde HTML con variante móvil. El siguiente se solicita al comenzar su transición. Los módulos de interfaz se agrupan para evitar cadenas de descarga. Se conserva la detección de aceleración, la alternativa 2.5D, las poses reducidas y el renderer bajo demanda.
- Actions valida preview y producción por separado. El despliegue de Pages depende de la validación y publica exclusivamente `dist`, solo desde `main`. Cambiar `build_type` a `workflow` conserva CNAME, HTTPS y DNS.

## Validación

Los resultados locales, de CI y de HTTPS se incorporan a `RUN_REPORT.md` y `evidence/v4-production`. No se declara la publicación hasta que el dominio entregue V4 y su identificador de commit.

Comandos de reproducción:

```sh
npm ci
npm audit
npm run lint
npm test
npm run build:preview
npm run test:e2e
npm run build:production
npm run check:production
npm run test:e2e:production
```

Para probar producción: establecer `SITE_TEST_URL=https://santensor.com` y `SITE_EVIDENCE_DIR=evidence/v4-production/https`, y ejecutar `npm run test:e2e:production`. Para rendimiento se utiliza `scripts/measure-v4.mjs` con las mismas variables y una carpeta propia. Sus resultados emulados no equivalen a validación en hardware físico.

## Restauración si aparece una incidencia grave

1. Identificar el commit de integración V4 en `RUN_REPORT.md` o `git log --merges main`.
2. Con checkout limpio y main actualizado: `git revert -m 1 <commit-de-integración-V4>`. Resolver y revisar el revert; conservar cualquier trabajo posterior que no deba revertirse. Publicar con `git push origin main`, sin force-push.
3. Como el main anterior utilizaba Pages legacy y su workflow no despliega artefactos, en Settings → Pages restaurar **Deploy from a branch**, **main**, **/(root)**. No editar Custom domain ni DNS. Alternativa por REST autenticado: `PUT /repos/Blaister9/santensor.github.io/pages` con `{"build_type":"legacy","source":{"branch":"main","path":"/"}}`.
4. Comprobar el build de Pages, HTTPS, rutas y contenido servido. El tag remoto `rollback/pre-v4-production-20261016` conserva el árbol anterior para comparar.

La restauración no se ha ejecutado contra producción durante esta promoción. No requiere cambios en el entrenador, Railway, credenciales o DNS.
