// GitHub Pages serves this same static document for every unknown path.
const language = /^\/es(?:\/|$)/.test(location.pathname) ? 'es' : 'en';
document.documentElement.lang = language;
document.title = language === 'es' ? 'Página no encontrada — Santensor' : 'Page not found — Santensor';
document.querySelectorAll('[data-error-language]').forEach(section => {
  section.hidden = section.dataset.errorLanguage !== language;
});
