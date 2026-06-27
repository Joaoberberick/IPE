import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAluno } from '../context/AlunoContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function MsgBubble({ msg, alunoNome, isLast, streaming }) {
  const isUser = msg.role === 'user'
  const isEmpty = !msg.content && isLast && streaming

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-sepia border border-gold/50 flex items-center justify-center text-xs font-serif text-gold flex-shrink-0 mt-0.5 select-none">
          O
        </div>
      )}
      <div
        className={`max-w-[82%] px-3 py-2 rounded text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-sepia/50 border border-khaki/30 text-parchment'
            : 'bg-dark-brown/80 border border-khaki/15 text-parchment/90'
        }`}
      >
        {isEmpty ? (
          <span className="inline-flex gap-1 items-center h-4">
            {[0, 150, 300].map(d => (
              <span
                key={d}
                className="w-1.5 h-1.5 rounded-full bg-khaki/60 animate-bounce"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </span>
        ) : (
          msg.content
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-dark-red/40 border border-dark-red/40 flex items-center justify-center text-xs font-bold text-parchment/80 flex-shrink-0 mt-0.5 select-none">
          {(alunoNome || 'A')[0].toUpperCase()}
        </div>
      )}
    </div>
  )
}

export default function TutorChat({ noId, pontosInteresse = [] }) {
  const { alunoNome } = useAluno()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const hasStarted = useRef(false)   // useRef evita dupla invocação do StrictMode
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendToAPI = useCallback(async (history) => {
    setStreaming(true)
    setError('')
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch(`${API_BASE}/api/tutor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          aluno_nome: alunoNome || 'Aluno',
          no_id: noId,
          pontos_interesse: pontosInteresse,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.erro || `Erro ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const raw = decoder.decode(value, { stream: true })
        for (const line of raw.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6)
          if (payload === '[DONE]') continue
          try {
            const parsed = JSON.parse(payload)
            if (parsed.error) { setError(parsed.error); break }
            if (parsed.text) {
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = {
                  ...copy[copy.length - 1],
                  content: copy[copy.length - 1].content + parsed.text,
                }
                return copy
              })
            }
          } catch (_) {}
        }
      }
    } catch (err) {
      setError(err.message || 'Erro de conexão com o tutor.')
      setMessages(prev => {
        const copy = [...prev]
        if (copy[copy.length - 1]?.role === 'assistant' && !copy[copy.length - 1].content) {
          return copy.slice(0, -1)
        }
        return copy
      })
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }, [alunoNome, noId])

  // Inicia a conversa automaticamente — useRef evita dupla execução do React StrictMode
  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    sendToAPI([])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || streaming) return
    const userMsg = { role: 'user', content: text }
    setInput('')
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    sendToAPI(newHistory)
  }

  return (
    <div className="flex flex-col rounded border border-khaki/15 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(244,228,188,0.03) 0%, rgba(45,27,0,0.6) 100%)' }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-khaki/10 bg-dark-brown/60">
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <span className="text-khaki text-xs uppercase tracking-widest font-serif">Prof. Otto — Tutor IA</span>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: '320px', maxHeight: '420px' }}>
        {messages.map((msg, i) => (
          <MsgBubble
            key={i}
            msg={msg}
            alunoNome={alunoNome}
            isLast={i === messages.length - 1}
            streaming={streaming}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Erro */}
      {error && (
        <div className="px-4 py-2 bg-dark-red/10 border-t border-dark-red/30">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-3 border-t border-khaki/10 bg-dark-brown/40">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={streaming}
          placeholder={streaming ? 'Prof. Otto está digitando...' : 'Responda ou tire uma dúvida...'}
          className="flex-1 vintage-input px-3 py-2 rounded text-sm"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="btn-primary px-4 py-2 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
