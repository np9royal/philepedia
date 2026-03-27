import {
	useDeferredValue,
	useEffect,
	useRef,
	useState,
	useTransition,
	type KeyboardEvent
} from "react";
import {
	buildHomeResults,
	canonicalizeQuery,
	categoryStyles,
	featuredSearches,
	getHomeResultBySlug
} from "./phileSeeds";

type ReverseSearchProps = {
	initialQuery?: string;
};

function formatCount(count: number) {
	return new Intl.NumberFormat("en-US").format(count);
}

export default function ReverseSearch({ initialQuery = "" }: ReverseSearchProps) {
	const [query, setQuery] = useState(initialQuery);
	const deferredQuery = useDeferredValue(query);
	const [isPending, startTransition] = useTransition();
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const results = buildHomeResults(deferredQuery);
	const canonicalQuery = canonicalizeQuery(deferredQuery);
	const exploreHref = query.trim() ? `/explore?q=${encodeURIComponent(query.trim())}` : "/explore";

	useEffect(() => {
		setActiveIndex(0);
	}, [deferredQuery]);

	const openResult = (slug?: string) => {
		if (!slug) return;
		window.location.assign(`/${slug}`);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (!results.length) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActiveIndex((current) => (current + 1) % results.length);
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveIndex((current) => (current - 1 + results.length) % results.length);
		}

		if (event.key === "Enter") {
			event.preventDefault();
			openResult(results[activeIndex]?.slug);
		}

		if (event.key === "Escape") {
			event.preventDefault();
			startTransition(() => setQuery(""));
			inputRef.current?.blur();
		}
	};

	return (
		<section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.88),rgba(8,9,14,0.94))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(122,160,255,0.14),transparent_22%),radial-gradient(circle_at_20%_100%,rgba(255,192,128,0.12),transparent_26%)]" />
			<div className="relative">
				<div className="mb-5 flex items-center justify-between gap-4">
					<div>
						<p className="text-[0.68rem] uppercase tracking-[0.42em] text-white/48">Reverse search</p>
						<h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-none text-white sm:text-[2.3rem]">
							Type what you love. The site will name the passion.
						</h2>
					</div>

					<div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.28em] text-white/58 sm:block">
						Live
					</div>
				</div>

				<div className="space-y-3">
					<label className="block">
						<span className="sr-only">Search by what you love</span>
						<input
							ref={inputRef}
							value={query}
							onChange={(event) => {
								const next = event.currentTarget.value;
								startTransition(() => {
									setQuery(next);
								});
							}}
							onKeyDown={onKeyDown}
							placeholder="Search by what you love. Try rain, books, moon, ocean, cats, music."
							className="h-16 w-full rounded-[1.35rem] border border-white/12 bg-black/35 px-5 text-[1rem] text-white placeholder:text-white/34 outline-none ring-0 transition duration-200 focus:border-white/22 focus:bg-black/50 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_40px_rgba(133,160,255,0.18)] sm:h-18 sm:text-[1.05rem]"
						/>
					</label>

					<div className="flex flex-wrap items-center gap-2">
						{featuredSearches.map((term) => (
							<button
								key={term}
								type="button"
								onClick={() => {
									startTransition(() => {
										setQuery(term);
									});
									inputRef.current?.focus();
								}}
								className="rounded-full border border-white/10 bg-white/6 px-3.5 py-2 text-xs uppercase tracking-[0.24em] text-white/66 transition hover:border-white/22 hover:bg-white/10 hover:text-white"
							>
								{term}
							</button>
						))}
					</div>
				</div>

				<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
					<p className="text-sm text-white/52">
						{deferredQuery ? (
							<>
								Showing {formatCount(results.length)} refined matches for{" "}
								<span className="text-white">{canonicalQuery || deferredQuery}</span>
							</>
						) : (
							<>Featured launch philes, tuned for the first impression.</>
						)}
					</p>
					<a
						href={exploreHref}
						className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white transition hover:border-white/24 hover:bg-white/12"
					>
						Explore all
						<span aria-hidden="true">↗</span>
					</a>
				</div>

				<div className="mt-5 grid gap-3">
					{results.map((result, index) => {
						const isActive = index === activeIndex;
						const style = categoryStyles[result.category];
						const featured = getHomeResultBySlug(result.slug);

						return (
							<a
								key={result.slug}
								href={`/${result.slug}`}
								className={[
									"group relative overflow-hidden rounded-[1.4rem] border p-4 transition duration-200",
									isActive
										? "border-white/24 bg-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
										: "border-white/8 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.06]"
								].join(" ")}
								onMouseEnter={() => setActiveIndex(index)}
							>
								<div
									className="absolute inset-y-0 left-0 w-[0.32rem] rounded-l-[1.4rem]"
									style={{ background: style.accent }}
								/>
								<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)] opacity-0 transition group-hover:opacity-100" />

								<div className="relative flex items-start justify-between gap-4 pl-3">
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<span
												className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.28em]"
												style={{ color: style.muted }}
											>
												{style.label}
											</span>
											<span className="text-xs uppercase tracking-[0.24em] text-white/42">
												{result.reason}
											</span>
										</div>
										<h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl text-white transition group-hover:translate-x-[0.08rem] sm:text-[2.15rem]">
											{result.name}
										</h3>
										<p className="mt-2 max-w-xl text-sm leading-6 text-white/66">
											{result.summary}
										</p>
									</div>

									<div className="hidden shrink-0 text-right sm:block">
										<p className="text-xs uppercase tracking-[0.28em] text-white/38">
											{formatCount(result.score)}
										</p>
										<p className="mt-2 text-xs text-white/44">{result.mood}</p>
									</div>
								</div>

								<div className="relative mt-4 flex flex-wrap gap-2 pl-3">
									{result.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-[0.72rem] uppercase tracking-[0.22em] text-white/56"
										>
											{tag}
										</span>
									))}
								</div>
								{featured && (
									<div className="relative mt-3 pl-3 text-[0.76rem] uppercase tracking-[0.24em] text-white/38">
										Matched to {featured.slug}
									</div>
								)}
							</a>
						);
					})}
				</div>

				<div className="mt-5 flex items-center justify-between gap-4 border-t border-white/8 pt-4 text-xs uppercase tracking-[0.24em] text-white/38">
					<span>{isPending ? "Refining search..." : "Keyboard-ready"}</span>
					<span>Enter opens the active result</span>
				</div>
			</div>
		</section>
	);
}
