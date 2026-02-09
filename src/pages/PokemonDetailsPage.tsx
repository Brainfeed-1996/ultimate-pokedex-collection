import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { pokeapi } from '../lib/pokeapi'
import { PokemonDetailsSchema } from '../lib/pokemon'

function spriteUrl(data: ReturnType<typeof PokemonDetailsSchema.parse>) {
  return (
    data.sprites.other?.['official-artwork']?.front_default ?? data.sprites.front_default
  )
}

export function PokemonDetailsPage() {
  const { nameOrId } = useParams<{ nameOrId: string }>()

  const detailsQuery = useQuery({
    queryKey: ['pokemon-details', nameOrId],
    queryFn: async () => {
      const res = await pokeapi.get(`/pokemon/${nameOrId}`)
      return PokemonDetailsSchema.parse(res.data)
    },
    enabled: !!nameOrId,
  })

  const p = detailsQuery.data

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Link className="text-sm text-white/70 hover:text-white" to="/">
          ← Back
        </Link>
      </div>

      {detailsQuery.isLoading && <div className="text-sm text-white/70">Loading…</div>}
      {detailsQuery.isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm">
          Failed to load Pokémon details.
        </div>
      )}

      {p && (
        <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/40">#{p.id}</div>
            <div className="mt-1 text-2xl font-semibold capitalize">{p.name}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.types
                .slice()
                .sort((a, b) => a.slot - b.slot)
                .map((t) => (
                  <span
                    key={t.type.name}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize"
                  >
                    {t.type.name}
                  </span>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl bg-black/20">
              {spriteUrl(p) ? (
                <img
                  src={spriteUrl(p) ?? undefined}
                  alt={p.name}
                  className="h-72 w-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-white/40">
                  No sprite
                </div>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                <dt className="text-xs text-white/50">Height</dt>
                <dd className="mt-1 font-medium">{(p.height / 10).toFixed(1)} m</dd>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                <dt className="text-xs text-white/50">Weight</dt>
                <dd className="mt-1 font-medium">{(p.weight / 10).toFixed(1)} kg</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-sm font-semibold">Abilities</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {p.abilities
                  .slice()
                  .sort((a, b) => a.slot - b.slot)
                  .map((a) => (
                    <li
                      key={a.ability.name}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="capitalize">{a.ability.name}</span>
                      {a.is_hidden && (
                        <span className="ml-2 text-xs text-white/50">(hidden)</span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="text-sm font-semibold">Base stats</h2>
              <div className="mt-2 space-y-2">
                {p.stats.map((s) => (
                  <div key={s.stat.name} className="grid grid-cols-[120px,1fr,44px] items-center gap-3">
                    <div className="text-xs capitalize text-white/60">{s.stat.name}</div>
                    <div className="h-2 overflow-hidden rounded bg-white/10">
                      <div
                        className="h-full rounded bg-indigo-400"
                        style={{ width: `${Math.min(100, (s.base_stat / 200) * 100)}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-white/70">{s.base_stat}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              Next: evolution chain + type effectiveness calculator (planned in consolidation backlog).
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
