// productSchema.js – defines Zod schema for product data
// Assumes Zod is loaded globally via CDN (window.Zod)
const { z } = window.Zod;
window.productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['boards','iot','sensors','modules']),
  chip: z.string(),
  voltage: z.string(),
  pins: z.string(),
  wireless: z.string(),
  difficulty: z.enum(['beginner','intermediate','advanced']),
  tags: z.array(z.string()),
  visual: z.string(),
  type: z.string(),
  shop: z.enum(['cybertice','allnewstep']),
  slug: z.string(),
  blurb: z.object({ th: z.string(), en: z.string() }),
  uses: z.object({ th: z.string(), en: z.string() }),
  // provenance fields (optional)
  sourceUrl: z.string().url().optional(),
  lastChecked: z.string().optional()
});
