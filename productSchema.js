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
  price: z.number().optional(),
  blurb: z.object({ th: z.string(), en: z.string() }),
  uses: z.object({ th: z.string(), en: z.string() }),
  // Detailed specifications and guides
  features: z.object({ th: z.array(z.string()), en: z.array(z.string()) }).optional(),
  workingPrinciple: z.object({ th: z.string(), en: z.string() }).optional(),
  wiring: z.object({
    th: z.array(z.object({ pin: z.string(), connectTo: z.string(), note: z.string() })),
    en: z.array(z.object({ pin: z.string(), connectTo: z.string(), note: z.string() }))
  }).optional(),
  libraries: z.array(z.object({
    name: z.string(),
    installGuide: z.object({ th: z.string(), en: z.string() }),
    isBuiltIn: z.boolean().optional()
  })).optional(),
  sampleCode: z.object({
    language: z.string(),
    code: z.string(),
    explanation: z.object({ th: z.string(), en: z.string() }),
    configurablePin: z.string().optional()
  }).optional(),
  // provenance fields (optional)
  sourceUrl: z.string().url().optional(),
  lastChecked: z.string().optional()
});
