import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AlunoContext = createContext(null)

const NIVEL_THRESHOLDS = [
  { nivel: 'Recruta', minXP: 0, maxXP: 100, icon: '🎖️' },
  { nivel: 'Soldado', minXP: 100, maxXP: 300, icon: '⭐' },
  { nivel: 'Cabo', minXP: 300, maxXP: 600, icon: '⭐⭐' },
  { nivel: 'Sargento', minXP: 600, maxXP: 1000, icon: '⭐⭐⭐' },
  { nivel: 'Tenente', minXP: 1000, maxXP: 1500, icon: '🌟' },
  { nivel: 'Capitão', minXP: 1500, maxXP: 2500, icon: '🌟🌟' },
  { nivel: 'Major', minXP: 2500, maxXP: 4000, icon: '🌟🌟🌟' },
  { nivel: 'General', minXP: 4000, maxXP: Infinity, icon: '👑' },
]

export function getNivelInfo(xp) {
  for (let i = NIVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= NIVEL_THRESHOLDS[i].minXP) {
      const current = NIVEL_THRESHOLDS[i]
      const next = NIVEL_THRESHOLDS[i + 1] || null
      const progressInLevel = xp - current.minXP
      const rangeSize = next ? next.minXP - current.minXP : 1000
      const pct = next ? Math.min(100, Math.round((progressInLevel / rangeSize) * 100)) : 100
      return { ...current, nextNivel: next?.nivel, xpToNext: next ? next.minXP - xp : 0, pct }
    }
  }
  return { ...NIVEL_THRESHOLDS[0], nextNivel: NIVEL_THRESHOLDS[1]?.nivel, xpToNext: NIVEL_THRESHOLDS[1]?.minXP - xp, pct: 0 }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('tutor_historia_aluno')
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function saveToStorage(data) {
  try {
    localStorage.setItem('tutor_historia_aluno', JSON.stringify(data))
  } catch (_) {}
}

export function AlunoProvider({ children }) {
  const [alunoId, setAlunoId] = useState(null)
  const [alunoNome, setAlunoNome] = useState('')
  const [xp, setXp] = useState(0)
  const [nivel, setNivel] = useState('Recruta')
  const [progresso, setProgresso] = useState({})

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved) {
      setAlunoId(saved.alunoId || null)
      setAlunoNome(saved.alunoNome || '')
      setXp(saved.xp || 0)
      setNivel(saved.nivel || 'Recruta')
      setProgresso(saved.progresso || {})
    }
  }, [])

  // Persist on changes
  useEffect(() => {
    if (alunoId) {
      saveToStorage({ alunoId, alunoNome, xp, nivel, progresso })
    }
  }, [alunoId, alunoNome, xp, nivel, progresso])

  const setAluno = useCallback(({ id, nome, xp: initialXP = 0 }) => {
    setAlunoId(id)
    setAlunoNome(nome)
    const startXP = initialXP || 0
    setXp(startXP)
    const info = getNivelInfo(startXP)
    setNivel(info.nivel)
  }, [])

  const updateProgresso = useCallback((noId, dominioData) => {
    setProgresso(prev => {
      const existing = prev[noId] || {}
      // Merge pontos_interesse: union de ambas as listas, sem duplicatas
      const prevPontos = existing.pontos_interesse || []
      const newPontos = dominioData.pontos_interesse || prevPontos
      return {
        ...prev,
        [noId]: { ...existing, ...dominioData, pontos_interesse: newPontos },
      }
    })
  }, [])

  const addXP = useCallback((amount) => {
    setXp(prev => {
      const newXP = prev + amount
      const info = getNivelInfo(newXP)
      setNivel(info.nivel)
      return newXP
    })
  }, [])

  const clearAluno = useCallback(() => {
    setAlunoId(null)
    setAlunoNome('')
    setXp(0)
    setNivel('Recruta')
    setProgresso({})
    localStorage.removeItem('tutor_historia_aluno')
  }, [])

  const value = {
    alunoId,
    alunoNome,
    xp,
    nivel,
    progresso,
    setAluno,
    updateProgresso,
    addXP,
    clearAluno,
    nivelInfo: getNivelInfo(xp),
  }

  return <AlunoContext.Provider value={value}>{children}</AlunoContext.Provider>
}

export function useAluno() {
  const ctx = useContext(AlunoContext)
  if (!ctx) throw new Error('useAluno must be used within AlunoProvider')
  return ctx
}

export { NIVEL_THRESHOLDS }
