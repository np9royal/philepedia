import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { phileSchema } from './lib/philes/schema';

export const collections = {
  philes: defineCollection({
    loader: glob({
      base: './src/content/philes',
      pattern: '**/*.md'
    }),
    schema: phileSchema
  })
};
