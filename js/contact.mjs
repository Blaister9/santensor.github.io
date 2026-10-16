import {catalogs} from './i18n.mjs';
export const contactEmail = 'santiagopazbedoya@gmail.com';
export function prepareInquiry(values, language = 'en') {
 const copy = catalogs[language]?.contact ?? catalogs.en.contact;
 const name = String(values.name ?? '').trim();
 const email = String(values.email ?? '').trim();
 const message = String(values.message ?? '').trim();
 if (values.website || name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || /[\r\n]/.test(name + email) || message.length < 20 || message.length > 2000 || values.consent !== true) throw new Error(copy.invalid);
 const text = `${copy.name}: ${name}\n${copy.email}: ${email}\n\n${message}`;
 return {text, href: `mailto:${contactEmail}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(text)}`};
}
if (typeof document !== 'undefined') {
 const form = document.querySelector('[data-contact-form]');
 const copy = catalogs[document.documentElement.lang === 'es' ? 'es' : 'en'].contact;
 if (form) {
  form.noValidate = true;
  const status = document.querySelector('[data-contact-status]');
  const draft = document.querySelector('[data-draft]');
  const panel = document.querySelector('[data-draft-panel]');
  form.addEventListener('input', event => {panel.hidden = true; status.textContent = ''; event.target.removeAttribute('aria-invalid');});
  form.addEventListener('submit', event => {
   event.preventDefault();
   for (const field of form.querySelectorAll('[required]')) field.setAttribute('aria-invalid', String(!field.validity.valid));
   try {
    const fields = Object.fromEntries(new FormData(form));
    const inquiry = prepareInquiry({...fields, consent: fields.consent === 'on'}, document.documentElement.lang);
    draft.textContent = inquiry.text;
    document.querySelector('[data-open-draft]').href = inquiry.href;
    panel.hidden = false;
    status.textContent = copy.prepared;
    document.querySelector('[data-open-draft]').focus();
   } catch (error) {panel.hidden = true; status.textContent = error.message; status.focus();}
  });
  document.querySelector('[data-copy-draft]').addEventListener('click', async () => {try {await navigator.clipboard.writeText(draft.textContent); status.textContent = copy.copied;} catch {status.textContent = copy.copyError;}});
 }
}
