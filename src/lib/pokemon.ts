import { z } from 'zod'

export const PokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

export const PokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(PokemonListItemSchema),
})

export type PokemonList = z.infer<typeof PokemonListSchema>

export const PokemonDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  sprites: z.object({
    front_default: z.string().nullable(),
    front_shiny: z.string().nullable().optional(),
    other: z
      .object({
        'official-artwork': z
          .object({
            front_default: z.string().nullable(),
            front_shiny: z.string().nullable().optional(),
          })
          .optional(),
      })
      .optional(),
  }),
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({ name: z.string(), url: z.string().url() }),
    }),
  ),
  abilities: z.array(
    z.object({
      ability: z.object({ name: z.string(), url: z.string().url() }),
      is_hidden: z.boolean(),
      slot: z.number(),
    }),
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: z.object({ name: z.string(), url: z.string().url() }),
    }),
  ),
  species: z.object({ name: z.string(), url: z.string().url() }),
})

export type PokemonDetails = z.infer<typeof PokemonDetailsSchema>
