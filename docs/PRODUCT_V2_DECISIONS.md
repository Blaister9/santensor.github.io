# Santensor V2 — decisiones de producto

## Base conservada

Se parte del sitio existente en `84e3c855af9cf112cdfdf4938e6197acdd40fea4`, con CI exitoso y GitHub Pages publicado desde `main:/`. Se conservan Git, los recursos previos, el motor de simulación original y sus cinco pruebas, `CNAME=santensor.com`, DNS, TLS y la configuración de publicación. La rama de trabajo es `feat/santensor-v2-experience-i18n`.

El entrenador se trabaja en su repositorio privado, desde la rama avanzada que ya contiene autenticación, controles de consumo, voz, historial y consentimiento. Partir de su `main` habría descartado esas mejoras. No se incorporan sus secretos ni su código privado al repositorio público.

## Arquitectura incremental

Se mantiene HTML estático, CSS y módulos JavaScript nativos. `scripts/render-pages.mjs` genera los HTML de ambos idiomas desde `js/i18n.mjs`; `npm run build` regenera el árbol fuente y `dist`. El árbol fuente sigue siendo publicable por el mecanismo existente de Pages. No se cambia de framework ni se añade servidor al sitio comercial.

Las rutas son `/`, `/labs/`, `/cases/`, `/contact/`, `/privacy/` y sus equivalentes bajo `/es/`. El enlace abierto decide el idioma; no hay redirección automática basada en preferencias. El selector guarda `santensor-language`, mantiene la ruta semántica y el fragmento, y funciona como enlace incluso sin JavaScript. La navegación posterior permanece en el idioma elegido. Esta prioridad evita que una preferencia antigua altere enlaces compartidos o SEO.

Cada página tiene `lang`, título, descripción, canonical, alternates EN/ES y x-default. El sitemap contiene las diez rutas. Los errores de formulario y laboratorio se traducen en el mismo catálogo. Los nombres técnicos de protocolos y campos JSON pueden conservar su sintaxis original.

## Dirección visual

Paleta midnight `#080F19`, superficie `#122232`, marfil `#F3F5F0`, lima `#C9FA63` y cian `#72D8F2`. Space Grotesk para titulares, Inter para texto e IBM Plex Mono para datos. Se alojan archivos WOFF2 locales y se incluyen las tres licencias SIL OFL; no se llama a Google Fonts.

La composición combina un titular asimétrico con una escena SVG interactiva. Las conexiones cambian con las transiciones; el movimiento se activa al ejecutar y se detiene al pausar, fallar o esperar a una persona. Las órbitas identifican la etapa de comprensión. La escena y el laboratorio comparten el motor; no son animaciones desconectadas de la lógica. `prefers-reduced-motion` elimina animaciones y conserva toda la funcionalidad. No se añade WebGL.

La página continúa con tres disciplinas de igual jerarquía, un acceso prioritario al proceso, tres estudios honestamente rotulados, el método de trabajo y contacto. Se emplean filas, trazas, tipografía y secciones alternas, sin convertir la portada en una cuadrícula de tarjetas.

## Laboratorio y límites

`js/workflow.mjs` incorpora una máquina de seis etapas conservando la API anterior. Las transiciones producen instantáneas inspeccionables. Los ejemplos cubren éxito, ambigüedad y fallo 503 recuperable. Una solicitud desconocida no puede aprobarse: se rechaza o se deriva explícitamente a revisión manual. No hay escrituras externas, llamadas a modelos ni envío de mensajes.

La clasificación usa patrones EN/ES. La indicación de coincidencia describe reglas, nunca una probabilidad de IA inventada. La autenticación de herramienta es ficticia y se identifica como validación local. El inspector ofrece entrada, regla, solicitud/respuesta de herramienta, responsable y resultado. La línea temporal admite Tab, flechas, Inicio y Fin.

IA real permanece deshabilitada. Para habilitarla faltan backend seguro autorizado, clave de proyecto, presupuesto explícito, límites persistentes de consumo, validación de salida, CORS restrictivo, registro sin datos personales y corte de gasto. Esta iteración no afirma entregar inferencia real.

## Contacto

El usuario confirmó `santiagopazbedoya@gmail.com` durante esta ejecución. Se eliminan los Issues de GitHub como canal comercial. El formulario valida nombre, email, mensaje y consentimiento, incluye honeypot y prepara un `mailto:` codificado; el visitante revisa y envía desde su cliente de correo. Ofrece copia manual y un enlace directo al destinatario confirmado.

No hay transporte de correo servidor autorizado. No se envió un mensaje de prueba ni se verificó entrega. La interfaz expresa que preparar un borrador no equivale a enviarlo. El honeypot solo protege este flujo local; no se presenta como protección suficiente para un futuro endpoint público. Antes de activar entrega automática se requieren proveedor, credenciales en servidor, remitente permitido, rate limiting y comprobación de recepción.

## Preview y publicación

La preview utiliza el punto de montaje comercial del servicio de staging existente. `scripts/stage-preview.mjs` copia el build al repositorio privado, adapta rutas HTML/CSS y agrega noindex. El servicio sirve fuentes locales con MIME correcto. No se crean proyectos, dominios ni servicios nuevos.

La producción comercial continúa en `main`. La sustitución requiere revisión visual explícita. Las capturas y pruebas respaldan comportamientos comprobados, no sustituyen esa decisión. El rollback comercial conserva el commit de base y se realizaría mediante un revert normal; no se reescribe historial.
