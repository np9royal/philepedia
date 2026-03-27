import type { PhileEntry as SearchPhileEntry } from '../search/types';
import type { PhileEntry } from './content';

const launchPriorityOrder = [
  'pluviophile',
  'bibliophile',
  'selenophile',
  'thalassophile',
  'melophile',
  'ailurophile',
  'astraphile',
  'astrophile',
  'nephophile',
  'heliophile',
  'nyctophile',
  'potamophile',
  'limnophile',
  'dendrophile',
  'anthophile',
  'geophile',
  'cinephile',
  'audiophile',
  'logophile',
  'technophile',
  'anglophile',
  'francophile',
  'xenophile',
  'neophile',
  'oenophile',
  'cynophile',
  'ornithophile',
  'hippophile',
  'pyrophile',
  'ombrophile'
] as const;

const priorityMap = new Map<string, number>(
  launchPriorityOrder.map((slug, index) => [slug, 120 - index * 2])
);

function toTitleCase(value: string): string {
  return value
    .trim()
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function toSearchPhile(entry: PhileEntry): SearchPhileEntry {
  return {
    slug: entry.id,
    name: entry.data.name,
    pronunciation: entry.data.pronunciation,
    definition: entry.data.definition,
    shortDescription: entry.data.shortDescription,
    category: entry.data.category,
    mood: toTitleCase(entry.data.moodKeywords[0] ?? 'Reflective'),
    tags: entry.data.tags,
    tagAliases: entry.data.tagAliases,
    moodKeywords: entry.data.moodKeywords,
    colorPalette: entry.data.colorPalette,
    heroStyle: entry.data.heroStyle,
    launchPriority: priorityMap.get(entry.id) ?? 40,
    etymology: entry.data.etymology,
    youMightBeIf: entry.data.youMightBeIf,
    relatedPhiles: entry.data.relatedPhiles ?? [],
    references: entry.data.references,
    seo: entry.data.seo,
    status: entry.data.status
  };
}

export function toSearchPhiles(entries: readonly PhileEntry[]): SearchPhileEntry[] {
  return entries.map(toSearchPhile);
}
