export const categories = [
  'Sky & Weather',
  'Water & Earth',
  'Flora & Fauna',
  'Arts & Media',
  'Language & Ideas',
  'Culture & Taste',
  'Elements',
] as const;

export const heroStyles = [
  'rain',
  'rainstorm',
  'clouds',
  'lightning',
  'moonlight',
  'sunbeam',
  'midnight',
  'starlight',
  'waves',
  'river',
  'lake',
  'forest',
  'bloom',
  'earth',
  'pages',
  'film',
  'sound',
  'waveform',
  'type',
  'spark',
  'signal',
  'glow',
  'flag',
  'cafe',
  'passport',
  'vine',
  'cat',
  'dog',
  'wing',
  'gallop',
  'embers',
] as const;

export const sortModes = ['relevance', 'az'] as const;

export type PhileCategory = (typeof categories)[number];
export type PhileMood = string;
export type HeroStyle = (typeof heroStyles)[number];
export type SortMode = (typeof sortModes)[number];

export type CategoryFilter = PhileCategory | 'all';
export type MoodFilter = PhileMood | 'all';

export interface PhileEntry {
  slug: string;
  name: string;
  pronunciation: string;
  definition: string;
  shortDescription: string;
  category: PhileCategory;
  mood: PhileMood;
  tags: string[];
  tagAliases: string[];
  moodKeywords: string[];
  colorPalette: string[];
  heroStyle: HeroStyle;
  launchPriority: number;
  etymology?: Array<{
    word: string;
    language: string;
    meaning: string;
  }>;
  youMightBeIf?: string[];
  relatedPhiles?: string[];
  references?: Array<{
    label: string;
    url: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
  };
  status?: 'draft' | 'published';
}

export interface SearchFilters {
  query: string;
  category: CategoryFilter;
  mood: MoodFilter;
  sort: SortMode;
}

export interface RankedPhile extends PhileEntry {
  score: number;
  matchReason: string;
}
