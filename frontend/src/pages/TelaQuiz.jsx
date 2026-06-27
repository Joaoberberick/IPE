import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDominio, postResposta } from '../api/api'
import { useAluno } from '../context/AlunoContext'
import FeedbackBox from '../components/FeedbackBox'
import ProgressBar from '../components/ProgressBar'

const ANSWER_LABELS = ['A', 'B', 'C', 'D']

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Find keywords in answer text
function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function findKeywords(answer, keywords) {
  const norm = normalize(answer)
  return keywords.filter((kw) => norm.includes(normalize(kw)))
}

// Conquest modal
function ConquestModal({ nodeTitle, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="max-w-sm w-full text-center animate-conquest"
        style={{
          background: 'linear-gradient(160deg, #2d1b00 0%, #3d2008 100%)',
          border: '3px solid #d4af37',
          boxShadow: '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.2)',
          borderRadius: '4px',
          padding: '2rem',
        }}
      >
        <div className="text-5xl mb-3" aria-hidden="true">🏆</div>
        <h2 className="font-serif font-bold text-gold text-2xl mb-2 text-shadow-gold">
          Nó Dominado!
        </h2>
        <p className="text-khaki font-serif italic mb-1">{nodeTitle}</p>
        <p className="text-parchment/70 text-sm mb-6">
          Você atingiu domínio suficiente neste tema. Novos territórios podem ter sido desbloqueados.
        </p>
        <div className="flex items-center justify-center gap-2 mb-4" aria-hidden="true">
          <div className="h-px flex-1 bg-gold/30" />
          <span className="text-gold text-xl">✦</span>
          <div className="h-px flex-1 bg-gold/30" />
        </div>
        <button onClick={onClose} className="btn-primary px-8 py-2.5 rounded text-sm">
          Continuar
        </button>
      </div>
    </div>
  )
}

// Summary screen shown after all questions
function SummaryScreen({ score, total, nodeTitle, onBack, onRetry }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  let verdict, verdictColor
  if (pct >= 80) { verdict = 'Excelente desempenho!'; verdictColor = 'text-gold' }
  else if (pct >= 60) { verdict = 'Bom trabalho, soldado.'; verdictColor = 'text-khaki' }
  else { verdict = 'Continue treinando.'; verdictColor = 'text-red-400' }

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center animate-fade-in-up">
      <div className="text-5xl mb-4" aria-hidden="true">{pct >= 70 ? '🎖️' : '📋'}</div>
      <h2 className="font-serif font-bold text-parchment text-2xl mb-1">Missão Concluída</h2>
      <p className="text-khaki/60 font-serif italic text-sm mb-6">{nodeTitle}</p>

      <div
        className="rounded border border-khaki/20 p-6 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(45,27,0,0.8), rgba(61,32,8,0.8))' }}
      >
        <div className="flex justify-center items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold font-serif text-gold tabular-nums">{score}</span>
          <span className="text-khaki/60 text-xl">/ {total}</span>
        </div>
        <p className={`text-lg font-serif font-bold mb-3 ${verdictColor}`}>{verdict}</p>
        <div className="mx-auto max-w-xs">
          <ProgressBar
            value={pct}
            animated
            color={pct >= 70 ? 'gold' : pct >= 40 ? 'khaki' : 'red'}
            showLabel
            height={12}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="btn-secondary px-5 py-2.5 rounded text-sm">
          Refazer Questões
        </button>
        <button onClick={onBack} className="btn-primary px-5 py-2.5 rounded text-sm">
          Voltar ao Mapa
        </button>
      </div>
    </div>
  )
}

export default function TelaQuiz() {
  const { noId } = useParams()
  const navigate = useNavigate()
  const { alunoId, progresso, updateProgresso, addXP } = useAluno()

  const [node, setNode] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null) // index for MC
  const [openAnswer, setOpenAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [foundKeywords, setFoundKeywords] = useState([])
  const [score, setScore] = useState(0)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [gainedXP, setGainedXP] = useState(0)
  const [showConquest, setShowConquest] = useState(false)
  const [currentDominio, setCurrentDominio] = useState(0)

  const openRef = useRef(null)

  const fetchNode = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDominio()
      const nodes = Array.isArray(data) ? data : data.nos || []
      const found = nodes.find((n) => n.id === noId || n.id === Number(noId))
      if (!found) {
        setError(`Nó "${noId}" não encontrado.`)
        return
      }
      setNode(found)
      const qs = found.questoes || []
      setQuestions(shuffle(qs))
    } catch (err) {
      setError(err.message || 'Erro ao carregar questões.')
    } finally {
      setLoading(false)
    }
  }, [noId])

  useEffect(() => {
    if (!alunoId) { navigate('/'); return }
    fetchNode()
    const np = progresso[noId] || {}
    setCurrentDominio(np.dominio || 0)
  }, [alunoId, fetchNode, navigate])

  function resetQuizState() {
    setShowFeedback(false)
    setSelectedAnswer(null)
    setOpenAnswer('')
    setIsCorrect(false)
    setFoundKeywords([])
    setGainedXP(0)
  }

  const currentQ = questions[currentIdx]
  const isMC = currentQ?.tipo === 'multipla_escolha' || currentQ?.alternativas?.length > 0
  const isOpen = currentQ?.tipo === 'aberta' || (!currentQ?.alternativas && currentQ?.palavras_chave)

  async function submitAnswer(correct, respostaText, keywords = []) {
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore((s) => s + 1)
      setConsecutiveErrors(0)
    } else {
      setConsecutiveErrors((c) => c + 1)
    }

    // Call API
    setSubmitting(true)
    try {
      const payload = {
        aluno_id: alunoId,
        no_id: Number(noId),
        questao_id: currentQ.id || currentIdx,
        tipo: currentQ.tipo,
        correta: correct,
        palavras_chave_encontradas: keywords,
      }
      const result = await postResposta(payload)

      const xpGanho = result.xp_ganho || 0
      if (xpGanho > 0) {
        addXP(xpGanho)
        setGainedXP(xpGanho)
      }

      const novoDominio = result.novo_dominio
      const prevDominio = currentDominio
      if (typeof novoDominio === 'number') {
        setCurrentDominio(novoDominio)
        updateProgresso(noId, {
          dominio: novoDominio,
          desbloqueado: true,
          tentativas: (progresso[noId]?.tentativas || 0) + 1,
          acertos: (progresso[noId]?.acertos || 0) + (correct ? 1 : 0),
        })
        if (prevDominio < 70 && novoDominio >= 70) {
          setTimeout(() => setShowConquest(true), 800)
        }
      } else {
        // Optimistic local update
        const np = progresso[noId] || {}
        updateProgresso(noId, {
          dominio: np.dominio || 0,
          desbloqueado: true,
          tentativas: (np.tentativas || 0) + 1,
          acertos: (np.acertos || 0) + (correct ? 1 : 0),
        })
      }
    } catch (_) {
      // Silently handle — optimistic update already done
    } finally {
      setSubmitting(false)
    }
  }

  function handleMCSelect(idx) {
    if (showFeedback) return
    setSelectedAnswer(idx)
    const selectedLetter = currentQ.alternativas[idx]?.letra
    const correct = selectedLetter === currentQ.resposta_correta
    submitAnswer(correct, currentQ.alternativas[idx]?.texto || String(idx))
  }

  function handleOpenSubmit(e) {
    e.preventDefault()
    if (showFeedback || !openAnswer.trim()) return
    const keywords = currentQ.palavras_chave || []
    const found = findKeywords(openAnswer, keywords)
    setFoundKeywords(found)
    const correct = found.length >= 2
    submitAnswer(correct, openAnswer, found)
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrentIdx((i) => i + 1)
      resetQuizState()
    }
  }

  function handleRetry() {
    setQuestions(shuffle(node?.questoes || []))
    setCurrentIdx(0)
    setScore(0)
    setDone(false)
    setConsecutiveErrors(0)
    resetQuizState()
  }

  if (!alunoId) return null

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #1a0e00 0%, #2d1b00 40%, #3d2008 100%)' }}
    >
      {/* Conquest modal */}
      {showConquest && node && (
        <ConquestModal nodeTitle={node.titulo} onClose={() => setShowConquest(false)} />
      )}

      {/* Header */}
      <header className="border-b border-khaki/15 bg-dark-brown/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/estudo/${noId}`)}
            className="flex items-center gap-1.5 text-khaki/70 hover:text-parchment transition-colors text-sm"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">Voltar ao Estudo</span>
          </button>

          {node && !done && !loading && (
            <div className="flex-1 flex flex-col items-center max-w-xs">
              <p className="text-khaki/50 text-xs uppercase tracking-widest mb-1">
                {currentIdx + 1} / {questions.length}
              </p>
              <div className="w-full h-1.5 bg-dark-brown/60 rounded-full overflow-hidden border border-khaki/10">
                <div
                  className="h-full bg-gradient-to-r from-sepia to-khaki rounded-full bar-animate"
                  style={{ width: `${((currentIdx + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Dominio pill */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs text-khaki/50">Domínio</span>
              <span className="text-xs font-bold text-gold tabular-nums">{currentDominio}%</span>
            </div>
            {/* Score */}
            {!done && questions.length > 0 && (
              <span className="text-xs text-khaki/60 tabular-nums">
                ✓ {score}/{currentIdx + (showFeedback ? 1 : 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-khaki/30 border-t-gold rounded-full animate-spin" />
            <p className="text-khaki/60 text-sm">Preparando questões...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="border border-dark-red/40 rounded bg-dark-red/10 p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => navigate('/mapa')} className="btn-primary px-6 py-2 rounded text-sm">
              Voltar ao Mapa
            </button>
          </div>
        )}

        {/* No questions */}
        {!loading && !error && questions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-khaki/60 font-serif italic mb-4">Nenhuma questão disponível para este nó.</p>
            <button onClick={() => navigate('/mapa')} className="btn-secondary px-6 py-2 rounded text-sm">
              Voltar ao Mapa
            </button>
          </div>
        )}

        {/* Done screen */}
        {done && !loading && (
          <SummaryScreen
            score={score}
            total={questions.length}
            nodeTitle={node?.titulo || ''}
            onBack={() => navigate('/mapa')}
            onRetry={handleRetry}
          />
        )}

        {/* Active question */}
        {!loading && !error && !done && currentQ && (
          <div className="animate-fade-in-up">
            {/* Node label */}
            {node && (
              <p className="text-xs text-khaki/50 uppercase tracking-widest mb-4">
                {node.titulo}
              </p>
            )}

            {/* Question card */}
            <div
              className="rounded border border-khaki/20 p-6 mb-6 relative"
              style={{ background: 'linear-gradient(135deg, rgba(45,27,0,0.9), rgba(61,32,8,0.8))' }}
            >
              <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-gold/20" aria-hidden="true" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-gold/20" aria-hidden="true" />
              <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-gold/20" aria-hidden="true" />
              <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-gold/20" aria-hidden="true" />

              <p className="text-xs uppercase tracking-widest text-khaki/50 mb-3">
                {isMC ? 'Múltipla Escolha' : 'Resposta Aberta'}
              </p>

              <p className="font-serif text-parchment leading-relaxed text-base">
                {currentQ.enunciado || currentQ.texto}
              </p>
            </div>

            {/* Multiple choice options */}
            {isMC && (
              <div className="grid gap-2.5 mb-6">
                {(currentQ.alternativas || []).map((alt, idx) => {
                  const altText = typeof alt === 'string' ? alt : alt.texto
                  const isSelected = selectedAnswer === idx
                  const isCorrectAnswer = showFeedback && alt?.letra === currentQ.resposta_correta
                  const isWrong = showFeedback && isSelected && !isCorrectAnswer

                  return (
                    <button
                      key={idx}
                      onClick={() => handleMCSelect(idx)}
                      disabled={showFeedback}
                      className={`
                        w-full text-left px-4 py-3 rounded border-2 transition-all duration-200
                        flex items-start gap-3
                        disabled:cursor-not-allowed
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold
                        ${isCorrectAnswer
                          ? 'border-muted-green bg-muted-green/15 text-green-300'
                          : isWrong
                            ? 'border-dark-red bg-dark-red/15 text-red-400'
                            : isSelected && !showFeedback
                              ? 'border-khaki bg-khaki/10 text-parchment'
                              : showFeedback
                                ? 'border-khaki/10 bg-transparent text-khaki/40'
                                : 'border-khaki/25 bg-transparent text-parchment hover:border-khaki hover:bg-khaki/8'
                        }
                      `}
                    >
                      <span className={`
                        flex-shrink-0 w-6 h-6 rounded-sm border flex items-center justify-center text-xs font-bold
                        ${isCorrectAnswer ? 'border-muted-green text-green-400' : isWrong ? 'border-dark-red text-red-400' : 'border-current'}
                      `}>
                        {isCorrectAnswer ? '✓' : isWrong ? '✗' : ANSWER_LABELS[idx]}
                      </span>
                      <span className="font-serif leading-relaxed">{altText}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Open answer */}
            {isOpen && (
              <form onSubmit={handleOpenSubmit} className="mb-6">
                <label htmlFor="open-answer" className="block text-xs uppercase tracking-widest text-khaki/60 mb-2">
                  Sua resposta
                </label>
                <textarea
                  id="open-answer"
                  ref={openRef}
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  disabled={showFeedback}
                  rows={4}
                  className="vintage-input w-full px-4 py-3 rounded resize-y text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Escreva sua resposta aqui..."
                />
                {!showFeedback && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={!openAnswer.trim() || submitting}
                      className="btn-primary px-6 py-2.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Verificando...' : 'Confirmar Resposta'}
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div className="mb-6">
                <FeedbackBox
                  isCorrect={isCorrect}
                  explanation={currentQ.explicacao || currentQ.feedback}
                  dica={consecutiveErrors >= 2 && !isCorrect ? (currentQ.dica || currentQ.hint) : undefined}
                  keywords={isOpen ? (currentQ.palavras_chave || []) : undefined}
                  foundKeywords={isOpen ? foundKeywords : undefined}
                />

                {/* XP gain notice */}
                {gainedXP > 0 && (
                  <div className="mt-2 flex items-center justify-end gap-1.5">
                    <span className="text-xs text-gold animate-fade-in-up">+{gainedXP} XP</span>
                  </div>
                )}

                {/* Dominio bar update */}
                <div className="mt-4 p-3 rounded border border-khaki/10 bg-dark-brown/40">
                  <div className="flex justify-between text-xs text-khaki/60 mb-1.5">
                    <span className="uppercase tracking-wider">Domínio do nó</span>
                    <span className="tabular-nums font-semibold text-gold">{currentDominio}%</span>
                  </div>
                  <ProgressBar
                    value={currentDominio}
                    animated
                    color={currentDominio >= 70 ? 'gold' : 'khaki'}
                    height={10}
                  />
                </div>

                {/* Next button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="btn-primary px-6 py-2.5 rounded text-sm"
                  >
                    {currentIdx + 1 >= questions.length ? 'Ver Resultado' : 'Próxima Questão →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
