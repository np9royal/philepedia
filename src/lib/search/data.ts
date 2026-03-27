import type { HeroStyle, PhileCategory, PhileEntry, PhileMood } from './types';
import { PHILE_LAUNCH_PRIORITY_MAP } from '../../data/phile-launch-order';

type PhileFrontmatter = Omit<PhileEntry, 'mood' | 'launchPriority'> & {
  status?: 'draft' | 'published';
};

const moodMatchers: Array<{ mood: PhileMood; terms: string[] }> = [
  { mood: 'Calm', terms: ['calm', 'quiet', 'soft', 'still', 'glassy', 'restful', 'flowing'] },
  { mood: 'Reflective', terms: ['reflective', 'thoughtful', 'studious', 'anchored', 'grounded', 'steady'] },
  { mood: 'Luminous', terms: ['luminous', 'glowing', 'bright', 'awe', 'celestial', 'moon', 'sun'] },
  { mood: 'Electric', terms: ['electric', 'charged', 'fast', 'innovation', 'technology', 'music'] },
  { mood: 'Warm', terms: ['warm', 'cozy', 'fragrant', 'golden', 'rich', 'elegant', 'organic'] },
  { mood: 'Nostalgic', terms: ['nostalgic', 'quiet', 'night', 'pages', 'heritage', 'classic', 'paper'] },
  { mood: 'Intense', terms: ['intense', 'dramatic', 'bold', 'fire', 'storm', 'powerful', 'cinematic'] },
  { mood: 'Playful', terms: ['playful', 'curious', 'mischievous', 'open', 'adventurous', 'worldly'] },
];

function deriveMood(phile: PhileFrontmatter): PhileMood {
  const haystack = [
    phile.slug,
    phile.name,
    phile.definition,
    phile.shortDescription,
    phile.category,
    phile.heroStyle,
    ...phile.tags,
    ...phile.tagAliases,
    ...phile.moodKeywords,
  ]
    .join(' ')
    .toLowerCase();

  const rankedMatches = moodMatchers
    .map(({ mood, terms }) => {
      const score = terms.reduce((count, term) => count + (haystack.includes(term) ? 1 : 0), 0);
      return { mood, score };
    })
    .sort((left, right) => right.score - left.score);

  if (rankedMatches[0] && rankedMatches[0].score > 0) {
    return rankedMatches[0].mood;
  }

  return 'Reflective';
}

function normalizePhile(path: string, frontmatter: Partial<PhileFrontmatter> & { slug?: string }): PhileEntry | null {
  if (frontmatter.status === 'draft') {
    return null;
  }

  const slugFromPath = path.split('/').pop()?.replace(/\.md$/, '') ?? frontmatter.slug;
  if (!slugFromPath || !frontmatter.name || !frontmatter.category || !frontmatter.definition) {
    return null;
  }

  const slug = frontmatter.slug ?? slugFromPath;
  const launchPriority = PHILE_LAUNCH_PRIORITY_MAP.get(slug) ?? 0;

  return {
    slug,
    name: frontmatter.name,
    pronunciation: frontmatter.pronunciation ?? '',
    definition: frontmatter.definition,
    shortDescription: frontmatter.shortDescription ?? frontmatter.definition,
    category: frontmatter.category as PhileCategory,
    mood: deriveMood({
      slug,
      name: frontmatter.name,
      pronunciation: frontmatter.pronunciation ?? '',
      definition: frontmatter.definition,
      shortDescription: frontmatter.shortDescription ?? frontmatter.definition,
      category: frontmatter.category as PhileCategory,
      tags: frontmatter.tags ?? [],
      tagAliases: frontmatter.tagAliases ?? [],
      moodKeywords: frontmatter.moodKeywords ?? [],
      colorPalette: frontmatter.colorPalette ?? [],
      heroStyle: frontmatter.heroStyle ?? 'glow',
      etymology: frontmatter.etymology,
      youMightBeIf: frontmatter.youMightBeIf,
      relatedPhiles: frontmatter.relatedPhiles,
      references: frontmatter.references,
      seo: frontmatter.seo,
      status: frontmatter.status,
    }),
    tags: frontmatter.tags ?? [],
    tagAliases: frontmatter.tagAliases ?? [],
    moodKeywords: frontmatter.moodKeywords ?? [],
    colorPalette: frontmatter.colorPalette ?? [],
    heroStyle: (frontmatter.heroStyle ?? 'glow') as HeroStyle,
    launchPriority,
    etymology: frontmatter.etymology,
    youMightBeIf: frontmatter.youMightBeIf,
    relatedPhiles: frontmatter.relatedPhiles,
    references: frontmatter.references,
    seo: frontmatter.seo,
    status: frontmatter.status ?? 'published',
  };
}

const markdownModules = import.meta.glob('../../content/philes/*.md', {
  eager: true,
}) as Record<string, { frontmatter: Partial<PhileFrontmatter> & { slug?: string } }>;

export const launchPhiles = Object.entries(markdownModules)
  .map(([path, module]) => normalizePhile(path, module.frontmatter))
  .filter((phile): phile is PhileEntry => Boolean(phile))
  .sort((left, right) => right.launchPriority - left.launchPriority || left.name.localeCompare(right.name));
