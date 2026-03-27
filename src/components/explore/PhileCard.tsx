import type { CSSProperties } from 'react';
import type { PhileEntry } from '../../lib/search';

interface PhileCardProps {
  phile: PhileEntry;
  score?: number;
  reason?: string;
}

export default function PhileCard({ phile, score, reason }: PhileCardProps) {
  const accent = phile.colorPalette[1] ?? phile.colorPalette[0];
  const glow = phile.colorPalette[2] ?? phile.colorPalette[1];
  const base = phile.colorPalette[0];

  const style = {
    '--phile-base': base,
    '--phile-accent': accent,
    '--phile-glow': glow,
  } as CSSProperties;

  return (
    <a
      href={`/${phile.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 text-left shadow-[0_30px_90px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--phile-accent)]"
      style={style}
    >
      <div
        className="absolute inset-0 opacity-70 transition duration-300 group-hover:opacity-100"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at top left, color-mix(in srgb, var(--phile-glow) 35%, transparent) 0%, transparent 50%), linear-gradient(145deg, color-mix(in srgb, var(--phile-base) 88%, black) 0%, color-mix(in srgb, var(--phile-accent) 36%, var(--phile-base)) 55%, rgba(6, 11, 20, 0.98) 100%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/50">{phile.category}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{phile.name}</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/55">
          {phile.heroStyle}
        </div>
      </div>

      <p className="relative mt-4 text-sm uppercase tracking-[0.22em] text-white/45">
        {phile.pronunciation}
      </p>

      <p className="relative mt-4 max-w-md text-sm leading-6 text-white/78">
        {phile.shortDescription}
      </p>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {phile.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative mt-5 flex items-center gap-2">
        {phile.colorPalette.slice(0, 5).map((color) => (
          <span
            key={color}
            className="h-3.5 w-3.5 rounded-full border border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/70">
        <span className="font-medium text-white/85">Open entry</span>
        <span className="text-white/45">{typeof score === 'number' ? Math.round(score) : 'Curated'}</span>
      </div>

      {reason ? (
        <p className="relative mt-3 text-xs uppercase tracking-[0.22em] text-white/35">{reason}</p>
      ) : null}
    </a>
  );
}
