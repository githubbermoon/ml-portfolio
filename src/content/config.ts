import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		date: z.date(),
		tags: z.array(z.string()),
		featured: z.boolean().default(false),
	}),
});

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		date: z.date(),
		tags: z.array(z.string()),
		realm: z.string().optional(),
		type: z.string().optional(),
		mood: z.string().optional(),
	}),
});

const realms = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		date: z.date(),
		updated: z.date().optional(),
		category: z.enum(['texts-systems', 'origins-implementations', 'field-notes', 'essay']),
		kind: z.enum(['study', 'essay', 'research-note', 'experiment', 'implementation', 'field-note']),
		status: z.enum(['draft', 'ongoing', 'published', 'archived']).default('draft'),
		cover: z.string().optional(),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { projects, blog, realms };
