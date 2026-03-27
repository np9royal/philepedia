import { z } from 'astro:content';

import {
  PHILE_CATEGORY_ORDER,
  PHILE_HERO_STYLE_ORDER,
  PHILE_RESERVED_SLUGS,
  PHILE_SLUG_PATTERN,
  PHILE_STATUS_ORDER
} from '../../data/phile-taxonomy';

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const phileSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(PHILE_SLUG_PATTERN, 'Phile slugs must be lowercase kebab-case.')
  .refine((slug) => !PHILE_RESERVED_SLUGS.has(slug), {
    message: 'This slug is reserved for a static route.'
  });

const phileTextSchema = z.string().trim().min(2);

const phileReferenceSchema = z.object({
  label: z.string().trim().min(2).max(120),
  url: z.string().url()
});

const phileEtymologySchema = z.object({
  word: z.string().trim().min(1).max(60),
  language: z.string().trim().min(2).max(60),
  meaning: z.string().trim().min(2).max(120)
});

const phileSeoSchema = z
  .object({
    title: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(20).max(220).optional(),
    canonical: z.string().trim().min(1).optional()
  })
  .strict()
  .optional();

function listDuplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }

    seen.add(value);
  }

  return [...duplicates];
}

export const phileSchema = z
  .object({
    slug: phileSlugSchema,
    name: z.string().trim().min(2).max(80),
    pronunciation: z.string().trim().min(2).max(120),
    definition: z.string().trim().min(10).max(220),
    shortDescription: z.string().trim().min(30).max(220),
    etymology: z.array(phileEtymologySchema).min(1).max(4),
    category: z.enum(PHILE_CATEGORY_ORDER),
    tags: z.array(phileTextSchema.max(64)).min(3).max(12),
    tagAliases: z.array(phileTextSchema.max(64)).default([]),
    moodKeywords: z.array(phileTextSchema.max(40)).min(3).max(8),
    colorPalette: z.array(z.string().trim().regex(HEX_COLOR_PATTERN)).min(3).max(5),
    heroStyle: z.enum(PHILE_HERO_STYLE_ORDER),
    youMightBeIf: z.array(z.string().trim().min(10).max(160)).min(3).max(6),
    relatedPhiles: z.array(phileSlugSchema).optional(),
    references: z.array(phileReferenceSchema).min(2).max(6),
    seo: phileSeoSchema,
    status: z.enum(PHILE_STATUS_ORDER)
  })
  .strict()
  .superRefine((value, context) => {
    const relatedPhiles = value.relatedPhiles ?? [];
    const tagAliases = value.tagAliases ?? [];

    for (const duplicate of listDuplicates(value.tags)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tags'],
        message: `Duplicate canonical tag: ${duplicate}`
      });
    }

    for (const duplicate of listDuplicates(tagAliases)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tagAliases'],
        message: `Duplicate tag alias: ${duplicate}`
      });
    }

    for (const duplicate of listDuplicates(relatedPhiles)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['relatedPhiles'],
        message: `Duplicate related phile reference: ${duplicate}`
      });
    }

    if (relatedPhiles.includes(value.slug)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['relatedPhiles'],
        message: 'A phile cannot reference itself in relatedPhiles.'
      });
    }

    for (const alias of tagAliases) {
      if (value.tags.includes(alias)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tagAliases'],
          message: `Tag alias "${alias}" duplicates a canonical tag.`
        });
      }
    }
  });
