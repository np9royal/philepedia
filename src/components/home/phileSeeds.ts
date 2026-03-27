import FlexSearch from "flexsearch";

export type Category =
	| "Sky & Weather"
	| "Water & Earth"
	| "Flora & Fauna"
	| "Arts & Media"
	| "Language & Ideas"
	| "Culture & Taste"
	| "Elements";

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
	"Sky & Weather": {
		label: "Sky",
		accent: "#8ab4f8",
		muted: "#d7e6ff"
	},
	"Water & Earth": {
		label: "Water",
		accent: "#55d6be",
		muted: "#c8fff3"
	},
	"Flora & Fauna": {
		label: "Living",
		accent: "#9ed36a",
		muted: "#e3f5c8"
	},
	"Arts & Media": {
		label: "Arts",
		accent: "#f2c86d",
		muted: "#fff0c7"
	},
	"Language & Ideas": {
		label: "Ideas",
		accent: "#f39c6b",
		muted: "#ffd9c3"
	},
	"Culture & Taste": {
		label: "Culture",
		accent: "#d7a2f3",
		muted: "#f2dcff"
	},
	Elements: {
		label: "Elemental",
		accent: "#ff7d6e",
		muted: "#ffd6cf"
	}
};

export const homePhiles: PhileSeed[] = [
	{
		slug: "pluviophile",
		name: "Pluviophile",
		category: "Sky & Weather",
		summary: "A lover of rain, storm light, and the hush that follows a downpour.",
		tags: ["rain", "rainy days", "storm", "monsoon", "petrichor"],
		aliases: ["rain lover", "rain smell", "drizzle", "downpour"],
		priority: 100,
		mood: "calm"
	},
	{
		slug: "bibliophile",
		name: "Bibliophile",
		category: "Arts & Media",
		summary: "A person who is deeply drawn to books, warm pages, and quiet shelves.",
		tags: ["books", "reading", "library", "pages", "novels"],
		aliases: ["book lover", "warm pages", "library lover"],
		priority: 98,
		mood: "reflective"
	},
	{
		slug: "selenophile",
		name: "Selenophile",
		category: "Sky & Weather",
		summary: "Someone enchanted by the moon, silver skies, and nocturnal glow.",
		tags: ["moon", "moonlight", "lunar", "night sky", "silver light"],
		aliases: ["moon lover", "moonlight", "lunar glow"],
		priority: 97,
		mood: "dreamy"
	},
	{
		slug: "thalassophile",
		name: "Thalassophile",
		category: "Water & Earth",
		summary: "A lover of the sea, tides, horizon lines, and salt-air distance.",
		tags: ["ocean", "sea", "waves", "coast", "tide"],
		aliases: ["ocean lover", "seaside", "salt water"],
		priority: 96,
		mood: "expansive"
	},
	{
		slug: "melophile",
		name: "Melophile",
		category: "Arts & Media",
		summary: "A soul tuned to music, rhythm, harmony, and the pull of a great chorus.",
		tags: ["music", "songs", "sound", "melody", "vinyl"],
		aliases: ["music lover", "song lover", "sound lover"],
		priority: 95,
		mood: "vibrant"
	},
	{
		slug: "ailurophile",
		name: "Ailurophile",
		category: "Flora & Fauna",
		summary: "A cat devotee who understands purring as a kind of private philosophy.",
		tags: ["cats", "cat", "kittens", "purring", "whiskers"],
		aliases: ["cat lover", "feline lover"],
		priority: 94,
		mood: "tender"
	},
	{
		slug: "astraphile",
		name: "Astraphile",
		category: "Elements",
		summary: "A lover of thunder, lightning, and weather with dramatic electrical force.",
		tags: ["lightning", "thunder", "storm", "electric sky"],
		aliases: ["storm lover", "lightning lover"],
		priority: 93,
		mood: "charged"
	},
	{
		slug: "nephophile",
		name: "Nephophile",
		category: "Sky & Weather",
		summary: "Someone who loves clouds, soft overcast afternoons, and shifting skies.",
		tags: ["clouds", "overcast", "mist", "sky", "fog"],
		aliases: ["cloud lover", "sky watcher"],
		priority: 92,
		mood: "soft"
	},
	{
		slug: "heliophile",
		name: "Heliophile",
		category: "Sky & Weather",
		summary: "A lover of sunlight, warmth, brightness, and long luminous days.",
		tags: ["sun", "sunlight", "warmth", "daylight"],
		aliases: ["sun lover", "bright days"],
		priority: 91,
		mood: "radiant"
	},
	{
		slug: "nyctophile",
		name: "Nyctophile",
		category: "Sky & Weather",
		summary: "A night lover who finds comfort in dark hours, quiet streets, and stillness.",
		tags: ["night", "dark", "midnight", "evening", "after dark"],
		aliases: ["night lover", "after dark"],
		priority: 90,
		mood: "quiet"
	},
	{
		slug: "potamophile",
		name: "Potamophile",
		category: "Water & Earth",
		summary: "Someone captivated by rivers, currents, and the movement of living water.",
		tags: ["river", "stream", "current", "brook"],
		aliases: ["river lover", "stream lover"],
		priority: 89,
		mood: "flowing"
	},
	{
		slug: "limnophile",
		name: "Limnophile",
		category: "Water & Earth",
		summary: "A lover of lakes, still water, and mirrored edges of the natural world.",
		tags: ["lake", "lakes", "still water", "shore"],
		aliases: ["lake lover", "water admirer"],
		priority: 88,
		mood: "still"
	},
	{
		slug: "dendrophile",
		name: "Dendrophile",
		category: "Flora & Fauna",
		summary: "A person who loves trees, canopies, bark, and forest shade.",
		tags: ["trees", "forest", "woods", "leaves", "canopy"],
		aliases: ["tree lover", "forest lover"],
		priority: 87,
		mood: "rooted"
	},
	{
		slug: "anthophile",
		name: "Anthophile",
		category: "Flora & Fauna",
		summary: "A lover of flowers, petals, color, and bloom season.",
		tags: ["flowers", "blossoms", "petals", "garden", "bloom"],
		aliases: ["flower lover", "bloom lover"],
		priority: 86,
		mood: "flourishing"
	},
	{
		slug: "geophile",
		name: "Geophile",
		category: "Water & Earth",
		summary: "A lover of landforms, stone, soil, and the texture of the earth itself.",
		tags: ["earth", "soil", "stone", "land", "ground"],
		aliases: ["earth lover", "land lover"],
		priority: 85,
		mood: "grounded"
	},
	{
		slug: "cinephile",
		name: "Cinephile",
		category: "Arts & Media",
		summary: "A devoted film lover who notices framing, pacing, and the power of a scene.",
		tags: ["film", "movies", "cinema", "screen", "director"],
		aliases: ["movie lover", "film lover"],
		priority: 84,
		mood: "curious"
	},
	{
		slug: "audiophile",
		name: "Audiophile",
		category: "Arts & Media",
		summary: "A listener obsessed with sonic fidelity, detail, and the shape of sound.",
		tags: ["sound", "hi-fi", "headphones", "speakers", "audio"],
		aliases: ["sound lover", "hi fi lover"],
		priority: 83,
		mood: "precise"
	},
	{
		slug: "logophile",
		name: "Logophile",
		category: "Language & Ideas",
		summary: "A lover of words, etymology, and the pleasure of a well-placed phrase.",
		tags: ["words", "language", "etymology", "phrases"],
		aliases: ["word lover", "language lover"],
		priority: 82,
		mood: "articulate"
	},
	{
		slug: "technophile",
		name: "Technophile",
		category: "Language & Ideas",
		summary: "A person drawn to tools, systems, interfaces, and elegant technology.",
		tags: ["technology", "devices", "systems", "interfaces"],
		aliases: ["tech lover", "technology lover"],
		priority: 81,
		mood: "sharp"
	},
	{
		slug: "anglophile",
		name: "Anglophile",
		category: "Culture & Taste",
		summary: "A lover of English culture, language, and the textures of its tradition.",
		tags: ["english culture", "britain", "uk", "english language"],
		aliases: ["english lover", "british culture"],
		priority: 80,
		mood: "cultured"
	},
	{
		slug: "francophile",
		name: "Francophile",
		category: "Culture & Taste",
		summary: "A person who admires French language, style, and cultural atmosphere.",
		tags: ["french culture", "france", "paris", "french language"],
		aliases: ["french lover", "paris lover"],
		priority: 79,
		mood: "refined"
	},
	{
		slug: "xenophile",
		name: "Xenophile",
		category: "Culture & Taste",
		summary: "A lover of foreign cultures, new places, and unfamiliar perspectives.",
		tags: ["travel", "cultures", "world", "languages"],
		aliases: ["culture lover", "world lover"],
		priority: 78,
		mood: "open"
	},
	{
		slug: "neophile",
		name: "Neophile",
		category: "Language & Ideas",
		summary: "A lover of novelty, newness, and the feeling of a first discovery.",
		tags: ["new", "novelty", "innovation", "fresh"],
		aliases: ["newness lover", "innovation lover"],
		priority: 77,
		mood: "forward"
	},
	{
		slug: "oenophile",
		name: "Oenophile",
		category: "Culture & Taste",
		summary: "A devotee of wine, aroma, tasting notes, and cellar ritual.",
		tags: ["wine", "vineyard", "cellar", "tasting"],
		aliases: ["wine lover", "vintage lover"],
		priority: 76,
		mood: "savored"
	},
	{
		slug: "cynophile",
		name: "Cynophile",
		category: "Flora & Fauna",
		summary: "A dog lover who measures joy in wagging tails and loyal companionship.",
		tags: ["dogs", "puppies", "canine", "tail wag"],
		aliases: ["dog lover", "canine lover"],
		priority: 75,
		mood: "loyal"
	},
	{
		slug: "ornithophile",
		name: "Ornithophile",
		category: "Flora & Fauna",
		summary: "A lover of birds, wings, migration, and the language of flight.",
		tags: ["birds", "wings", "flight", "songbird"],
		aliases: ["bird lover", "avian lover"],
		priority: 74,
		mood: "airy"
	},
	{
		slug: "hippophile",
		name: "Hippophile",
		category: "Flora & Fauna",
		summary: "A horse admirer drawn to motion, grace, and the force of a gallop.",
		tags: ["horses", "equestrian", "gallop", "stables"],
		aliases: ["horse lover", "equine lover"],
		priority: 73,
		mood: "elegant"
	},
	{
		slug: "pyrophile",
		name: "Pyrophile",
		category: "Elements",
		summary: "A lover of fire, ember light, and the living energy of heat and glow.",
		tags: ["fire", "embers", "flame", "heat", "sparks"],
		aliases: ["fire lover", "flame lover"],
		priority: 72,
		mood: "intense"
	}
];

export const aliasMap: Record<string, string> = {
	"rain smell": "pluviophile",
	"rainy days": "pluviophile",
	rain: "pluviophile",
	books: "bibliophile",
	book: "bibliophile",
	reading: "bibliophile",
	moon: "selenophile",
	moonlight: "selenophile",
	ocean: "thalassophile",
	sea: "thalassophile",
	waves: "thalassophile",
	cats: "ailurophile",
	cat: "ailurophile",
	music: "melophile",
	song: "melophile",
	lightning: "astraphile",
	thunder: "astraphile",
	clouds: "nephophile",
	sun: "heliophile",
	tree: "dendrophile",
	flowers: "anthophile",
	words: "logophile",
	technology: "technophile",
	"new things": "neophile",
	"wine": "oenophile",
	dogs: "cynophile",
	birds: "ornithophile",
	horses: "hippophile",
	fire: "pyrophile"
};

export const featuredSearches = ["rain", "books", "moon", "ocean", "cats", "music"];

export const particleWords = [
	{ label: "pluviophile", x: 8, y: 12, delay: 0.2, duration: 16, size: "0.88rem" },
	{ label: "bibliophile", x: 24, y: 24, delay: 1.2, duration: 18, size: "1.08rem" },
	{ label: "selenophile", x: 58, y: 10, delay: 0.7, duration: 20, size: "1rem" },
	{ label: "thalassophile", x: 70, y: 28, delay: 1.9, duration: 19, size: "0.98rem" },
	{ label: "melophile", x: 14, y: 58, delay: 0.8, duration: 17, size: "0.92rem" },
	{ label: "nephophile", x: 40, y: 18, delay: 2.2, duration: 21, size: "0.84rem" },
	{ label: "ailurophile", x: 82, y: 16, delay: 0.4, duration: 18, size: "0.86rem" },
	{ label: "astraphile", x: 90, y: 42, delay: 1.5, duration: 22, size: "0.9rem" },
	{ label: "dendrophile", x: 12, y: 82, delay: 2.1, duration: 23, size: "0.86rem" },
	{ label: "anthophile", x: 37, y: 72, delay: 1.4, duration: 20, size: "0.88rem" },
	{ label: "logophile", x: 62, y: 74, delay: 0.9, duration: 18, size: "0.92rem" },
	{ label: "pyrophile", x: 84, y: 76, delay: 1.8, duration: 19, size: "0.96rem" },
	{ label: "xenophile", x: 48, y: 48, delay: 0.5, duration: 24, size: "0.84rem" },
	{ label: "technophile", x: 26, y: 88, delay: 1.1, duration: 21, size: "0.82rem" },
	{ label: "cynophile", x: 72, y: 90, delay: 2.4, duration: 18, size: "0.86rem" }
];

const normalized = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9\s-]/g, " ")
		.replace(/\s+/g, " ")
		.replace(/\b(\w+?)s\b/g, "$1");

const phileLookup = new Map(homePhiles.map((phile) => [phile.slug, phile]));
const searchIndex = new FlexSearch.Index({
	cache: true,
	tokenize: "forward"
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
		].join(" ")
	);
}

const candidateTokens = (phile: PhileSeed) => [
	normalized(phile.name),
	...phile.tags.map(normalized),
	...phile.aliases.map(normalized),
	normalized(phile.category),
	normalized(phile.summary)
];

const isExactMatch = (query: string, phile: PhileSeed) => {
	const tokens = candidateTokens(phile);
	return tokens.some((token) => token === query);
};

const isPrefixMatch = (query: string, phile: PhileSeed) => {
	const name = normalized(phile.name);
	const tokens = candidateTokens(phile);
	return name.startsWith(query) || tokens.some((token) => token.startsWith(query));
};

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
	const searchTerm = normalizedQuery || "";

	const fallback = homePhiles
		.slice()
		.sort((a, b) => b.priority - a.priority)
		.slice(0, 6);

	if (!searchTerm) {
		return fallback.map((phile) => ({
			...phile,
			score: phile.priority,
			reason: "Featured on the launch homepage"
		}));
	}

	const flexMatches = searchIndex.search(searchTerm, 18) as string[];
	const candidateIds = new Set<string>(flexMatches.map(String));

	const scored = (candidateIds.size ? [...candidateIds].map((slug) => phileLookup.get(slug)) : homePhiles)
		.filter((phile): phile is PhileSeed => Boolean(phile))
		.map((phile) => {
			let score = phile.priority;
			let reason = "Related by mood and imagery";
			const name = normalized(phile.name);
			const tags = phile.tags.map(normalized);
			const aliases = phile.aliases.map(normalized);

			if (normalizedQuery === name) {
				score += 1000;
				reason = "Exact name match";
			} else if (tags.includes(normalizedQuery)) {
				score += 950;
				reason = "Exact tag match";
			} else if (aliases.includes(normalizedQuery)) {
				score += 925;
				reason = "Alias match";
			} else if (name.startsWith(normalizedQuery) || tags.some((tag) => tag.startsWith(normalizedQuery))) {
				score += 760;
				reason = "Prefix match";
			} else if (includesMatch(normalizedQuery, phile)) {
				score += 540;
				reason = "Close thematic match";
			}

			if (normalizedQuery in aliasMap && aliasMap[normalizedQuery] === phile.slug) {
				score += 1200;
				reason = "Canonical result for your query";
			}

			if (candidateIds.size === 0) {
				score -= 50;
			}

			if (isExactMatch(normalizedQuery, phile)) {
				score += 80;
			}

			if (phile.tags.some((tag) => normalized(tag).includes(normalizedQuery))) {
				score += 40;
			}

			if (phile.mood.includes(normalizedQuery)) {
				score += 20;
			}

			return {
				...phile,
				score,
				reason
			};
		});

	return scored
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			if (b.priority !== a.priority) return b.priority - a.priority;
			return a.name.localeCompare(b.name);
		})
		.slice(0, 6);
}

export function getHomeResultBySlug(slug: string) {
	return phileLookup.get(slug);
}
