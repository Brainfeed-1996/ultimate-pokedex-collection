import type { PokemonType } from '../lib/typeEffectiveness'
import { defensiveMultipliers } from '../lib/typeEffectiveness'

import type React from 'react'

function Badge(props: { children: React.ReactNode; tone: 'good' | 'bad' | 'neutral' }) {
  const cls =
    props.tone === 'bad'
      ? 'border-red-500/30 bg-red-500/10 text-red-100'
      : props.tone === 'good'
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
        : 'border-white/10 bg-white/5 text-white/80'

  return (
    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>{props.children}</span>
  )
}

export function TypeEffectiveness(props: { defenderTypes: PokemonType[] }) {
  const rows = defensiveMultipliers(props.defenderTypes)

  const weak = rows.filter((r) => r.mult > 1)
  const resist = rows.filter((r) => r.mult < 1 && r.mult > 0)
  const immune = rows.filter((r) => r.mult === 0)

  return (
    <div className="space-y-3">
      <div className="text-xs text-white/50">
        Defensive multipliers vs attacks (based on a built-in chart).
      </div>

      <div className="flex flex-wrap gap-2">
        {weak.length ? (
          weak.map((r) => (
            <Badge key={`w-${r.attack}`} tone="bad">
              {r.attack} ×{r.mult}
            </Badge>
          ))
        ) : (
          <Badge tone="neutral">No weaknesses</Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {resist.length ? (
          resist.map((r) => (
            <Badge key={`r-${r.attack}`} tone="good">
              {r.attack} ×{r.mult}
            </Badge>
          ))
        ) : (
          <Badge tone="neutral">No resistances</Badge>
        )}
      </div>

      {immune.length ? (
        <div className="flex flex-wrap gap-2">
          {immune.map((r) => (
            <Badge key={`i-${r.attack}`} tone="neutral">
              immune to {r.attack}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
