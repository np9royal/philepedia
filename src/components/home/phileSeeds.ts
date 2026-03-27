import FlexSearch from 'flexsearch';

import { launchPhiles } from '../../lib/search/data';

export type Category =
  | 'Sky & Weather'
  | 'Water & Earth'
  | 'Flora & Fauna'
  | 'Arts & Media'
  | 'Language & Ideas'
  | 'Culture & Taste'
  | 'Elements';

export type PhileSeed = {
  slug: string;
  name: string;
  category: Category;
  summary: string;
  tags: string[];
  aliases: string[];
  priority: number;
  mood: string;
};

export type SearchResult = PhileSeed & {
  score: number;
  reason: string;
};

export const categoryStyles: Record<
  Category,
  {
    label: string;
    accent: string;
    muted: string;
  }
> = {
  'Sky & Weather': {
    label: 'Sky',
    accent: '#8ab4f8',
    muted: '#d7e6ff'
  },
  'Water & Earth': {
    label: 'Water',
    accent: '#55d6be',
    muted: '#c8fff3'
  },
  'Flora & Fauna': {
    label: 'Living',
    accent: '#9ed36a',
    muted: '#e3f5c8'
  },
  'Arts & Media': {
    label: 'Arts',
    accent: '#f2c86d',
    muted: '#fff0c7'
  },
  'Language & Ideas': {
    label: 'Ideas',
    accent: '#f39c6b',
    muted: '#ffd9c3'
  },
  'Culture & Taste': {
    label: 'Culture',
    accent: '#d7a2f3',
    muted: '#f2dcff'
  },
  Elements: {
    label: 'Elemental',
    accent: '#ff7d6e',
    muted: '#ffd6cf'
  }
};

export const homePhiles: PhileSeed[] = launchPhiles.map((phile) => ({
  slug: phile.slug,
  name: phile.name,
  category: phile.category,
  summary: phile.shortDescription,
  tags: phile.tags,
  aliases: phile.tagAliases,
  priority: phile.launchPriority,
  mood: phile.mood.toLowerCase()
}));

export const aliasMap: Record<string, string> = {
  'rain smell': 'pluviophile',
  'rainy days': 'pluviophile',
  rain: 'pluviophile',
  books: 'bibliophile',
  book: 'bibliophile',
  reading: 'bibliophile',
  moon: 'selenophile',
  moonlight: 'selenophile',
  ocean: 'thalassophile',
  sea: 'thalassophile',
  waves: 'thalassophile',
  cats: 'ailurophile',
  cat: 'ailurophile',
  music: 'melophile',
  song: 'melophile',
  lightning: 'astraphile',
  thunder: 'astraphile',
  clouds: 'nephophile',
  sun: 'heliophile',
  tree: 'dendrophile',
  flowers: 'anthophile',
  words: 'logophile',
  technology: 'technophile',
  'new things': 'neophile',
  wine: 'oenophile',
  dogs: 'cynophile',
  birds: 'ornithophile',
  horses: 'hippophile',
  fire: 'pyrophile',
  dreams: 'oneirophile',
  places: 'topophile',
  snow: 'chionophile',
  mountains: 'orophile',
  caves: 'speleophile',
  sand: 'psammophile',
  reptiles: 'herpetophile',
  mushrooms: 'mycophile',
  typography: 'typophile',
  records: 'discophile',
  museums: 'museophile',
  color: 'chromophile',
  myths: 'mythophile',
  wisdom: 'sophophile',
  japan: 'japonophile',
  spain: 'hispanophile',
  stone: 'lithophile',
  cold: 'cryophile',
  heat: 'thermophile'
};

export const featuredSearches = ['rain', 'books', 'moon', 'ocean', 'cats', 'music'];

export const particleWords = [
  { label: 'pluviophile', x: 8, y: 12, delay: 0.2, duration: 16, size: '0.88rem' },
  { label: 'bibliophile', x: 24, y: 24, delay: 1.2, duration: 18, size: '1.08rem' },
  { label: 'selenophile', x: 58, y: 10, delay: 0.7, duration: 20, size: '1rem' },
  { label: 'thalassophile', x: 70, y: 28, delay: 1.9, duration: 19, size: '0.98rem' },
  { label: 'melophile', x: 14, y: 58, delay: 0.8, duration: 17, size: '0.92rem' },
  { label: 'oneirophile', x: 40, y: 18, delay: 2.2, duration: 21, size: '0.84rem' },
  { label: 'ailurophile', x: 82, y: 16, delay: 0.4, duration: 18, size: '0.86rem' },
  { label: 'astraphile', x: 90, y: 42, delay: 1.5, duration: 22, size: '0.9rem' },
  { label: 'dendrophile', x: 12, y: 82, delay: 2.1, duration: 23, size: '0.86rem' },
  { label: 'anthophile', x: 37, y: 72, delay: 1.4, duration: 20, size: '0.88rem' },
  { label: 'typophile', x: 62, y: 74, delay: 0.9, duration: 18, size: '0.92rem' },
  { label: 'pyrophile', x: 84, y: 76, delay: 1.8, duration: 19, size: '0.96rem' },
  { label: 'xenophile', x: 48, y: 48, delay: 0.5, duration: 24, size: '0.84rem' },
  { label: 'topophile', x: 26, y: 88, delay: 1.1, duration: 21, size: '0.82rem' },
  { label: 'museophile', x: 72, y: 90, delay: 2.4, duration: 18, size: '0.86rem' }
];

const normalized = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(\w+?)s\b/g, '$1');

const phileLookup = new Map(homePhiles.map((phile) => [phile.slug, phile]));
const searchIndex = new FlexSearch.Index({
  cache: true,
  tokenize: 'forward'
});

for (const phile of homePhiles) {
  searchIndex.add(
    phile.slug,
    [
      phile.name,
      phile.category,
      phile.summary,
      ...phile.tags,
      ...phile.aliases,
      phile.mood
    ].join(' ')
  );
}

const candidateTokens = (phile: PhileSeed) => [
  normalized(phile.name),
  ...phile.tags.map(normalized),
  ...phile.aliases.map(normalized),
  normalized(phile.category),
  normalized(phile.summary)
];

const includesMatch = (query: string, phile: PhileSeed) => {
  const tokens = candidateTokens(phile);
  return tokens.some((token) => token.includes(query));
};

export function canonicalizeQuery(input: string) {
  const normalizedInput = normalized(input);
  return aliasMap[normalizedInput] ? aliasMap[normalizedInput] : normalizedInput;
}

export function buildHomeResults(query: string): SearchResult[] {
  const normalizedQuery = canonicalizeQuery(query);
  const searchTerm = normalizedQuery || '';

  const fallback = homePhiles
    .slice()
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);

  if (!searchTerm) {
    return fallback.map((phile) => ({
      ...phile,
      score: phile.priority,
      reason: 'Featured in the living collection'
    }));
  }

  const flexMatches = searchIndex.search(searchTerm, { limit: 18 }) as Array<string | number>;
  const candidateIds = new Set<string>(flexMatches.map(String));

  const scored = (candidateIds.size ? [...candidateIds].map((slug) => phileLookup.get(slug)) : homePhiles)
    .filter((phile): phile is PhileSeed => Boolean(phile))
    .map((phile) => {
      let score = phile.priority;
      let reason = 'Related by mood and imagery';
      const name = normalized(phile.name);
      const tags = phile.tags.map(normalized);
      const aliases = phile.aliases.map(normalized);

      if (normalizedQuery === name) {
        score += 1000;
        reason = 'Exact name match';
      } else if (tags.includes(normalizedQuery)) {
        score += 950;
        reason = 'Exact tag match';
      } else if (aliases.includes(normalizedQuery)) {
        score += 925;
        reason = 'Alias match';
      } else if (name.startsWith(normalizedQuery) || tags.some((tag) => tag.startsWith(normalizedQuery))) {
        score += 760;
        reason = 'Prefix match';
      } else if (includesMatch(normalizedQuery, phile)) {
        score += 540;
        reason = 'Close thematic match';
      }

      if (normalizedQuery in aliasMap && aliasMap[normalizedQuery] === phile.slug) {
        score += 1200;
        reason = 'Canonical result for your query';
      }

      if (candidateIds.size === 0) {
        score -= 50;
      }

      return {
        ...phile,
        score,
        reason
      };
    })
    .sort((left, right) => right.score - left.score || right.priority - left.priority)
    .slice(0, 8);

  return scored;
}

export function getHomeResultBySlug(slug: string) {
  return phileLookup.get(slug);
}
