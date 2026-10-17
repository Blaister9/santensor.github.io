export const commercialCopy = {
 en: {
  title: 'Santensor — AI, software & enterprise automation engineering',
  description: 'Engineering for AI-enabled applications, web software, APIs and process automation. Inspect working demos and discuss your project directly.',
  intro: 'I develop applications with AI agents and models, web software and APIs. I automate information processing and business workflows.',
  capabilities: ['AI & Machine Learning Engineering', 'Software & Systems Engineering', 'Enterprise Automation & Modernization'],
  projects: 'Projects & evidence', contact: 'Let’s talk',
  identityTitle: 'The engineering behind Santensor',
  identity: 'Santensor is the engineering portfolio published by Blaister9, with a public source repository. The work below demonstrates browser software, workflow design, testing and failure recovery. For a project, we can define the problem, agree on a focused prototype and review evidence before expanding the scope.',
  casesTitle: 'Software you can inspect.',
  casesIntro: 'Two independent public builds and a private application in development. Each study explains the implementation and the evidence available for review.',
  labels: ['Problem', 'Solution', 'Technical contribution', 'Architecture & decision', 'Evidence', 'Limitations'],
  evidence: 'Inspect the evidence',
  items: [
   {title:'A request workflow with human review.',discipline:'ENTERPRISE AUTOMATION',kind:'Independent working prototype',image:'workflow.png',alt:'Real laboratory execution showing the synthetic decision and event trace.',details:[
    'Information arriving as free text needs a clear route, an accountable decision and a recoverable failure path.',
    'An editable browser laboratory classifies fictional requests, checks a local directory and asks a person to approve, reject or route the request manually.',
    'A six-stage state machine, guarded transitions, recoverable service errors and downloadable event snapshots.',
    'Extraction, policy, tool response and review are separate stages. An uncertain request cannot pass the approval guard. A simulated 503 can be inspected after recovery.',
    'Run the demo, inspect a completed event or download its JSON trace. Public source and automated tests show the transition rules.',
    'Uses deterministic rules and fictional data. No model inference, external API or business-system write. This is one prototype; its scenarios are not separate products.'
   ],links:[['Run the laboratory','labs'],['State machine & tests','https://github.com/Blaister9/santensor.github.io/blob/feat/santensor-v4-ux-hardening/js/workflow.mjs'],['Technical evidence','/assets/projects/workflow.html']]},
   {title:'A cinematic, bilingual engineering portfolio.',discipline:'SOFTWARE & SYSTEMS',kind:'Public website',image:'portfolio.png',alt:'Real Santensor portfolio interface with its five-scene navigation.',details:[
    'A visual portfolio must explain services while keeping a complex interactive demonstration accessible.',
    'A static EN/ES website with five continuous scenes, an executable simulator, public project evidence and direct email contact.',
    'Page generation, progressive graphics, localized navigation, keyboard interaction and browser regression tests.',
    'The interface works independently of WebGL. Original rendered stills provide a lighter 2.5D mode. A static build keeps the public site independent of an application backend.',
    'Explore the five scenes, switch language during a run, and inspect the repository and accessibility regressions.',
    'Automated browser checks use emulation. Physical touch, virtual keyboards, screen readers and GPU performance require separate device checks.'
   ],links:[['Explore the five scenes','home'],['Public repository','https://github.com/Blaister9/santensor.github.io'],['Architecture & checks','/assets/projects/portfolio.html']]},
   {title:'A private technical interview practice app.',discipline:'AI APPLICATION SOFTWARE',kind:'Product in development',image:'trainer.png',alt:'Existing private trainer screenshot showing explicitly synthetic written practice and unscored feedback; it does not demonstrate physical audio.',details:[
    'Technical interview practice needs questions related to a role and controlled handling of session content.',
    'A private application with written practice, an AI voice-session integration and optional history.',
    'Session access controls, server-side credentials, usage limits, consent for persistence and voice-session lifecycle handling.',
    'A Next.js application separates browser interaction, server endpoints and PostgreSQL persistence. Voice transport uses WebRTC; the server mediates the session connection.',
    'The technical review note records inspected implementation and existing test coverage. The private repository and application are not public demos.',
    'Voice lifecycle coverage includes browser mocks. Physical microphone, speaker, mobile audio and the usefulness of evaluation remain unvalidated. No hiring or language-proficiency outcome is claimed.'
   ],links:[['Inspect the synthetic practice screenshot','/assets/projects/trainer.png'],['Read the technical review note','/assets/projects/trainer.html']]},
  ],
  contactTitle:'Tell me what needs to work better.',contactIntro:'Describe the problem, what you need delivered and any constraints. Email is the direct channel for starting a technical conversation.',
  emailAction:'Write an email',copyEmail:'Copy email address',copied:'Email address copied.',copyError:'Select and copy the email address above.',
  emailNote:'Opens your email application. You review and send the message yourself.',privacyNote:'Please do not send passwords, confidential material or sensitive personal data.',
 },
 es: {
  title:'Santensor — Ingeniería de IA, software y automatización empresarial',
  description:'Ingeniería para aplicaciones con IA, software web, APIs y automatización de procesos. Revisa demostraciones funcionales y conversemos sobre tu proyecto.',
  intro:'Desarrollo aplicaciones con agentes y modelos de IA, software web y APIs. Automatizo el procesamiento de información y los procesos de tu negocio.',
  capabilities:['Ingeniería de IA y Machine Learning','Ingeniería de Software y Sistemas','Automatización y Modernización Empresarial'],
  projects:'Proyectos y evidencia',contact:'Conversemos',
  identityTitle:'La ingeniería detrás de Santensor',
  identity:'Santensor es el portafolio de ingeniería publicado por Blaister9, con un repositorio público. Los trabajos siguientes demuestran software de navegador, diseño de flujos, pruebas y recuperación de fallos. Para un proyecto podemos definir el problema, acordar un prototipo concreto y revisar evidencia antes de ampliar el alcance.',
  casesTitle:'Software que puedes inspeccionar.',
  casesIntro:'Dos desarrollos públicos independientes y una aplicación privada en desarrollo. Cada caso explica su implementación y la evidencia disponible para revisión.',
  labels:['Problema','Solución','Contribución técnica','Arquitectura y decisión','Evidencia','Limitaciones'],evidence:'Inspeccionar la evidencia',
  items:[
   {title:'Un flujo de solicitudes con revisión humana.',discipline:'AUTOMATIZACIÓN EMPRESARIAL',kind:'Prototipo independiente funcional',image:'workflow.png',alt:'Ejecución real del laboratorio con decisión sintética y traza de eventos.',details:[
    'La información que llega como texto libre necesita una ruta clara, una decisión responsable y recuperación ante fallos.',
    'Un laboratorio editable en el navegador clasifica solicitudes ficticias, consulta un directorio local y pide a una persona aprobar, rechazar o clasificar manualmente.',
    'Máquina de estados de seis etapas, transiciones protegidas, recuperación de errores y exportación de instantáneas de eventos.',
    'Extracción, política, respuesta de herramienta y revisión son etapas separadas. Una solicitud incierta no se puede aprobar. Un fallo 503 simulado sigue disponible para inspección después de recuperarlo.',
    'Ejecuta la demo, inspecciona un evento o descarga su traza JSON. El código público y las pruebas muestran las reglas de transición.',
    'Usa reglas deterministas y datos ficticios. Sin inferencia de modelos, API externa ni escritura empresarial. Es un solo prototipo; sus escenarios no son productos independientes.'
   ],links:[['Ejecutar el laboratorio','labs'],['Máquina de estados y pruebas','https://github.com/Blaister9/santensor.github.io/blob/feat/santensor-v4-ux-hardening/js/workflow.mjs'],['Evidencia técnica','/assets/projects/workflow.html']]},
   {title:'Un portafolio cinematográfico bilingüe.',discipline:'SOFTWARE Y SISTEMAS',kind:'Sitio web público',image:'portfolio.png',alt:'Interfaz real del portafolio Santensor y su navegación de cinco escenas.',details:[
    'Un portafolio visual debe explicar los servicios y mantener accesible una demostración interactiva compleja.',
    'Un sitio estático EN/ES con cinco escenas continuas, simulador funcional, evidencia pública de proyectos y contacto directo por correo.',
    'Generación de páginas, gráficos progresivos, navegación localizada, interacción de teclado y regresiones en navegador.',
    'La interfaz funciona independientemente de WebGL. Renders originales ofrecen un modo 2.5D más ligero. El build estático mantiene el sitio público independiente de un backend de aplicación.',
    'Recorre las cinco escenas, cambia de idioma durante una ejecución y revisa el repositorio y las regresiones de accesibilidad.',
    'Las pruebas automatizadas usan emulación. Tacto físico, teclado virtual, lectores de pantalla y rendimiento de GPU requieren pruebas adicionales en dispositivos.'
   ],links:[['Recorrer las cinco escenas','home'],['Repositorio público','https://github.com/Blaister9/santensor.github.io'],['Arquitectura y pruebas','/assets/projects/portfolio.html']]},
   {title:'Una aplicación privada de práctica de entrevistas.',discipline:'SOFTWARE CON IA',kind:'Producto en desarrollo',image:'trainer.png',alt:'Captura existente del entrenador con práctica escrita explícitamente sintética y sin calificación; no demuestra audio físico.',details:[
    'La práctica de entrevistas técnicas necesita preguntas relacionadas con una vacante y manejo controlado del contenido de sesión.',
    'Una aplicación privada con práctica escrita, integración de sesiones de voz con IA e historial opcional.',
    'Controles de acceso y sesión, credenciales en servidor, límites de uso, consentimiento para persistencia y manejo del ciclo de voz.',
    'Una aplicación Next.js separa navegador, endpoints de servidor y persistencia PostgreSQL. El transporte de voz usa WebRTC y el servidor media la conexión de sesión.',
    'La nota técnica registra la implementación inspeccionada y la cobertura existente. El repositorio privado y la aplicación no son demostraciones públicas.',
    'Las pruebas del ciclo de voz incluyen simulaciones de navegador. Micrófono, altavoz, audio móvil y utilidad de la evaluación siguen sin validación física. No se afirman resultados de contratación ni nivel de idioma.'
   ],links:[['Inspeccionar captura de práctica sintética','/assets/projects/trainer.png'],['Leer la nota técnica','/assets/projects/trainer.html']]},
  ],
  contactTitle:'Cuéntame qué necesita funcionar mejor.',contactIntro:'Describe el problema, lo que necesitas recibir y las restricciones del proyecto. El correo es el canal directo para iniciar una conversación técnica.',
  emailAction:'Escribir un correo',copyEmail:'Copiar dirección de correo',copied:'Dirección de correo copiada.',copyError:'Selecciona y copia la dirección de correo de arriba.',
  emailNote:'Abre tu aplicación de correo. Tú revisas y envías el mensaje.',privacyNote:'No envíes contraseñas, material confidencial ni datos personales sensibles.',
 }
};
