import { Link } from 'react-router-dom'

export function EvolutionChain(props: { names: string[] }) {
  if (!props.names.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {props.names.map((name, idx) => (
        <div key={name} className="flex items-center gap-2">
          <Link
            to={`/pokemon/${name}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize hover:border-white/20"
          >
            {name}
          </Link>
          {idx < props.names.length - 1 && <span className="text-xs text-white/40">→</span>}
        </div>
      ))}
    </div>
  )
}
