import {commercialCopy} from './commercial-copy.mjs';
import {contactEmail} from './contact.mjs';
document.querySelector('[data-copy-email]')?.addEventListener('click',async()=>{
 const c=commercialCopy[document.documentElement.lang];
 const status=document.querySelector('[data-email-status]');
 try {await navigator.clipboard.writeText(contactEmail);status.textContent=c.copied;}
 catch {status.textContent=c.copyError;}
});
