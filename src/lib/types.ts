import { z } from 'zod'

export const NamedAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

export const TypeListSchema = z.object({
  count: z.number(),
  results: z.array(NamedAPIResourceSchema),
})

export type TypeList = z.infer<typeof TypeListSchema>

export const TypeDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      pokemon: NamedAPIResourceSchema,
      slot: z.number(),
    }),
  ),
})

export type TypeDetails = z.infer<typeof TypeDetailsSchema>
