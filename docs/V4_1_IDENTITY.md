# V4.1 — identidad profesional confirmada

El propietario autorizó publicar **E. Santiago Paz**, **Ingeniero Mecatrónico / Mechatronics Engineer**, con posicionamiento **AI & Software Engineering**. Santensor conserva la marca, la navegación y la experiencia cinematográfica principal.

## Implementado

- Nombre y formación en una presentación breve de portada, sin sustituir el titular cinematográfico ni las tres capacidades.
- Biografía EN/ES en proyectos: experiencia en software empresarial, APIs, integraciones, Power Platform, Dynamics 365, Dataverse y automatización; colaboración remota con alcance y entregables acordados.
- Power Platform permanece como experiencia complementaria dentro del texto. Los agentes de IA, aplicaciones con LLM y machine learning se describen como proyectos actuales; no como experiencia comercial consolidada.
- Títulos y descripciones de portada, proyectos y contacto actualizados. Los datos estructurados WebSite/Person identifican a E. Santiago Paz como autor de Santensor. El cambio de idioma actualiza también la presentación y los datos estructurados.
- Sin nombres de empleadores o clientes, proyectos institucionales, certificaciones, años de experiencia ni métricas. No quedan datos de identidad pendientes o placeholders publicados.

## Verificación

- Rama: `feat/santensor-v4-ux-hardening`.
- Código: `e47ea5bd9e3e88eda5b0c55f01a5dada5c934531`.
- 18 pruebas unitarias aprobadas; lint y build de producción verificados.
- Matriz comercial EN/ES aprobada en 1440 × 900, 1363 × 936, 768 × 1024, 390 × 844 y 360 × 740. Comprobaciones de accesibilidad, enlaces, tipografía y acciones del simulador incluidas. Navegación y metadatos comprobados nuevamente tras separar la etiqueta profesional de las categorías de proyectos.
- [CI aprobado](https://github.com/Blaister9/santensor.github.io/actions/runs/39006761289): 18 pruebas unitarias, 12 Playwright de preview y 27 de producción. Despliegue de Pages omitido por tratarse de la rama de revisión.
- Preview HTTPS comprobada en EN/ES: nombre visible, marca Santensor y Person estructurado correctos. [Inicio ES](https://eos-luis-subsidiaries-equation.trycloudflare.com/es/) · [Perfil ES](https://eos-luis-subsidiaries-equation.trycloudflare.com/es/cases/#professional-profile) · [Perfil EN](https://eos-luis-subsidiaries-equation.trycloudflare.com/cases/#professional-profile) · [Galería](https://eos-luis-subsidiaries-equation.trycloudflare.com/review/).
- Capturas e informes: [evidence/v4.1/identity](../evidence/v4.1/identity/). Las imágenes de proyectos se cargaron mediante desplazamiento antes de las capturas completas.

Hubo una interrupción temporal de resolución DNS durante la verificación remota. Se recuperó sin cambiar la configuración DNS. Las comprobaciones HTTPS posteriores pasaron. Un fallo inicial de CI detectó un selector ambiguo: el título profesional reutilizaba la clase de categorías de proyecto. Se separaron sus clases y se limitó la prueba al proyecto que inspecciona.

main, CNAME, Pages, DNS, Railway y el entrenador permanecen intactos. No se ha fusionado la rama ni sustituido producción. Siguen pendientes la revisión del propietario y las validaciones físicas ya documentadas; la identidad profesional está completa.
