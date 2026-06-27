import React from 'react'

/**
 * FeedbackBox — displayed after answering a question.
 * @param {boolean} isCorrect
 * @param {string} explanation - explanation text
 * @param {string} [dica] - hint text (shown before feedback for consecutive errors)
 * @param {string[]} [keywords] - expected keywords (open questions)
 * @param {string[]} [foundKeywords] - keywords found in the answer
 */
export default function FeedbackBox({ isCorrect, explanation, dica, keywords, foundKeywords }) {
  const borderColor = isCorrect ? 'border-muted-green' : 'border-dark-red'
  const bgGradient = isCorrect
    ? 'from-muted-green/10 to-transparent'
    : 'from-dark-red/10 to-transparent'
  const accentColor = isCorrect ? 'text-green-400' : 'text-red-400'
  const icon = isCorrect ? '✓' : '✗'
  const label = isCorrect ? 'Resposta Correta' : 'Resposta Incorreta'

  return (
    <div className={`animate-fade-in-up rounded border ${borderColor}`}>
      {/* Dica (hint) shown for consecutive errors, before verdict */}
      {dica && !isCorrect && (
        <div className="border-b border-gold/30 bg-gold/10 px-4 py-3">
          <div className="flex items-start gap-2">
            <span className="text-gold text-lg leading-none mt-0.5" aria-hidden="true">💡</span>
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Dica</p>
              <p className="text-parchment/90 text-sm leading-relaxed">{dica}</p>
            </div>
          </div>
        </div>
      )}

      {/* Verdict header */}
      <div className={`px-4 py-3 bg-gradient-to-r ${bgGradient}`}>
        <div className="flex items-center gap-3">
          <span
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm
              ${isCorrect ? 'border-muted-green text-green-400' : 'border-dark-red text-red-400'}`}
          >
            {icon}
          </span>
          <span className={`font-serif font-bold text-base ${accentColor}`}>{label}</span>
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div className="px-4 py-3 border-t border-white/5">
          <p className="text-xs font-semibold uppercase tracking-widest text-khaki/70 mb-1">Explicação</p>
          <p className="text-parchment/85 text-sm leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Keywords for open questions */}
      {keywords && keywords.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-khaki/70 mb-2">
            Palavras-chave esperadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => {
              const found = foundKeywords?.some(
                (f) => f.toLowerCase() === kw.toLowerCase()
              )
              return (
                <span
                  key={kw}
                  className={`px-2 py-0.5 rounded text-xs font-medium border
                    ${found
                      ? 'bg-muted-green/20 border-muted-green/50 text-green-300'
                      : 'bg-dark-red/10 border-dark-red/30 text-red-400/70'
                    }`}
                >
                  {found ? '✓ ' : '○ '}{kw}
                </span>
              )
            })}
          </div>
          {foundKeywords && (
            <p className="text-xs text-khaki/60 mt-2">
              {foundKeywords.length} de {keywords.length} palavras-chave identificadas na sua resposta
            </p>
          )}
        </div>
      )}
    </div>
  )
}
