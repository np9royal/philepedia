import type { PhileEntry as SearchPhileEntry } from '../search/types';
import type { PhileEntry } from './content';
import { PHILE_LAUNCH_PRIORITY_MAP } from '../../data/phile-launch-order';

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
    launchPriority: PHILE_LAUNCH_PRIORITY_MAP.get(entry.id) ?? 40,
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
