import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDominio, getProgresso } from '../api/api'
import { useAluno } from '../context/AlunoContext'
import NodeCard from '../components/NodeCard'
import XPCounter from '../components/XPCounter'

// Campaign map layout: 5 rows, some with 2 nodes side-by-side
// Each entry: { row, col (1-based out of total cols in row), nodeIndex }
const MAP_LAYOUT = [
  { row: 0, cols: 1, nodeIds: [0] },      // Single: Contexto
  { row: 1, cols: 1, nodeIds: [1] },      // Single: Início
  { row: 2, cols: 2, nodeIds: [2, 3] },   // Dual: Frentes | Tecnologia
  { row: 3, cols: 1, nodeIds: [4] },      // Single: Virada
  { row: 4, cols: 1, nodeIds: [5] },      // Single: Consequências
]

// Toast notification component
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
      <div className="bg-dark-brown border border-gold shadow-gold-glow rounded px-4 py-3 max-w-xs">
        <p className="text-gold text-sm font-serif">{message}</p>
      </div>
    </div>
  )
}

export default function MapaDominio() {
  const { alunoId, alunoNome, xp, nivel, progresso, updateProgresso } = useAluno()
  const navigate = useNavigate()

  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([])

  const fetchData = useCallback(async () => {
    if (!alunoId) {
      navigate('/')
      return
    }
    setLoading(true)
    setError('')
    try {
      const [dominioData, progressoData] = await Promise.all([
        getDominio(),
        getProgresso(alunoId),
      ])
      setNodes(Array.isArray(dominioData) ? dominioData : dominioData.nos || [])
      // Sync progresso into context — key by no_id, not array index
      if (progressoData?.nos) {
        progressoData.nos.forEach((item) => updateProgresso(item.no_id, item))
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar o mapa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [alunoId, navigate, updateProgresso])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function addToast(msg) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg }])
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function handleNodeClick(nodeId) {
    navigate(`/estudo/${nodeId}`)
  }

  if (!alunoId) return null

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(200,169,110,0.05) 39px, rgba(200,169,110,0.05) 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(200,169,110,0.05) 39px, rgba(200,169,110,0.05) 40px),
          linear-gradient(160deg, #1a0e00 0%, #2d1b00 30%, #3d2008 60%, #1a0e00 100%)
        `,
      }}
    >
      {/* Toasts */}
      {toasts.map((t) => (
        <Toast key={t.id} message={t.msg} onDone={() => removeToast(t.id)} />
      ))}

      {/* Top bar */}
      <header className="border-b border-khaki/15 bg-dark-brown/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-parchment text-base leading-tight">
              Mapa da Campanha
            </h1>
            {alunoNome && (
              <p className="text-khaki/60 text-xs uppercase tracking-widest">
                Soldado {alunoNome}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <XPCounter xp={xp} nivel={nivel} compact />
            <button
              onClick={() => navigate('/progresso')}
              className="btn-secondary px-3 py-1.5 rounded text-xs"
            >
              Progresso
            </button>
          </div>
        </div>
      </header>

      {/* Map content */}
      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Map title */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-khaki/30" />
            <span className="text-khaki/50 text-xs uppercase tracking-[0.3em]">Frente de Batalha</span>
            <div className="h-px flex-1 bg-gradient-to-r from-khaki/30 to-transparent" />
          </div>
          <p className="text-khaki/40 text-xs font-serif italic">
            Conquiste os nós de conhecimento para dominar a Grande Guerra
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-khaki/30 border-t-gold rounded-full animate-spin" />
            <p className="text-khaki/60 text-sm">Carregando mapa...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="border border-dark-red/40 rounded bg-dark-red/10 p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchData} className="btn-primary px-6 py-2 rounded text-sm">
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Campaign map with connecting lines via SVG */}
        {!loading && !error && nodes.length > 0 && (
          <div className="relative">
            {/* SVG connecting lines — rendered behind the cards */}
            <CampaignLines nodes={nodes} progresso={progresso} />

            {/* Node rows */}
            <div className="flex flex-col gap-6">
              {MAP_LAYOUT.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`flex gap-4 justify-center animate-fade-in-up`}
                  style={{ animationDelay: `${rowIdx * 80}ms`, animationFillMode: 'both' }}
                >
                  {row.nodeIds.map((nodeIdx) => {
                    const node = nodes[nodeIdx]
                    if (!node) return null
                    const nodeProgresso = progresso[node.id] || {}
                    return (
                      <div key={node.id} className={row.cols === 2 ? 'flex-1 min-w-0' : 'w-full max-w-sm'}>
                        <NodeCard
                          node={node}
                          progressoNode={nodeProgresso}
                          onClick={handleNodeClick}
                          animateBar
                        />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && nodes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-khaki/50 font-serif italic">Nenhum nó encontrado no domínio.</p>
          </div>
        )}

        {/* Legend */}
        {!loading && nodes.length > 0 && (
          <div className="mt-10 pt-6 border-t border-khaki/10">
            <p className="text-xs uppercase tracking-widest text-khaki/40 mb-3 text-center">Legenda</p>
            <div className="flex justify-center gap-6 flex-wrap">
              {[
                { icon: '🔒', label: 'Bloqueado', color: 'text-battle-grey' },
                { icon: '📖', label: 'Disponível', color: 'text-khaki' },
                { icon: '✅', label: 'Dominado (≥70%)', color: 'text-gold' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="text-base">{item.icon}</span>
                  <span className={`text-xs ${item.color}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// SVG dashed lines connecting node rows (purely decorative, hidden from a11y)
function CampaignLines({ nodes, progresso }) {
  if (nodes.length < 2) return null

  // Very simple: draw vertical dashed lines between row centers
  // Actual positioning is approximate; the visual map is flex-based
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="rgba(200,169,110,0.4)" />
        </marker>
      </defs>
    </svg>
  )
}
