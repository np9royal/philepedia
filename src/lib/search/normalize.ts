import type { PhileEntry, RankedPhile } from './types';

const directAliasMap: Record<string, string[]> = {
  rain: ['pluviophile', 'ombrophile', 'rain', 'rainy days', 'storm', 'drizzle', 'downpour', 'monsoon', 'petrichor'],
  'rain smell': ['pluviophile', 'petrichor'],
  books: ['bibliophile', 'books', 'reading', 'pages'],
  book: ['bibliophile', 'books', 'reading', 'pages'],
  moon: ['selenophile', 'moon', 'moonlight', 'lunar'],
  ocean: ['thalassophile', 'ocean', 'sea', 'waves'],
  sea: ['thalassophile', 'ocean', 'sea', 'waves'],
  cats: ['ailurophile', 'cats', 'cat', 'feline'],
  cat: ['ailurophile', 'cats', 'cat', 'feline'],
  music: ['melophile', 'music', 'songs', 'melody'],
  song: ['melophile', 'music', 'songs', 'melody'],
  songs: ['melophile', 'music', 'songs', 'melody'],
  stars: ['astrophile', 'stars', 'constellations'],
  night: ['nyctophile', 'night', 'midnight'],
  lightning: ['astraphile', 'lightning', 'thunder', 'storm'],
  words: ['logophile', 'words', 'language', 'vocabulary'],
  travel: ['xenophile', 'travel', 'culture', 'global'],
  wine: ['oenophile', 'wine', 'vintage', 'tasting'],
  dogs: ['cynophile', 'dogs', 'dog', 'canine'],
  dog: ['cynophile', 'dogs', 'dog', 'canine'],
  birds: ['ornithophile', 'birds', 'birdwatching', 'avian'],
  bird: ['ornithophile', 'birds', 'birdwatching', 'avian'],
};

const focusSlugMap: Record<string, string> = {
  rain: 'pluviophile',
  'rain smell': 'pluviophile',
  books: 'bibliophile',
  book: 'bibliophile',
  moon: 'selenophile',
  ocean: 'thalassophile',
  sea: 'thalassophile',
  cats: 'ailurophile',
  cat: 'ailurophile',
  music: 'melophile',
  song: 'melophile',
  songs: 'melophile',
  stars: 'astrophile',
  night: 'nyctophile',
  lightning: 'astraphile',
  words: 'logophile',
  travel: 'xenophile',
  wine: 'oenophile',
  dogs: 'cynophile',
  dog: 'cynophile',
  birds: 'ornithophile',
  bird: 'ornithophile',
};

export function normalizeSearchInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"’]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((token) => singularize(token))
    .join(' ');
}

function singularize(token: string): string {
  if (token.endsWith('ies') && token.length > 4) {
    return token.slice(0, -3) + 'y';
  }

  if (token.endsWith('ves') && token.length > 4) {
    return token.slice(0, -3) + 'f';
  }

  if (token.endsWith('s') && !token.endsWith('ss') && token.length > 3) {
    return token.slice(0, -1);
  }

  return token;
}

export function tokenizeSearchInput(input: string): string[] {
  const normalized = normalizeSearchInput(input);
  if (!normalized) {
    return [];
  }

  return normalized.split(' ').filter(Boolean);
}

export function expandSearchVariants(input: string): string[] {
  const normalized = normalizeSearchInput(input);
  if (!normalized) {
    return [];
  }

  const variants = new Set<string>([normalized]);
  const tokens = tokenizeSearchInput(normalized);

  const directMatches = directAliasMap[normalized];
  if (directMatches) {
    for (const match of directMatches) {
      variants.add(match);
      variants.add(normalizeSearchInput(match));
    }
  }

  for (const token of tokens) {
    const tokenMatches = directAliasMap[token];
    if (!tokenMatches) {
      continue;
    }

    for (const match of tokenMatches) {
      variants.add(match);
      variants.add(normalizeSearchInput(match));
    }
  }

  return Array.from(variants).filter(Boolean);
}

export function buildSearchDocument(phile: PhileEntry): string {
  return [
    phile.name,
    phile.slug,
    phile.pronunciation,
    phile.definition,
    phile.shortDescription,
    phile.category,
    phile.tags.join(' '),
    phile.tagAliases.join(' '),
    phile.moodKeywords.join(' '),
    phile.heroStyle,
  ]
    .join(' ')
    .toLowerCase();
}

export function getFocusSlug(input: string): string | undefined {
  const normalized = normalizeSearchInput(input);
  return focusSlugMap[normalized];
}

export function getDirectAliasBoosts(input: string): string[] {
  const normalized = normalizeSearchInput(input);
  return directAliasMap[normalized] ?? [];
}

export function createRankedPhile(phile: PhileEntry, score: number, reason: string): RankedPhile {
  return {
    ...phile,
    score,
    matchReason: reason,
  };
}
