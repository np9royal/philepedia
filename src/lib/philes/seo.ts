import type { PhileEntry } from './content';

import { PHILE_SITE_NAME, PHILE_SITE_TAGLINE } from '../../data/phile-taxonomy';

export function getPhileTitle(entry: PhileEntry): string {
  return entry.data.seo?.title ?? `${entry.data.name} — Meaning, Origin & More | ${PHILE_SITE_NAME}`;
}

export function getPhileDescription(entry: PhileEntry): string {
  return entry.data.seo?.description ?? entry.data.shortDescription ?? entry.data.definition;
}

export function getPhileCanonicalPath(entry: PhileEntry): string {
  return entry.data.seo?.canonical ?? `/${entry.id}`;
}

export function getAbsoluteUrl(pathname: string, site?: URL): string {
  if (!site) {
    return pathname;
  }

  return new URL(pathname, site).toString();
}

export function buildDefinedTermJsonLd(entry: PhileEntry, canonicalUrl: string, site?: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.data.name,
    description: getPhileDescription(entry),
    termCode: entry.id,
    url: canonicalUrl,
    keywords: entry.data.tags.join(', '),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: PHILE_SITE_NAME,
      description: PHILE_SITE_TAGLINE,
      url: site ? new URL('/', site).toString() : undefined
    }
  };
}

export function buildWebSiteJsonLd(site?: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: PHILE_SITE_NAME,
    description: PHILE_SITE_TAGLINE,
    url: site ? new URL('/', site).toString() : undefined,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site ? new URL('/?q={search_term_string}', site).toString() : '/?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
