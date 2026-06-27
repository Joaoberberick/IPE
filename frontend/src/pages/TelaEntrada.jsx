import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAluno } from '../api/api'
import { useAluno } from '../context/AlunoContext'

// Simple star-field dots using CSS
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() > 0.7 ? 2 : 1,
  opacity: 0.2 + Math.random() * 0.4,
}))

export default function TelaEntrada() {
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { setAluno } = useAluno()

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nome.trim()
    if (!trimmed) {
      setError('Por favor, informe seu nome de guerra.')
      inputRef.current?.focus()
      return
    }
    setError('')
    setLoading(true)
    try {
      const aluno = await getAluno(trimmed)
      setAluno({ id: aluno.id, nome: aluno.nome, xp: aluno.xp || 0 })
      navigate('/mapa')
    } catch (err) {
      setError(err.message || 'Falha ao conectar. Verifique se o servidor está ativo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{
        background: 'linear-gradient(160deg, #1a0e00 0%, #2d1b00 30%, #3d2008 60%, #1a0e00 100%)',
      }}
    >
      {/* Decorative dot grid — subtle aged paper texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(200,169,110,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Decorative year markers */}
      <div className="absolute top-6 left-6 text-khaki/20 font-serif text-xs tracking-[0.3em] uppercase" aria-hidden="true">
        MCMXIV
      </div>
      <div className="absolute top-6 right-6 text-khaki/20 font-serif text-xs tracking-[0.3em] uppercase" aria-hidden="true">
        MCMXVIII
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Outer decorative frame */}
        <div
          className="p-px rounded"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #704214 40%, #d4af37 100%)',
          }}
        >
          <div
            className="rounded p-8"
            style={{
              background: 'linear-gradient(160deg, #2d1b00 0%, #3d2008 60%, #2d1b00 100%)',
            }}
          >
            {/* Inner double-border decoration */}
            <div className="border border-khaki/20 rounded p-6">

              {/* Header — emblem */}
              <div className="text-center mb-6">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <span className="text-gold/60 text-2xl" aria-hidden="true">✦</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <span className="text-gold text-3xl" aria-hidden="true">⚔</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <span className="text-gold/60 text-2xl" aria-hidden="true">✦</span>
                </div>

                {/* Main title */}
                <h1
                  className="font-serif font-bold text-gold text-shadow-gold mb-1"
                  style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', letterSpacing: '0.04em' }}
                >
                  TutorHistória
                </h1>

                {/* Subtitle */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-px w-8 bg-khaki/30" />
                  <p className="text-khaki text-sm font-serif tracking-[0.2em] uppercase">
                    A Grande Guerra
                  </p>
                  <div className="h-px w-8 bg-khaki/30" />
                </div>
                <p className="text-sepia text-xs tracking-widest uppercase font-semibold">
                  1914 — 1918
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-6" aria-hidden="true">
                <div className="h-px flex-1 bg-khaki/20" />
                <span className="text-khaki/30 text-xs">✦</span>
                <div className="h-px flex-1 bg-khaki/20" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label
                    htmlFor="nome"
                    className="block text-xs uppercase tracking-[0.2em] text-khaki/70 mb-2 font-semibold"
                  >
                    Nome de Guerra
                  </label>
                  <input
                    id="nome"
                    ref={inputRef}
                    type="text"
                    value={nome}
                    onChange={(e) => { setNome(e.target.value); setError('') }}
                    placeholder="Identifique-se, soldado..."
                    className="vintage-input w-full px-4 py-3 rounded text-base"
                    maxLength={60}
                    autoFocus
                    autoComplete="name"
                    aria-describedby={error ? 'nome-error' : undefined}
                    aria-invalid={!!error}
                    disabled={loading}
                  />
                  {error && (
                    <p id="nome-error" className="mt-2 text-xs text-red-400" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 px-6 rounded text-sm font-bold tracking-[0.15em] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                      Aguarde...
                    </span>
                  ) : (
                    'Iniciar Missão'
                  )}
                </button>
              </form>

              {/* Footer note */}
              <div className="mt-6 pt-4 border-t border-khaki/10 text-center">
                <p className="text-khaki/40 text-xs italic font-serif">
                  "A guerra revelou a capacidade humana tanto para<br />
                  a destruição quanto para o heroísmo."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Below-card label */}
        <p className="text-center text-khaki/30 text-xs mt-4 tracking-widest uppercase">
          Sistema de Tutoria Inteligente
        </p>
      </div>

      {/* Bottom decorative row */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2" aria-hidden="true">
        {['🔫', '⚔', '🛡', '✈', '⚓'].map((emoji, i) => (
          <span key={i} className="text-khaki/10 text-lg">{emoji}</span>
        ))}
      </div>
    </div>
  )
}
