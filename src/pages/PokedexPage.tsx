import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { pokeapi } from '../lib/pokeapi'
import { PokemonListSchema } from '../lib/pokemon'
import { TypeDetailsSchema, TypeListSchema } from '../lib/types'

function getIdFromUrl(url: string): number | null {
  const m = url.match(/\/pokemon\/(\d+)\/?$/)
  return m ? Number(m[1]) : null
}

type SortMode = 'id' | 'name'

export function PokedexPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('')
  const [sort, setSort] = useState<SortMode>('id')

  const pageSize = 30

  // Global list (lightweight: names + urls)
  const allQuery = useQuery({
    queryKey: ['pokemon-list-all'],
    queryFn: async () => {
      const res = await pokeapi.get('/pokemon?offset=0&limit=2000')
      return PokemonListSchema.parse(res.data)
    },
  })

  const typesQuery = useQuery({
    queryKey: ['types'],
    queryFn: async () => {
      const res = await pokeapi.get('/type')
      return TypeListSchema.parse(res.data)
    },
  })

  const typeMembersQuery = useQuery({
    queryKey: ['type-members', type],
    queryFn: async () => {
      if (!type) return new Set<string>()
      const res = await pokeapi.get(`/type/${type}`)
      const data = TypeDetailsSchema.parse(res.data)
      return new Set<string>(data.pokemon.map((p) => p.pokemon.name))
    },
    enabled: !!type,
  })

  const filteredSorted = useMemo(() => {
    const results = allQuery.data?.results ?? []
    const needle = q.trim().toLowerCase()

    const typeSet = type ? typeMembersQuery.data : undefined

    const filtered = results.filter((r) => {
      if (needle && !r.name.includes(needle)) return false
      if (typeSet && !typeSet.has(r.name)) return false
      return true
    })

    const sorted = filtered.slice().sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      // sort=id
      const ida = getIdFromUrl(a.url) ?? Number.MAX_SAFE_INTEGER
      const idb = getIdFromUrl(b.url) ?? Number.MAX_SAFE_INTEGER
      return ida - idb
    })

    return sorted
  }, [allQuery.data, q, sort, type, typeMembersQuery.data])

  const pageCount = Math.max(1, Math.ceil(filteredSorted.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * pageSize
  const current = filteredSorted.slice(start, start + pageSize)

  const loading = allQuery.isLoading || (type ? typeMembersQuery.isLoading : false)
  const error = allQuery.isError || typesQuery.isError || typeMembersQuery.isError

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pokédex</h1>
          <p className="mt-1 text-sm text-white/60">
            Global search + type filter + sorting. Consolidation baseline for your legacy Pokédex repos.
          </p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[760px]">
          <div>
            <label className="text-xs text-white/60">Search (global)</label>
            <input
              value={q}
              onChange={(e) => {
                setPage(1)
                setQ(e.target.value)
              }}
              placeholder="pikachu…"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Type</label>
            <select
              value={type}
              onChange={(e) => {
                setPage(1)
                setType(e.target.value)
              }}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
            >
              <option value="">All</option>
              {(typesQuery.data?.results ?? [])
                .map((t) => t.name)
                .filter((name) => !['unknown', 'shadow'].includes(name))
                .sort()
                .map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-white/60">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
            >
              <option value="id">By ID</option>
              <option value="name">By name</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="text-sm text-white/70">Loading…</div>}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm">
          Failed to load Pokédex data.
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-white/60">
        <div>
          Showing <span className="text-white">{filteredSorted.length}</span> Pokémon
        </div>
        <div>
          Page <span className="text-white">{safePage}</span> / {pageCount}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {current.map((p) => {
          const id = getIdFromUrl(p.url)
          return (
            <Link
              key={p.name}
              to={`/pokemon/${id ?? p.name}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:border-white/20"
            >
              <div className="text-xs text-white/40">#{id ?? '—'}</div>
              <div className="mt-2 font-medium capitalize group-hover:text-white">{p.name}</div>
            </Link>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage === 1}
        >
          Prev
        </button>

        <div className="text-sm text-white/60">Page {safePage}</div>

        <button
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={safePage >= pageCount}
        >
          Next
        </button>
      </div>
    </section>
  )
}
