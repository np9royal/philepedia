import type { CSSProperties } from 'react';
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';
import type { CategoryFilter, MoodFilter, PhileEntry, SortMode } from '../../lib/search';
import {
  createSearchIndex,
  getCategoryOptions,
  getMoodOptions,
  searchPhiles,
} from '../../lib/search';
import PhileCard from './PhileCard';

interface ExploreBrowserProps {
  philes: readonly PhileEntry[];
  initialQuery?: string;
  initialCategory?: CategoryFilter;
  initialMood?: MoodFilter;
  initialSort?: SortMode;
}

export default function ExploreBrowser({
  philes,
  initialQuery = '',
  initialCategory = 'all',
  initialMood = 'all',
  initialSort = 'relevance',
}: ExploreBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [mood, setMood] = useState<MoodFilter>(initialMood);
  const [sortMode, setSortMode] = useState<SortMode>(initialSort);
  const [isPending, startTransition] = useTransition();

  const deferredQuery = useDeferredValue(query);
  const index = useState(() => createSearchIndex(philes))[0];

  const categoryOptions = useMemo(() => getCategoryOptions(philes), [philes]);
  const moodOptions = useMemo(() => getMoodOptions(philes), [philes]);

  const results = searchPhiles(
    philes,
    index,
    deferredQuery,
    { category, mood },
    sortMode,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    if (category !== 'all') {
      params.set('category', category);
    }
    if (mood !== 'all') {
      params.set('mood', mood);
    }
    if (sortMode !== 'relevance') {
      params.set('sort', sortMode);
    }

    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, [query, category, mood, sortMode]);

  const onQueryChange = (value: string) => {
    startTransition(() => {
      setQuery(value);
    });
  };

  const onCategoryChange = (value: CategoryFilter) => {
    startTransition(() => {
      setCategory(value);
    });
  };

  const onMoodChange = (value: MoodFilter) => {
    startTransition(() => {
      setMood(value);
    });
  };

  const onSortToggle = () => {
    startTransition(() => {
      setSortMode((current) => (current === 'az' ? 'relevance' : 'az'));
    });
  };

  return (
    <section className="relative w-full pb-20">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_110px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,0.7fr))]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/45">
              Search what you love
            </span>
            <div className="relative">
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="rain, books, moon, ocean, cats, music..."
                aria-label="Search philes"
                className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-base text-white placeholder:text-white/30 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-[color:var(--search-ring)]"
                style={{ '--search-ring': '#A78BFA' } as CSSProperties}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/45">
              Category
            </span>
            <select
              value={category}
              onChange={(event) => onCategoryChange(event.target.value as CategoryFilter)}
              className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/20"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-950">
                  {option === 'all' ? 'All categories' : option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-white/45">
              Mood
            </span>
            <select
              value={mood}
              onChange={(event) => onMoodChange(event.target.value as MoodFilter)}
              className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/20"
            >
              {moodOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-950">
                  {option === 'all' ? 'All moods' : option}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={onSortToggle}
              className={`mt-7 w-full rounded-2xl border px-4 py-4 text-sm uppercase tracking-[0.24em] transition ${
                sortMode === 'az'
                  ? 'border-white/20 bg-white text-slate-950'
                  : 'border-white/10 bg-black/35 text-white hover:border-white/20'
              }`}
              aria-pressed={sortMode === 'az'}
            >
              A-Z
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-white/55">
          <p>
            {deferredQuery
              ? `Showing ${results.length} result${results.length === 1 ? '' : 's'} for "${deferredQuery}"`
              : `Showing ${results.length} curated phile${results.length === 1 ? '' : 's'}`}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${isPending ? 'animate-pulse bg-fuchsia-300' : 'bg-emerald-300'}`}
            />
            <span>{isPending ? 'Refining...' : 'Live index ready'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map((phile) => (
          <PhileCard key={phile.slug} phile={phile} score={phile.score} reason={phile.matchReason} />
        ))}
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center text-white/70">
          No matches yet. Try a broader word like rain, books, moon, ocean, cats, or music.
        </div>
      ) : null}
    </section>
  );
}
