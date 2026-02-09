import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { PokedexPage } from './pages/PokedexPage'
import { PokemonDetailsPage } from './pages/PokemonDetailsPage'

export function App() {
  return (
    <div className="min-h-full bg-ink-900">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-ink-900/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Ultimate Pokédex
          </Link>
          <nav className="text-sm text-white/70">
            <a
              className="hover:text-white"
              href="https://pokeapi.co/"
              target="_blank"
              rel="noreferrer"
            >
              Powered by PokeAPI
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<PokedexPage />} />
          <Route path="/pokemon/:nameOrId" element={<PokemonDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        Built for portfolio consolidation — © Olivier Robert-Duboille
      </footer>
    </div>
  )
}
