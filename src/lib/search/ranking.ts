import FlexSearch from 'flexsearch';
import type { Index } from 'flexsearch';
import type { CategoryFilter, MoodFilter, PhileEntry, RankedPhile, SearchFilters, SortMode } from './types';
import {
  buildSearchDocument,
  expandSearchVariants,
  getDirectAliasBoosts,
  getFocusSlug,
  normalizeSearchInput,
  tokenizeSearchInput,
  createRankedPhile,
} from './normalize';

export function createSearchIndex(philes: readonly PhileEntry[]): Index {
  const index = new FlexSearch.Index({
    preset: 'match',
    tokenize: 'forward',
    cache: true,
    resolution: 9,
  });

  for (const phile of philes) {
    index.add(phile.slug, buildSearchDocument(phile));
  }

  return index;
}

export function filterPhiles(
  philes: readonly PhileEntry[],
  filters: Pick<SearchFilters, 'category' | 'mood'>,
): PhileEntry[] {
  return philes.filter((phile) => {
    const categoryMatches = filters.category === 'all' || phile.category === filters.category;
    const moodMatches = filters.mood === 'all' || phile.mood === filters.mood;
    return categoryMatches && moodMatches;
  });
}

export function scorePhile(phile: PhileEntry, query: string): { score: number; reason: string } {
  const normalizedQuery = normalizeSearchInput(query);
  const queryTokens = tokenizeSearchInput(normalizedQuery);
  const document = buildSearchDocument(phile);
  const scoreReasons: Array<[number, string]> = [];
  const launchPriority = phile.launchPriority ?? 0;

  if (!normalizedQuery) {
    scoreReasons.push([launchPriority, 'launch priority']);
    return resolveScore(scoreReasons);
  }

  if (getFocusSlug(normalizedQuery) === phile.slug) {
    scoreReasons.push([5000, 'exact intent match']);
  }

  if (phile.slug === normalizedQuery) {
    scoreReasons.push([2800, 'exact slug']);
  }

  if (normalizeSearchInput(phile.name) === normalizedQuery) {
    scoreReasons.push([2600, 'exact name']);
  }

  const directAliases = getDirectAliasBoosts(normalizedQuery);
  if (directAliases.some((alias) => phile.tags.map(normalizeSearchInput).includes(normalizeSearchInput(alias)))) {
    scoreReasons.push([2200, 'direct alias']);
  }

  if (document.startsWith(normalizedQuery)) {
    scoreReasons.push([1200, 'prefix match']);
  } else if (document.includes(normalizedQuery)) {
    scoreReasons.push([700, 'text match']);
  }

  for (const token of queryTokens) {
    if (normalizeSearchInput(phile.name).includes(token)) {
      scoreReasons.push([220, `name token:${token}`]);
    }

    if (phile.tags.some((tag) => normalizeSearchInput(tag).includes(token))) {
      scoreReasons.push([240, `tag token:${token}`]);
    }

    if (phile.tagAliases.some((alias) => normalizeSearchInput(alias).includes(token))) {
      scoreReasons.push([180, `alias token:${token}`]);
    }

    if (phile.moodKeywords.some((keyword) => normalizeSearchInput(keyword).includes(token))) {
      scoreReasons.push([90, `mood token:${token}`]);
    }
  }

  scoreReasons.push([launchPriority, 'launch priority']);
  return resolveScore(scoreReasons);
}

function resolveScore(reasons: Array<[number, string]>): { score: number; reason: string } {
  return reasons.reduce(
    (current, [score, reason]) => {
      const nextScore = current.score + score;
      return {
        score: nextScore,
        reason: current.reason ? `${current.reason}; ${reason}` : reason,
      };
    },
    { score: 0, reason: '' },
  );
}

export function searchPhiles(
  philes: readonly PhileEntry[],
  index: Index,
  query: string,
  filters: Pick<SearchFilters, 'category' | 'mood'>,
  sortMode: SortMode,
): RankedPhile[] {
  const filtered = filterPhiles(philes, filters);
  const normalizedQuery = normalizeSearchInput(query);
  const variants = expandSearchVariants(query);

  let candidateSlugs = new Set<string>();
  if (variants.length) {
    for (const variant of variants) {
      const hits = index.search(variant, { limit: 25 }) as Array<string | number>;
      for (const hit of hits) {
        candidateSlugs.add(String(hit));
      }
    }
  }

  const candidatePool =
    candidateSlugs.size > 0
      ? filtered.filter((phile) => candidateSlugs.has(phile.slug))
      : filtered;

  const ranked = candidatePool.map((phile) => {
    const { score, reason } = scorePhile(phile, normalizedQuery || query);
    return createRankedPhile(phile, score, reason);
  });

  ranked.sort((left, right) => {
    if (sortMode === 'az') {
      return left.name.localeCompare(right.name);
    }

    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return left.name.localeCompare(right.name);
  });

  if (normalizedQuery && ranked.length === 0) {
    return filtered
      .map((phile) => {
        const { score, reason } = scorePhile(phile, query);
        return createRankedPhile(phile, score, reason);
      })
      .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name));
  }

  return ranked;
}

export function getCategoryOptions(philes: readonly PhileEntry[]): Array<CategoryFilter> {
  return ['all', ...Array.from(new Set(philes.map((phile) => phile.category)))];
}

export function getMoodOptions(philes: readonly PhileEntry[]): Array<MoodFilter> {
  return ['all', ...Array.from(new Set(philes.map((phile) => phile.mood)))];
}
