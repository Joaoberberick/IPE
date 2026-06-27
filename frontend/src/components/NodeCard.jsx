import React from 'react'
import ProgressBar from './ProgressBar'

const STATUS_CONFIG = {
  locked: {
    label: 'Bloqueado',
    icon: '🔒',
    borderClass: 'border-battle-grey/40',
    bgClass: 'bg-gradient-to-br from-dark-brown/80 to-deep-sepia/50',
    textClass: 'text-battle-grey',
    titleClass: 'text-battle-grey',
    cursor: 'cursor-not-allowed',
    opacity: 'opacity-60',
    barColor: 'khaki',
    badgeBg: 'bg-battle-grey/20 text-battle-grey',
  },
  available: {
    label: 'Disponível',
    icon: '📖',
    borderClass: 'border-khaki/60 hover:border-gold',
    bgClass: 'bg-gradient-to-br from-dark-brown to-deep-sepia',
    textClass: 'text-khaki',
    titleClass: 'text-parchment',
    cursor: 'cursor-pointer',
    opacity: '',
    barColor: 'khaki',
    badgeBg: 'bg-sepia/40 text-khaki',
  },
  dominated: {
    label: 'Dominado',
    icon: '✅',
    borderClass: 'border-gold',
    bgClass: 'bg-gradient-to-br from-dark-brown to-deep-sepia',
    textClass: 'text-gold',
    titleClass: 'text-gold',
    cursor: 'cursor-pointer',
    opacity: '',
    barColor: 'gold',
    badgeBg: 'bg-gold/20 text-gold',
  },
}

/**
 * NodeCard — a knowledge node on the campaign map.
 * @param {Object} node - node data from API
 * @param {Object} progressoNode - progress data for this node
 * @param {Function} onClick - called when clicked (only if not locked)
 * @param {boolean} animateBar - whether to animate progress bar on mount
 */
export default function NodeCard({ node, progressoNode, onClick, animateBar = true }) {
  const dominio = progressoNode?.dominio ?? 0
  const tentativas = progressoNode?.tentativas ?? 0
  const desbloqueado = progressoNode?.desbloqueado ?? false

  let status
  if (!desbloqueado) {
    status = 'locked'
  } else if (dominio >= 70) {
    status = 'dominated'
  } else {
    status = 'available'
  }

  const cfg = STATUS_CONFIG[status]

  function handleClick() {
    if (status !== 'locked' && onClick) {
      onClick(node.id)
    }
  }

  function handleKey(e) {
    if ((e.key === 'Enter' || e.key === ' ') && status !== 'locked') {
      e.preventDefault()
      onClick(node.id)
    }
  }

  return (
    <div
      role={status !== 'locked' ? 'button' : undefined}
      tabIndex={status !== 'locked' ? 0 : undefined}
      aria-label={`${node.titulo} — ${cfg.label}${tentativas > 0 ? `, ${tentativas} tentativas` : ''}`}
      aria-disabled={status === 'locked'}
      onClick={handleClick}
      onKeyDown={handleKey}
      className={`
        relative rounded border-2 p-4 transition-all duration-300 select-none
        ${cfg.borderClass} ${cfg.bgClass} ${cfg.cursor} ${cfg.opacity}
        ${status === 'dominated' ? 'shadow-gold-glow' : ''}
        ${status === 'available' ? 'hover:shadow-parchment hover:-translate-y-0.5' : ''}
        ${status === 'dominated' ? 'animate-unlock-pulse' : ''}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2
      `}
    >
      {/* Corner decorations for non-locked nodes */}
      {status !== 'locked' && (
        <>
          <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-gold/40" aria-hidden="true" />
          <span className="absolute top-1 right-1 w-2 h-2 border-t border-r border-gold/40" aria-hidden="true" />
          <span className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-gold/40" aria-hidden="true" />
          <span className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-gold/40" aria-hidden="true" />
        </>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-sm font-medium uppercase tracking-widest ${cfg.badgeBg}`}>
          {cfg.icon} {cfg.label}
        </span>
        {tentativas > 0 && (
          <span className="text-xs text-khaki/50 tabular-nums">{tentativas} tent.</span>
        )}
      </div>

      {/* Node title */}
      <h3 className={`font-serif font-bold text-sm leading-tight mb-3 ${cfg.titleClass}`}>
        {node.titulo}
      </h3>

      {/* Progress bar */}
      <div className="space-y-1">
        <ProgressBar
          value={dominio}
          animated={animateBar && status !== 'locked'}
          color={cfg.barColor}
          showLabel
          height={8}
        />
        <p className="text-xs text-khaki/50">Domínio</p>
      </div>

      {/* Conquered stamp overlay */}
      {status === 'dominated' && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="text-gold/10 font-serif font-bold text-5xl rotate-[-20deg] select-none"
            style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}
          >
            DOMINADO
          </div>
        </div>
      )}
    </div>
  )
}
