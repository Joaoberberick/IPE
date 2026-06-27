import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDominio } from '../api/api'
import { useAluno } from '../context/AlunoContext'
import ProgressBar from '../components/ProgressBar'
import TutorChat from '../components/TutorChat'

// Very minimal sanitizer: strips script tags and on* handlers
function sanitizeHTML(html) {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
}

export default function TelaEstudo() {
  const { noId } = useParams()
  const navigate = useNavigate()
  const { alunoId, progresso } = useAluno()
  const contentRef = useRef(null)

  const [node, setNode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imagemAberta, setImagemAberta] = useState(false)

  const tutorImagemConfig = {
    1: { src: '/mapa.png',        alt: 'Mapa das alianças europeias na Primeira Guerra Mundial',           legenda: 'Mapa das Alianças — 1914' },
    2: { src: '/sarajevo.png',    alt: 'Assassinato do Arquiduque Franz Ferdinand em Sarajevo, 1914',      legenda: 'Sarajevo — 28 de junho de 1914' },
    3: { src: '/trincheiras.png', alt: 'Mapa e fotografia das trincheiras no front ocidental',             legenda: 'Front Ocidental — Trincheiras' },
    4: { src: '/tecnologia.png',  alt: 'Tecnologias da Primeira Guerra: tanque, aviões e máscaras de gás', legenda: 'Tecnologia e Guerra Industrial' },
    5: { src: '/armisticio.png',  alt: 'Celebração do Armistício em 11 de novembro de 1918',              legenda: 'Armistício — 11 nov. 1918' },
    6: { src: '/versalhes.png',   alt: 'Assinatura do Tratado de Versalhes no Salão dos Espelhos, 1919',  legenda: 'Tratado de Versalhes — 1919' },
  }

  const fetchNode = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDominio()
      const nodes = Array.isArray(data) ? data : data.nos || []
      const found = nodes.find((n) => n.id === noId || n.id === Number(noId))
      if (!found) {
        setError(`Nó "${noId}" não encontrado. Verifique o mapa.`)
      } else {
        setNode(found)
      }
    } catch (err) {
      setError(err.message || 'Erro ao carregar o conteúdo.')
    } finally {
      setLoading(false)
    }
  }, [noId])

  useEffect(() => {
    if (!alunoId) {
      navigate('/')
      return
    }
    fetchNode()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [alunoId, fetchNode, navigate])

  useEffect(() => {
    if (!imagemAberta) return
    const handler = (e) => { if (e.key === 'Escape') setImagemAberta(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [imagemAberta])

  const nodeProgress = progresso[noId] || {}
  const dominio = nodeProgress.dominio ?? 0
  const tentativas = nodeProgress.tentativas ?? 0
  const acertos = nodeProgress.acertos ?? 0
  const pontosInteresse = nodeProgress.pontos_interesse || []

  // Injeta marcadores de ponto de interesse nas seções do HTML renderizado
  useEffect(() => {
    if (!contentRef.current || !node) return
    // Limpa marcadores antigos
    contentRef.current.querySelectorAll('.ponto-interesse').forEach(el => el.remove())
    if (!pontosInteresse.length) return

    pontosInteresse.forEach(ref => {
      const section = contentRef.current.querySelector(`#${ref}`)
      if (!section) return
      const heading = section.querySelector('h3, h4')
      if (!heading) return

      const marker = document.createElement('span')
      marker.className = 'ponto-interesse'
      marker.setAttribute('title', 'Você errou uma questão sobre este trecho — revise com atenção')
      marker.setAttribute('aria-label', 'Ponto de atenção: você errou uma questão sobre esta seção')
      heading.appendChild(marker)
    })
  }, [node, pontosInteresse])

  if (!alunoId) return null

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(160deg, #1a0e00 0%, #2d1b00 40%, #3d2008 100%)',
      }}
    >
      {/* Modal da imagem histórica */}
      {imagemAberta && tutorImagemConfig[Number(noId)] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setImagemAberta(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
        >
          <div
            className="relative max-w-5xl w-full rounded border border-khaki/30 overflow-hidden"
            style={{ background: '#1a0e00' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-khaki/20">
              <span className="text-gold font-serif text-sm uppercase tracking-wider">
                {tutorImagemConfig[Number(noId)].legenda}
              </span>
              <button
                onClick={() => setImagemAberta(false)}
                className="text-khaki/60 hover:text-parchment transition-colors text-lg leading-none"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <img
              src={tutorImagemConfig[Number(noId)].src}
              alt={tutorImagemConfig[Number(noId)].alt}
              className="w-full object-contain"
              style={{ maxHeight: '80vh', background: '#1a0e00' }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-khaki/15 bg-dark-brown/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/mapa')}
            className="flex items-center gap-1.5 text-khaki/70 hover:text-parchment transition-colors text-sm"
          >
            <span aria-hidden="true">←</span>
            <span>Mapa</span>
          </button>
          {node && (
            <h1 className="font-serif font-bold text-parchment text-sm text-center flex-1 truncate">
              {node.titulo}
            </h1>
          )}
          <div className="w-20" /> {/* Spacer for symmetry */}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-khaki/30 border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="border border-dark-red/40 rounded bg-dark-red/10 p-8 text-center max-w-md mx-auto">
            <p className="text-red-400 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={fetchNode} className="btn-primary px-4 py-2 rounded text-sm">
                Tentar Novamente
              </button>
              <button onClick={() => navigate('/mapa')} className="btn-secondary px-4 py-2 rounded text-sm">
                Voltar ao Mapa
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {node && !loading && (
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up">
            {/* Main content area */}
            <article className="flex-1 min-w-0">
              {/* Node header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-khaki/50 text-xs uppercase tracking-[0.3em]">Lição de Campo</span>
                  <div className="h-px flex-1 bg-khaki/20" />
                </div>
                <h2 className="font-serif font-bold text-parchment text-shadow-dark mb-2"
                    style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
                  {node.titulo}
                </h2>
                {node.descricao && (
                  <p className="text-khaki text-sm font-serif italic">{node.descricao}</p>
                )}
              </div>

              {/* Nós com tutor IA — apenas chat no article */}
              {tutorImagemConfig[Number(noId)] ? (
                <TutorChat noId={Number(noId)} />
              ) : (
                /* Outros nós — conteúdo HTML padrão */
                <div
                  className="rounded border border-khaki/15 p-6 lg:p-8 relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(244,228,188,0.04) 0%, rgba(200,169,110,0.06) 100%)',
                  }}
                >
                  <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-gold/20" aria-hidden="true" />
                  <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-gold/20" aria-hidden="true" />
                  <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold/20" aria-hidden="true" />
                  <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-gold/20" aria-hidden="true" />
                  <div
                    ref={contentRef}
                    className="study-content prose-custom"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(node.conteudo || '') }}
                    style={{
                      color: '#e8d5a3',
                      lineHeight: '1.8',
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '0.95rem',
                      maxWidth: '65ch',
                    }}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={() => navigate(`/quiz/${noId}`)}
                  className="btn-primary px-6 py-3 rounded text-sm flex-1 sm:flex-none"
                >
                  Iniciar Questões →
                </button>
                <button
                  onClick={() => navigate('/mapa')}
                  className="btn-secondary px-6 py-3 rounded text-sm"
                >
                  Voltar ao Mapa
                </button>
              </div>
            </article>

            {/* Sidebar — progress & stats */}
            <aside className="lg:w-64 flex-shrink-0">
              {/* Imagem histórica no sidebar — nós com tutor IA */}
              {tutorImagemConfig[Number(noId)] && (() => {
                const img = tutorImagemConfig[Number(noId)]
                return (
                  <button
                    onClick={() => setImagemAberta(true)}
                    className="w-full rounded border border-khaki/20 overflow-hidden relative mb-4 group cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-gold/50"
                    aria-label="Ampliar imagem"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-dark-brown/80 border border-gold/30 text-gold text-xs px-2 py-0.5 rounded font-serif uppercase tracking-wider">
                        {img.legenda}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center z-10">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-dark-brown/80 border border-gold/40 text-gold text-xs px-3 py-1 rounded font-serif">
                        Clique para ampliar
                      </span>
                    </div>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full object-contain"
                      style={{ maxHeight: '420px', background: '#1a0e00' }}
                    />
                  </button>
                )
              })()}

              <div
                className="rounded border border-khaki/15 p-5 sticky top-20"
                style={{
                  background: 'linear-gradient(160deg, #2d1b00 0%, #3d2008 100%)',
                }}
              >
                {/* Dominio */}
                <h3 className="font-serif font-bold text-khaki text-sm mb-4 flex items-center gap-2">
                  <span aria-hidden="true">📊</span> Situação do Nó
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-khaki/60 mb-1.5">
                      <span className="uppercase tracking-wider">Domínio</span>
                      <span className="tabular-nums font-semibold text-gold">{dominio}%</span>
                    </div>
                    <ProgressBar
                      value={dominio}
                      animated
                      color={dominio >= 70 ? 'gold' : 'khaki'}
                      height={12}
                    />
                    <p className="text-xs text-khaki/40 mt-1">
                      {dominio >= 70 ? '✅ Dominado!' : `Meta: 70% (faltam ${70 - dominio}%)`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded border border-khaki/10 bg-dark-brown/50">
                      <p className="text-xl font-bold text-parchment tabular-nums font-serif">{tentativas}</p>
                      <p className="text-xs text-khaki/50 uppercase tracking-wider">Tentativas</p>
                    </div>
                    <div className="text-center p-2 rounded border border-khaki/10 bg-dark-brown/50">
                      <p className="text-xl font-bold text-parchment tabular-nums font-serif">{acertos}</p>
                      <p className="text-xs text-khaki/50 uppercase tracking-wider">Acertos</p>
                    </div>
                  </div>

                  {tentativas > 0 && (
                    <div className="pt-2 border-t border-khaki/10">
                      <p className="text-xs text-khaki/50 text-center">
                        Taxa: <span className="text-khaki font-semibold tabular-nums">
                          {Math.round((acertos / tentativas) * 100)}%
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Prerequisites info */}
                {node.prerequisitos && node.prerequisitos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-khaki/10">
                    <p className="text-xs uppercase tracking-wider text-khaki/50 mb-2">Pré-requisitos</p>
                    <ul className="space-y-1">
                      {node.prerequisitos.map((pre) => (
                        <li key={pre} className="text-xs text-khaki/70 flex items-center gap-1.5">
                          <span className="text-muted-green">✓</span>
                          {pre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => navigate(`/quiz/${noId}`)}
                  className="btn-primary w-full py-2.5 rounded text-xs mt-4"
                >
                  Iniciar Questões
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Inline style for prose content */}
      <style>{`
        .study-content h1, .study-content h2, .study-content h3 {
          font-family: Georgia, serif;
          color: #f4e4bc;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }
        .study-content h2 { font-size: 1.2rem; }
        .study-content h3 { font-size: 1rem; color: #c8a96e; }
        .study-content p { margin-bottom: 1em; }
        .study-content strong { color: #d4af37; }
        .study-content em { color: #c8a96e; }
        .study-content ul, .study-content ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .study-content li { margin-bottom: 0.25em; }
        .study-content blockquote {
          border-left: 3px solid #704214;
          padding-left: 1em;
          color: #c8a96e;
          font-style: italic;
          margin: 1em 0;
        }
        .study-content a { color: #d4af37; text-decoration: underline; }
        .study-content table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 1em;
          overflow-x: auto;
          display: block;
        }
        .study-content th, .study-content td {
          border: 1px solid rgba(200,169,110,0.3);
          padding: 0.4em 0.8em;
          text-align: left;
        }
        .study-content th { background: rgba(112,66,20,0.3); color: #f4e4bc; }
      `}</style>
    </div>
  )
}
