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
	featuredSearches
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
	const [isCompact, setIsCompact] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const results = buildHomeResults(deferredQuery);
	const visibleResults = results.slice(0, isCompact ? 2 : 4);
	const canonicalQuery = canonicalizeQuery(deferredQuery);
	const exploreHref = query.trim() ? `/explore?q=${encodeURIComponent(query.trim())}` : "/explore";

	useEffect(() => {
		setActiveIndex(0);
	}, [deferredQuery]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(max-width: 639px)");
		const syncViewport = () => setIsCompact(mediaQuery.matches);

		syncViewport();

		if (typeof mediaQuery.addEventListener === "function") {
			mediaQuery.addEventListener("change", syncViewport);
			return () => mediaQuery.removeEventListener("change", syncViewport);
		}

		const legacyMediaQuery = mediaQuery as unknown as {
			addListener?: (listener: () => void) => void;
			removeListener?: (listener: () => void) => void;
		};

		legacyMediaQuery.addListener?.(syncViewport);
		return () => legacyMediaQuery.removeListener?.(syncViewport);
	}, []);

	const openResult = (slug?: string) => {
		if (!slug) return;
		window.location.assign(`/${slug}`);
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (!visibleResults.length) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActiveIndex((current) => (current + 1) % visibleResults.length);
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveIndex((current) => (current - 1 + visibleResults.length) % visibleResults.length);
		}

		if (event.key === "Enter") {
			event.preventDefault();
			openResult(visibleResults[activeIndex]?.slug);
		}

		if (event.key === "Escape") {
			event.preventDefault();
			startTransition(() => setQuery(""));
			inputRef.current?.blur();
		}
	};

	return (
		<section className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,15,22,0.92),rgba(8,9,14,0.97))] p-3.5 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:rounded-[2rem] sm:p-5 lg:p-6">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(122,160,255,0.1),transparent_22%),radial-gradient(circle_at_20%_100%,rgba(255,192,128,0.08),transparent_26%)]" />
			<div className="relative">
				<div className="mb-3.5 flex items-start justify-between gap-3 sm:mb-5 sm:gap-4">
					<div className="max-w-xl">
						<p className="text-[0.66rem] uppercase tracking-[0.42em] text-white/42">Reverse search</p>
						<h2 className="mt-2 max-w-lg font-[family-name:var(--font-display)] text-[1.42rem] leading-[1.02] text-white sm:text-[2.2rem] lg:text-[2.35rem]">
							{isCompact ? "Type what you love. We’ll find the phile." : "Type what you love. The site will name the passion."}
						</h2>
						<p className="mt-2.5 max-w-lg text-[0.88rem] leading-6 text-white/58 sm:mt-3 sm:text-sm sm:leading-7">
							{isCompact
								? "Start with a feeling, then open the word that fits it."
								: "Start with a feeling, then move into the phile that gives it a name."}
						</p>
					</div>

					<div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/58 sm:block">
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
							className="h-[3.35rem] w-full rounded-[1.1rem] border border-white/12 bg-black/35 px-4 text-[0.95rem] text-white placeholder:text-white/34 outline-none ring-0 transition duration-200 focus:border-white/22 focus:bg-black/50 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_40px_rgba(133,160,255,0.14)] sm:h-[4rem] sm:rounded-[1.35rem] sm:px-5 sm:text-[1.05rem]"
						/>
					</label>

					<div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0">
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
								className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.22em] text-white/66 transition hover:border-white/22 hover:bg-white/10 hover:text-white sm:px-3.5 sm:py-2 sm:text-[0.66rem] sm:tracking-[0.24em]"
							>
								{term}
							</button>
						))}
					</div>
				</div>

				<div className="mt-3.5 flex flex-col gap-3 border-t border-white/8 pt-3 text-sm text-white/52 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
					<p className="text-[0.84rem] leading-6 sm:text-sm">
						{deferredQuery ? (
							<>
								Showing {formatCount(visibleResults.length)} of {formatCount(results.length)} refined matches for{" "}
								<span className="text-white">{canonicalQuery || deferredQuery}</span>
							</>
						) : (
							<>Featured philes from the living collection.</>
						)}
					</p>
					<a
						href={exploreHref}
						className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-[0.66rem] uppercase tracking-[0.22em] text-white transition hover:border-white/24 hover:bg-white/12 sm:w-auto sm:text-[0.7rem] sm:tracking-[0.26em]"
					>
						Explore all
						<span aria-hidden="true">↗</span>
					</a>
				</div>

				<div className="mt-3.5 grid gap-2.5 sm:mt-5 sm:gap-3">
					{visibleResults.map((result, index) => {
						const isActive = index === activeIndex;
						const style = categoryStyles[result.category];

						return (
							<a
								key={result.slug}
								href={`/${result.slug}`}
								className={[
									"group relative overflow-hidden rounded-[1.2rem] border p-3.5 text-left transition duration-200 sm:rounded-[1.45rem] sm:p-5",
									isActive
										? "border-white/24 bg-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
										: "border-white/8 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.055]"
								].join(" ")}
								onMouseEnter={() => setActiveIndex(index)}
							>
								<div
									className="absolute inset-y-0 left-0 w-[0.28rem] rounded-l-[1.45rem]"
									style={{ background: style.accent }}
								/>
								<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_32%)] opacity-0 transition group-hover:opacity-100" />

								<div className="relative flex items-start justify-between gap-3 pl-2.5 sm:pl-3.5">
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2">
											<span
												className="inline-flex items-center rounded-full border border-white/10 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.24em] sm:text-[0.62rem] sm:tracking-[0.28em]"
												style={{ color: style.muted }}
											>
												{style.label}
											</span>
											<span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/38 sm:text-[0.66rem] sm:tracking-[0.22em]">
												{index === 0 ? "Top match" : `Match ${index + 1}`}
											</span>
										</div>
										<h3 className="mt-2 font-[family-name:var(--font-display)] text-[1.42rem] leading-[1.02] text-white transition group-hover:translate-x-[0.08rem] sm:mt-2.5 sm:text-[2rem]">
											{result.name}
										</h3>
										<p className="mt-1.5 max-w-xl text-[0.84rem] leading-6 text-white/66 sm:mt-2 sm:text-sm sm:leading-7">
											{result.summary}
										</p>
									</div>

									<span className="hidden shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-white/46 sm:inline-flex">
										Open
									</span>
								</div>

								<div className="relative mt-3 flex flex-wrap gap-2 pl-2.5 sm:mt-4 sm:pl-3.5">
									{result.tags.slice(0, index === 0 ? 3 : 2).map((tag) => (
										<span
											key={tag}
											className="rounded-full border border-white/8 bg-black/18 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-white/56 sm:px-3 sm:text-[0.68rem] sm:tracking-[0.22em]"
										>
											{tag}
										</span>
									))}
								</div>
							</a>
						);
					})}
				</div>

				<div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-3 text-[0.62rem] uppercase tracking-[0.2em] text-white/40 sm:mt-5 sm:gap-3 sm:pt-4 sm:text-[0.68rem] sm:tracking-[0.24em]">
					<span>{isPending ? "Refining search..." : isCompact ? "Tap a card" : "Keyboard-ready"}</span>
					<span>{isCompact ? `${formatCount(visibleResults.length)} visible results` : "Arrow keys move the visible results"}</span>
				</div>
			</div>
		</section>
	);
}
