import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAluno } from '../context/AlunoContext'
import XPCounter from './XPCounter'

export default function Navbar() {
  const { alunoNome, xp, nivel, alunoId } = useAluno()
  const navigate = useNavigate()

  if (!alunoId) return null

  return (
    <nav className="sticky top-0 z-50 border-b border-khaki/20 bg-dark-brown/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo / brand */}
        <Link
          to="/mapa"
          className="flex items-center gap-2 group"
          aria-label="Ir para o mapa"
        >
          <span className="text-gold text-xl" aria-hidden="true">⚔</span>
          <span
            className="font-serif font-bold text-parchment text-base tracking-wide group-hover:text-gold transition-colors"
          >
            TutorHistória
          </span>
        </Link>

        {/* Center: student name */}
        {alunoNome && (
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-khaki/50 text-xs uppercase tracking-widest">Soldado</span>
            <span className="text-parchment font-serif font-semibold">{alunoNome}</span>
          </div>
        )}

        {/* Right: XP + level + links */}
        <div className="flex items-center gap-4">
          <XPCounter xp={xp} nivel={nivel} compact />
          <Link
            to="/mapa"
            className="hidden sm:block text-xs text-khaki/70 uppercase tracking-widest hover:text-parchment transition-colors"
          >
            Mapa
          </Link>
          <Link
            to="/progresso"
            className="hidden sm:block text-xs text-khaki/70 uppercase tracking-widest hover:text-parchment transition-colors"
          >
            Progresso
          </Link>
        </div>
      </div>
    </nav>
  )
}
