import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { pokeapi } from '../lib/pokeapi'
import { PokemonListSchema } from '../lib/pokemon'

function getIdFromUrl(url: string): number | null {
  const m = url.match(/\/pokemon\/(\d+)\/?$/)
  return m ? Number(m[1]) : null
}

export function PokedexPage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const pageSize = 30

  const offset = (page - 1) * pageSize

  const listQuery = useQuery({
    queryKey: ['pokemon-list', offset, pageSize],
    queryFn: async () => {
      const res = await pokeapi.get(`/pokemon?offset=${offset}&limit=${pageSize}`)
      return PokemonListSchema.parse(res.data)
    },
  })

  const filtered = useMemo(() => {
    const results = listQuery.data?.results ?? []
    const needle = q.trim().toLowerCase()
    if (!needle) return results
    return results.filter((r) => r.name.includes(needle))
  }, [listQuery.data, q])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pokédex</h1>
          <p className="mt-1 text-sm text-white/60">
            Pagination, search, details — baseline for consolidating your legacy Pokédex repos.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <label className="text-xs text-white/60">Search (current page)</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="pikachu…"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
          />
        </div>
      </div>

      {listQuery.isLoading && <div className="text-sm text-white/70">Loading…</div>}
      {listQuery.isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm">
          Failed to load Pokédex list.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.map((p) => {
          const id = getIdFromUrl(p.url)
          return (
            <Link
              key={p.name}
              to={`/pokemon/${id ?? p.name}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:border-white/20"
            >
              <div className="text-xs text-white/40">#{id ?? '—'}</div>
              <div className="mt-2 font-medium capitalize group-hover:text-white">
                {p.name}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <div className="text-sm text-white/60">Page {page}</div>

        <button
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => p + 1)}
          disabled={!listQuery.data?.next}
        >
          Next
        </button>
      </div>
    </section>
  )
}
