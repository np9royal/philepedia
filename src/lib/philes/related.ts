import type { PhileEntry } from './content';
import { normalizePhileSlug } from './reserved';

function overlap(leftValues: readonly string[], rightValues: readonly string[]): string[] {
  const right = new Set(rightValues.map((value) => value.trim().toLowerCase()));
  return leftValues
    .map((value) => value.trim().toLowerCase())
    .filter((value) => right.has(value));
}

export function scoreRelatedPhile(source: PhileEntry, candidate: PhileEntry): number {
  if (normalizePhileSlug(source.id) === normalizePhileSlug(candidate.id)) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;

  if (source.data.category === candidate.data.category) {
    score += 90;
  }

  if (source.data.heroStyle === candidate.data.heroStyle) {
    score += 14;
  }

  score += overlap(source.data.tags, candidate.data.tags).length * 28;
  score += overlap(source.data.moodKeywords, candidate.data.moodKeywords).length * 14;
  score += overlap(source.data.tagAliases, candidate.data.tagAliases).length * 8;

  if ((candidate.data.relatedPhiles ?? []).includes(source.id)) {
    score += 18;
  }

  return score;
}

export function getRelatedPhiles(
  source: PhileEntry,
  candidates: readonly PhileEntry[],
  limit = 4
): PhileEntry[] {
  const curated = (source.data.relatedPhiles ?? [])
    .map((slug) => candidates.find((candidate) => normalizePhileSlug(candidate.id) === normalizePhileSlug(slug)))
    .filter((candidate): candidate is PhileEntry => Boolean(candidate))
    .filter((candidate) => normalizePhileSlug(candidate.id) !== normalizePhileSlug(source.id));

  const curatedSlugs = new Set(curated.map((entry) => normalizePhileSlug(entry.id)));
  const rankedFallbacks = candidates
    .filter((candidate) => !curatedSlugs.has(normalizePhileSlug(candidate.id)))
    .filter((candidate) => normalizePhileSlug(candidate.id) !== normalizePhileSlug(source.id))
    .map((candidate) => ({
      candidate,
      score: scoreRelatedPhile(source, candidate)
    }))
    .filter(({ score }) => score > Number.NEGATIVE_INFINITY)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.candidate.data.name.localeCompare(right.candidate.data.name, undefined, {
        sensitivity: 'base'
      });
    })
    .map(({ candidate }) => candidate);

  const results: PhileEntry[] = [];
  const seen = new Set<string>();

  for (const entry of [...curated, ...rankedFallbacks]) {
    const slug = normalizePhileSlug(entry.id);

    if (seen.has(slug)) {
      continue;
    }

    seen.add(slug);
    results.push(entry);

    if (results.length >= limit) {
      break;
    }
  }

  return results;
}
