import React, { useEffect, useRef, useState } from 'react'
import { getNivelInfo } from '../context/AlunoContext'

/**
 * XPCounter — animated XP display showing total XP and rank.
 * @param {number} xp - current total XP
 * @param {number} [gainedXP] - XP gained in this action (triggers pop animation)
 * @param {string} nivel - current level name
 * @param {boolean} [compact] - smaller layout for navbar
 */
export default function XPCounter({ xp = 0, gainedXP = 0, nivel, compact = false }) {
  const [displayXP, setDisplayXP] = useState(xp)
  const [showPop, setShowPop] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const target = xp
    const from = displayXP
    if (from === target) return

    const duration = 800
    let startTime = null

    function tick(ts) {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 2)
      setDisplayXP(Math.round(from + (target - from) * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [xp])

  useEffect(() => {
    if (gainedXP > 0) {
      setShowPop(true)
      const t = setTimeout(() => setShowPop(false), 1600)
      return () => clearTimeout(t)
    }
  }, [gainedXP])

  const nivelInfo = getNivelInfo(xp)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="text-gold font-bold tabular-nums text-sm">{displayXP.toLocaleString('pt-BR')}</span>
          <span className="text-khaki/60 text-xs ml-0.5">xp</span>
          {showPop && gainedXP > 0 && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-gold text-xs font-bold animate-xp-pop whitespace-nowrap pointer-events-none">
              +{gainedXP} XP
            </span>
          )}
        </div>
        <span className="rank-badge">{nivel || nivelInfo.nivel}</span>
      </div>
    )
  }

  return (
    <div className="relative inline-block">
      <div className="flex flex-col items-center gap-1">
        {/* XP number */}
        <div className="relative">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-2xl text-gold tabular-nums" style={{ fontFamily: 'Georgia, serif' }}>
              {displayXP.toLocaleString('pt-BR')}
            </span>
            <span className="text-khaki/70 text-sm uppercase tracking-widest">XP</span>
          </div>
          {/* +XP pop */}
          {showPop && gainedXP > 0 && (
            <span
              className="absolute -top-6 right-0 text-gold font-bold text-base animate-xp-pop pointer-events-none"
              aria-live="polite"
            >
              +{gainedXP}
            </span>
          )}
        </div>

        {/* Level progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-khaki/60 mb-1">
            <span className="uppercase tracking-wider text-[10px]">{nivelInfo.nivel}</span>
            {nivelInfo.nextNivel && (
              <span className="uppercase tracking-wider text-[10px]">{nivelInfo.nextNivel}</span>
            )}
          </div>
          <div className="h-1.5 bg-dark-brown rounded-full overflow-hidden border border-gold/20">
            <div
              className="h-full bg-gradient-to-r from-gold/70 to-gold rounded-full bar-animate"
              style={{ width: `${nivelInfo.pct}%` }}
            />
          </div>
          {nivelInfo.nextNivel && (
            <p className="text-[10px] text-khaki/50 mt-0.5 text-right tabular-nums">
              {nivelInfo.xpToNext} XP para {nivelInfo.nextNivel}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
