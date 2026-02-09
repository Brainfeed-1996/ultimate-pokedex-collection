import { z } from 'zod'

export const NamedAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
})

export const PokemonSpeciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  evolution_chain: z.object({ url: z.string().url() }),
})

export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>

const EvolutionChainLinkSchema: z.ZodType<{
  species: { name: string; url: string }
  evolves_to: any[]
}> = z.lazy(() =>
  z.object({
    species: NamedAPIResourceSchema,
    evolves_to: z.array(EvolutionChainLinkSchema),
  }),
)

export const EvolutionChainSchema = z.object({
  id: z.number(),
  chain: EvolutionChainLinkSchema,
})

export type EvolutionChain = z.infer<typeof EvolutionChainSchema>

export function flattenEvolutionChain(chain: EvolutionChain): string[] {
  const out: string[] = []
  const walk = (node: z.infer<typeof EvolutionChainLinkSchema>) => {
    out.push(node.species.name)
    for (const child of node.evolves_to) walk(child)
  }
  walk(chain.chain)
  return out
}
