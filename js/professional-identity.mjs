import {commercialCopy} from './commercial-copy.mjs';
import {routeFor} from './i18n.mjs';

// Only the public identity and professional information authorized by the owner.
export function professionalSchema(language) {
  const c = commercialCopy[language];
  const personId = 'https://santensor.com/#e-santiago-paz';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person', '@id': personId,
        name: c.identityName,
        jobTitle: c.identityProfessionalTitle,
        description: c.identity,
        url: `https://santensor.com${routeFor(language,'cases')}#professional-profile`,
      },
      {
        '@type': 'WebSite', '@id': 'https://santensor.com/#website',
        name: 'Santensor', url: 'https://santensor.com/',
        inLanguage: ['en','es'], description: c.description,
        author: {'@id': personId},
      },
    ],
  };
}
