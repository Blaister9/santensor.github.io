// Año dinámico en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Toggle tema claro/oscuro
const root = document.documentElement;
const btn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
if(saved === 'light') root.classList.add('light');

btn.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// Scroll suave para anclas (Safari fallback)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

// Botones: Expandir / Contraer todo en Experiencia
const expandAllBtn = document.getElementById('expandAll');
const collapseAllBtn = document.getElementById('collapseAll');
if (expandAllBtn && collapseAllBtn) {
  const allDetails = () => Array.from(document.querySelectorAll('#experiencia details'));
  expandAllBtn.addEventListener('click', () => allDetails().forEach(d => d.open = true));
  collapseAllBtn.addEventListener('click', () => allDetails().forEach(d => d.open = false));
}

// Acordeón opcional: si pones data-accordion en el contenedor, solo permite un <details> abierto
document.querySelectorAll('[data-accordion]').forEach(section => {
  const items = section.querySelectorAll('details');
  items.forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) items.forEach(o => { if (o !== d) o.removeAttribute('open'); });
    });
  });
});
