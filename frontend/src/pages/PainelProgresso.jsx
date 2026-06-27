import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDominio, getStats } from '../api/api'
import { useAluno, getNivelInfo, NIVEL_THRESHOLDS } from '../context/AlunoContext'
import ProgressBar from '../components/ProgressBar'

// Rank visual graphic using CSS stripes
function RankBadgeGraphic({ nivel }) {
  const stripeCount = {
    Recruta: 0, Soldado: 1, Cabo: 2, Sargento: 3,
    Tenente: 1, Capitão: 2, Major: 3, General: 4,
  }[nivel] || 0

  const isOfficer = ['Tenente', 'Capitão', 'Major', 'General'].includes(nivel)

  return (
    <div className="flex flex-col items-center">
      {/* Badge body */}
      <div
        className="relative flex flex-col items-center justify-center rounded"
        style={{
          width: 64,
          height: 72,
          background: isOfficer
            ? 'linear-gradient(160deg, #704214 0%, #5a3a1a 100%)'
            : 'linear-gradient(160deg, #3d2008 0%, #2d1b00 100%)',
          border: `2px solid ${isOfficer ? '#d4af37' : '#c8a96e'}`,
          boxShadow: isOfficer ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
        }}
      >
        {/* Star / icon */}
        <span className="text-2xl mb-1" aria-hidden="true">
          {nivel === 'General' ? '👑' : isOfficer ? '🌟' : '⭐'}
        </span>

        {/* Stripe decorations */}
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: stripeCount }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 3,
                borderRadius: 1,
                background: isOfficer ? '#d4af37' : '#c8a96e',
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-khaki/70 uppercase tracking-widest mt-2">{nivel}</p>
    </div>
  )
}

export default function PainelProgresso() {
  const { alunoId, alunoNome, xp, nivel, progresso, updateProgresso } = useAluno()
  const navigate = useNavigate()

  const [nodes, setNodes] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const nivelInfo = getNivelInfo(xp)

  const fetchData = useCallback(async () => {
    if (!alunoId) { navigate('/'); return }
    setLoading(true)
    setError('')
    try {
      const [dominioData, statsData] = await Promise.allSettled([
        getDominio(),
        getStats(alunoId),
      ])

      if (dominioData.status === 'fulfilled') {
        const n = Array.isArray(dominioData.value) ? dominioData.value : dominioData.value?.nos || []
        setNodes(n)
      }
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value)
        // Sync progress from stats if available
        const progressoFromStats = statsData.value?.progresso || statsData.value?.nos
        if (progressoFromStats) {
          Object.entries(progressoFromStats).forEach(([noId, data]) => updateProgresso(noId, data))
        }
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar progresso.')
    } finally {
      setLoading(false)
    }
  }, [alunoId, navigate, updateProgresso])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!alunoId) return null

  // Aggregate stats
  const totalTentativas = Object.values(progresso).reduce((s, p) => s + (p.tentativas || 0), 0)
  const totalAcertos = Object.values(progresso).reduce((s, p) => s + (p.acertos || 0), 0)
  const nosDominados = Object.values(progresso).filter((p) => (p.dominio || 0) >= 70).length
  const accuracy = totalTentativas > 0 ? Math.round((totalAcertos / totalTentativas) * 100) : 0

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #1a0e00 0%, #2d1b00 40%, #3d2008 100%)' }}
    >
      {/* Header */}
      <header className="border-b border-khaki/15 bg-dark-brown/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/mapa')}
            className="flex items-center gap-1.5 text-khaki/70 hover:text-parchment transition-colors text-sm"
          >
            <span aria-hidden="true">←</span>
            <span>Mapa da Campanha</span>
          </button>
          <h1 className="font-serif font-bold text-parchment text-sm">Painel de Progresso</h1>
          <div className="w-28" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-khaki/30 border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="border border-dark-red/40 rounded bg-dark-red/10 p-6 text-center mb-6">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={fetchData} className="btn-secondary px-4 py-2 rounded text-sm">
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && (
          <div className="space-y-8 animate-fade-in-up">

            {/* Soldier profile */}
            <section
              className="rounded border border-khaki/20 p-6"
              style={{ background: 'linear-gradient(135deg, rgba(45,27,0,0.9), rgba(61,32,8,0.8))' }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Rank badge */}
                <RankBadgeGraphic nivel={nivel} />

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-khaki/50 mb-1">Ficha do Soldado</p>
                  <h2 className="font-serif font-bold text-parchment text-2xl mb-1">{alunoNome}</h2>
                  <span className="rank-badge">{nivel}</span>

                  {/* XP progress */}
                  <div className="mt-4 max-w-xs mx-auto sm:mx-0">
                    <div className="flex justify-between text-xs text-khaki/60 mb-1">
                      <span className="tabular-nums text-gold font-bold">{xp.toLocaleString('pt-BR')} XP</span>
                      {nivelInfo.nextNivel && (
                        <span className="text-khaki/40">{nivelInfo.xpToNext} para {nivelInfo.nextNivel}</span>
                      )}
                    </div>
                    <ProgressBar
                      value={nivelInfo.pct}
                      animated
                      color="gold"
                      height={10}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-khaki/40">{nivelInfo.nivel}</span>
                      {nivelInfo.nextNivel && (
                        <span className="text-xs text-khaki/40">{nivelInfo.nextNivel}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 sm:w-28">
                  {[
                    { label: 'Questões', value: totalTentativas },
                    { label: 'Acertos', value: totalAcertos },
                    { label: 'Precisão', value: `${accuracy}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-lg font-bold font-serif text-parchment tabular-nums">{value}</p>
                      <p className="text-xs text-khaki/50 uppercase tracking-wider">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Overall summary cards */}
            <section>
              <h3 className="font-serif font-bold text-khaki text-base mb-4 flex items-center gap-2">
                <span aria-hidden="true">📊</span> Estatísticas Gerais
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total de Tentativas', value: totalTentativas, icon: '📝' },
                  { label: 'Total de Acertos', value: totalAcertos, icon: '✓' },
                  { label: 'Taxa de Precisão', value: `${accuracy}%`, icon: '🎯' },
                  { label: 'Nós Dominados', value: `${nosDominados}/6`, icon: '🏆' },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="rounded border border-khaki/15 p-4 text-center"
                    style={{ background: 'rgba(45,27,0,0.6)' }}
                  >
                    <p className="text-2xl mb-1" aria-hidden="true">{icon}</p>
                    <p className="text-xl font-bold font-serif text-parchment tabular-nums">{value}</p>
                    <p className="text-xs text-khaki/50 uppercase tracking-wider leading-tight mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Nodes table */}
            <section>
              <h3 className="font-serif font-bold text-khaki text-base mb-4 flex items-center gap-2">
                <span aria-hidden="true">🗺</span> Nós de Conhecimento
              </h3>

              <div className="overflow-x-auto rounded border border-khaki/15">
                <table className="w-full text-sm" style={{ background: 'rgba(29,14,0,0.8)' }}>
                  <thead>
                    <tr className="border-b border-khaki/20">
                      {['Nó', 'Status', 'Domínio', 'Tentativas', 'Acertos', 'Taxa'].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs uppercase tracking-widest text-khaki/60 font-semibold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-khaki/40 font-serif italic">
                          Dados do domínio não disponíveis.
                        </td>
                      </tr>
                    ) : (
                      nodes.map((node, idx) => {
                        const np = progresso[node.id] || {}
                        const dom = np.dominio || 0
                        const tent = np.tentativas || 0
                        const acert = np.acertos || 0
                        const desbloqueado = np.desbloqueado ?? idx === 0
                        const taxa = tent > 0 ? Math.round((acert / tent) * 100) : 0

                        let statusIcon, statusLabel, statusColor
                        if (!desbloqueado) {
                          statusIcon = '🔒'; statusLabel = 'Bloqueado'; statusColor = 'text-battle-grey'
                        } else if (dom >= 70) {
                          statusIcon = '✅'; statusLabel = 'Dominado'; statusColor = 'text-gold'
                        } else {
                          statusIcon = '📖'; statusLabel = 'Ativo'; statusColor = 'text-khaki'
                        }

                        return (
                          <tr
                            key={node.id}
                            className="border-b border-khaki/5 hover:bg-khaki/5 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <button
                                onClick={() => desbloqueado && navigate(`/estudo/${node.id}`)}
                                disabled={!desbloqueado}
                                className="font-serif text-parchment/90 hover:text-parchment text-left disabled:text-khaki/40 disabled:cursor-not-allowed transition-colors text-sm"
                              >
                                {node.titulo}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs ${statusColor}`}>
                                {statusIcon} {statusLabel}
                              </span>
                            </td>
                            <td className="px-4 py-3 min-w-[120px]">
                              <div className="space-y-1">
                                <ProgressBar
                                  value={dom}
                                  animated
                                  color={dom >= 70 ? 'gold' : 'khaki'}
                                  showLabel
                                  height={6}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 tabular-nums text-khaki/70">{tent}</td>
                            <td className="px-4 py-3 tabular-nums text-khaki/70">{acert}</td>
                            <td className="px-4 py-3 tabular-nums">
                              <span className={tent > 0 ? (taxa >= 70 ? 'text-gold' : taxa >= 40 ? 'text-khaki' : 'text-red-400') : 'text-khaki/30'}>
                                {tent > 0 ? `${taxa}%` : '—'}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rank ladder */}
            <section>
              <h3 className="font-serif font-bold text-khaki text-base mb-4 flex items-center gap-2">
                <span aria-hidden="true">🎖️</span> Escala de Patentes
              </h3>
              <div className="overflow-x-auto">
                <div className="flex gap-3 min-w-max pb-2">
                  {NIVEL_THRESHOLDS.map((n) => {
                    const isCurrentLevel = n.nivel === nivel
                    const isPastLevel = xp >= n.minXP && n.nivel !== nivel
                    return (
                      <div
                        key={n.nivel}
                        className={`
                          flex flex-col items-center p-3 rounded border text-center min-w-[80px]
                          ${isCurrentLevel
                            ? 'border-gold bg-gold/10 shadow-gold-glow'
                            : isPastLevel
                              ? 'border-khaki/30 bg-khaki/5'
                              : 'border-khaki/10 opacity-40'
                          }
                        `}
                      >
                        <span className="text-xl mb-1">{n.icon}</span>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${isCurrentLevel ? 'text-gold' : 'text-khaki/60'}`}>
                          {n.nivel}
                        </p>
                        <p className="text-xs text-khaki/40 tabular-nums mt-0.5">{n.minXP} XP</p>
                        {isCurrentLevel && (
                          <span className="text-[10px] text-gold/70 mt-1 uppercase tracking-wider">Atual</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="flex justify-center pt-4">
              <button onClick={() => navigate('/mapa')} className="btn-primary px-8 py-3 rounded text-sm">
                Voltar ao Mapa da Campanha
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
