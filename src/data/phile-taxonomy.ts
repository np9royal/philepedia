export const PHILE_CATEGORY_ORDER = [
  'Sky & Weather',
  'Water & Earth',
  'Flora & Fauna',
  'Arts & Media',
  'Language & Ideas',
  'Culture & Taste',
  'Elements'
] as const;

export type PhileCategory = (typeof PHILE_CATEGORY_ORDER)[number];

export const PHILE_CATEGORY_THEMES: Record<
  PhileCategory,
  {
    slug: string;
    summary: string;
    accent: string;
    glow: string;
    surface: string;
    keywords: readonly string[];
  }
> = {
  'Sky & Weather': {
    slug: 'sky-weather',
    summary: 'Rain, light, storms, auroras, and the moods above us.',
    accent: '#8cbcff',
    glow: '#d7ecff',
    surface: '#1b2740',
    keywords: ['rain', 'storm', 'moon', 'sun', 'cloud', 'sky']
  },
  'Water & Earth': {
    slug: 'water-earth',
    summary: 'Oceans, rivers, forests, mountains, and place-based longing.',
    accent: '#66ccb8',
    glow: '#d7fff2',
    surface: '#17322d',
    keywords: ['ocean', 'sea', 'river', 'forest', 'mountain', 'earth']
  },
  'Flora & Fauna': {
    slug: 'flora-fauna',
    summary: 'Animals, plants, and the living textures of the world.',
    accent: '#b4d96a',
    glow: '#eefbc2',
    surface: '#26331b',
    keywords: ['cat', 'dog', 'bird', 'flower', 'tree', 'garden']
  },
  'Arts & Media': {
    slug: 'arts-media',
    summary: 'Books, cinema, sound, image, craft, and cultural form.',
    accent: '#d7a5ff',
    glow: '#f1dcff',
    surface: '#2a1f3a',
    keywords: ['books', 'music', 'film', 'art', 'poetry', 'design']
  },
  'Language & Ideas': {
    slug: 'language-ideas',
    summary: 'Words, knowledge, systems, intellect, and curiosity.',
    accent: '#f7c873',
    glow: '#fff0c9',
    surface: '#3a2b16',
    keywords: ['words', 'meaning', 'knowledge', 'learning', 'logic', 'ideas']
  },
  'Culture & Taste': {
    slug: 'culture-taste',
    summary: 'Cultures, countries, flavors, rituals, and selective affection.',
    accent: '#ff9d8c',
    glow: '#ffdcd6',
    surface: '#3a1f1a',
    keywords: ['travel', 'country', 'wine', 'food', 'culture', 'taste']
  },
  Elements: {
    slug: 'elements',
    summary: 'Fire, ice, stone, metal, and elemental qualities of feeling.',
    accent: '#9ea7ff',
    glow: '#e0e4ff',
    surface: '#1f243f',
    keywords: ['fire', 'ice', 'stone', 'metal', 'lightning', 'mist']
  }
};

export const PHILE_HERO_STYLE_ORDER = [
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
  'flag',
  'cafe',
  'passport',
  'vine',
  'cat',
  'dog',
  'wing',
  'gallop',
  'embers'
] as const;

export type PhileHeroStyle = (typeof PHILE_HERO_STYLE_ORDER)[number];

function titleCase(value: string): string {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export const PHILE_HERO_STYLES: Record<
  PhileHeroStyle,
  {
    label: string;
    motif: string;
    summary: string;
  }
> = Object.fromEntries(
  PHILE_HERO_STYLE_ORDER.map((style) => [
    style,
    {
      label: titleCase(style),
      motif: `${style.replace(/-/g, ' ')}-driven atmospheric motion`,
      summary: `A ${style.replace(/-/g, ' ')} motif tuned to the phile's mood and palette.`
    }
  ])
) as Record<
  PhileHeroStyle,
  {
    label: string;
    motif: string;
    summary: string;
  }
>;

export const PHILE_STATUS_ORDER = ['draft', 'published'] as const;

export type PhileStatus = (typeof PHILE_STATUS_ORDER)[number];

export const PHILE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const PHILE_RESERVED_SLUGS = new Set([
  '',
  'index',
  'explore',
  'philes',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
  'favicon.svg',
  'og',
  'search',
  'api',
  '404'
]);

export const PHILE_SITE_NAME = 'Philepedia';
export const PHILE_SITE_TAGLINE = 'The living encyclopedia of passions.';
