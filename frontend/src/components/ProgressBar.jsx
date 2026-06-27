import React, { useEffect, useRef, useState } from 'react'

/**
 * ProgressBar — WWI themed animated progress bar.
 * @param {number} value - 0 to 100
 * @param {boolean} animated - whether to animate on mount
 * @param {'gold'|'khaki'|'red'|'green'} color - color variant
 * @param {boolean} showLabel - show percentage text
 * @param {string} className - extra classes on wrapper
 * @param {number} height - bar height in px (default 10)
 */
export default function ProgressBar({
  value = 0,
  animated = true,
  color = 'khaki',
  showLabel = false,
  className = '',
  height = 10,
}) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value)
  const rafRef = useRef(null)
  const startTimeRef = useRef(null)
  const startValueRef = useRef(animated ? 0 : value)

  useEffect(() => {
    if (!animated) {
      setDisplayValue(value)
      return
    }

    const from = startValueRef.current
    const to = value
    const duration = 1200

    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    function tick(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * eased
      setDisplayValue(Math.round(current))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        startValueRef.current = to
        startTimeRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, animated])

  const colorStyles = {
    gold: {
      track: 'bg-dark-brown border border-gold/30',
      fill: 'bg-gradient-to-r from-gold/80 via-gold to-pale-gold',
      label: 'text-gold',
    },
    khaki: {
      track: 'bg-dark-brown border border-khaki/30',
      fill: 'bg-gradient-to-r from-sepia via-khaki to-light-khaki',
      label: 'text-khaki',
    },
    red: {
      track: 'bg-dark-brown border border-dark-red/40',
      fill: 'bg-gradient-to-r from-dark-red to-red-600',
      label: 'text-red-400',
    },
    green: {
      track: 'bg-dark-brown border border-muted-green/40',
      fill: 'bg-gradient-to-r from-muted-green to-green-500',
      label: 'text-green-400',
    },
  }

  const scheme = colorStyles[color] || colorStyles.khaki
  const clamped = Math.max(0, Math.min(100, displayValue))

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex-1 rounded-sm overflow-hidden ${scheme.track}`}
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-sm ${scheme.fill} relative overflow-hidden`}
          style={{ width: `${clamped}%`, transition: animated ? 'width 0.1s linear' : 'none' }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
      {showLabel && (
        <span className={`text-xs font-semibold tabular-nums w-8 text-right ${scheme.label}`}>
          {Math.round(value)}%
        </span>
      )}
    </div>
  )
}
