import { defineContentConfig, defineCollection, z } from '@nuxt/content';

const schema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  created_at: z.string().datetime(),
  published_at: z.string().datetime().optional(),
  draft: z.boolean().default(false),
  updated_at: z.array(z.string().datetime()).default([]),
  tags: z.array(z.string()).default([]),
  type: z.enum(['article', 'rambling', 'announcement']).default('article'),
  isPinned: z.boolean().default(false),
  tech_stack: z.array(z.string()).default([]),
  tech_stack_percent: z.array(z.number()).default([]),
  tech_stack_icon_names: z.array(z.string()).default([]),
  tech_stack_theme_colors: z.array(z.string()).default([]),
  rawbody: z.string(),
});

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: schema,
    }),
  },
});
