import { getCollection, type CollectionEntry } from 'astro:content';

import { PHILE_SITE_NAME } from '../../data/phile-taxonomy';
import { isReservedPhileSlug, normalizePhileSlug } from './reserved';

export type PhileEntry = CollectionEntry<'philes'>;

export function sortPhilesByName(entries: readonly PhileEntry[]): PhileEntry[] {
  return [...entries].sort((left, right) => {
    const nameOrder = left.data.name.localeCompare(right.data.name, undefined, {
      sensitivity: 'base'
    });

    if (nameOrder !== 0) {
      return nameOrder;
    }

    return left.id.localeCompare(right.id, undefined, { sensitivity: 'base' });
  });
}

export function validatePhileCollection(entries: readonly PhileEntry[]): void {
  const problems: string[] = [];
  const index = new Map<string, PhileEntry>();

  for (const entry of entries) {
    const normalizedSlug = normalizePhileSlug(entry.id);

    if (index.has(normalizedSlug)) {
      problems.push(`Duplicate phile slug detected: "${normalizedSlug}".`);
    } else {
      index.set(normalizedSlug, entry);
    }

    if (normalizePhileSlug(entry.data.slug) !== normalizedSlug) {
      problems.push(
        `"${entry.id}" has mismatched frontmatter slug "${entry.data.slug}".`
      );
    }

    if (isReservedPhileSlug(normalizedSlug)) {
      problems.push(`"${entry.id}" collides with a reserved static route.`);
    }
  }

  for (const entry of entries) {
    for (const relatedSlug of entry.data.relatedPhiles ?? []) {
      const normalizedRelatedSlug = normalizePhileSlug(relatedSlug);

      if (!index.has(normalizedRelatedSlug)) {
        problems.push(
          `"${entry.id}" references missing related phile "${normalizedRelatedSlug}".`
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      [
        `${PHILE_SITE_NAME} content validation failed.`,
        ...problems.map((problem) => `- ${problem}`)
      ].join('\n')
    );
  }
}

export async function getRenderablePhiles(): Promise<PhileEntry[]> {
  const entries = await getCollection('philes');

  validatePhileCollection(entries);

  return sortPhilesByName(
    entries.filter((entry) => entry.data.status === 'published' && !isReservedPhileSlug(entry.id))
  );
}

export async function getRenderablePhileBySlug(slug: string): Promise<PhileEntry | undefined> {
  const normalizedSlug = normalizePhileSlug(slug);

  if (!normalizedSlug || isReservedPhileSlug(normalizedSlug)) {
    return undefined;
  }

  const entries = await getRenderablePhiles();
  return entries.find((entry) => entry.id === normalizedSlug);
}

export function getPhilePath(slug: string): string {
  const normalizedSlug = normalizePhileSlug(slug);
  return `/${normalizedSlug}`;
}
