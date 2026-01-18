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
	}),
});

export const collections = { projects, blog };
