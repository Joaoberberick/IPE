import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.erro || error.message || 'Erro de comunicação com o servidor'
    return Promise.reject(new Error(message))
  }
)

/**
 * Get or create a student by name.
 * Backend: GET /api/aluno/:nome
 * @param {string} nome - Student name
 * @returns {Promise<{id: number, nome: string, xp: number, nivel: string, criado_em: string}>}
 */
export async function getAluno(nome) {
  const response = await api.get(`/api/aluno/${encodeURIComponent(nome)}`)
  return response.data
}

/**
 * Get all knowledge domain nodes with their questions.
 * Backend: GET /api/dominio
 * @returns {Promise<{nos: Array<{id: number, titulo: string, camada: number, prerequisitos: number[], conteudo: string, questoes: Array}>}>}
 */
export async function getDominio() {
  const response = await api.get('/api/dominio')
  return response.data
}

/**
 * Get progress for a specific student across all nodes.
 * Backend: GET /api/aluno/:alunoId/progresso
 * @param {number} alunoId
 * @returns {Promise<{aluno_id: number, xp: number, nivel: string, nos: Array}>}
 */
export async function getProgresso(alunoId) {
  const response = await api.get(`/api/aluno/${alunoId}/progresso`)
  return response.data
}

/**
 * Submit an answer to a question.
 * Backend: POST /api/resposta
 * @param {Object} body
 * @param {number} body.aluno_id
 * @param {number} body.no_id
 * @param {number} body.questao_id
 * @param {string} body.tipo - 'multipla_escolha' | 'aberta'
 * @param {boolean} body.correta
 * @param {number} [body.palavras_chave_encontradas] - for open questions
 * @returns {Promise<{novo_dominio: number, xp_ganho: number, xp_atual: number, nivel: string, desbloqueados: number[], dominados: number[], erros_consecutivos: number, dica_sugerida: string|null, feedback_erro: string|null}>}
 */
export async function postResposta(body) {
  const response = await api.post('/api/resposta', body)
  return response.data
}

/**
 * Get detailed stats for a student.
 * Backend: GET /api/aluno/:alunoId/stats
 * @param {number} alunoId
 * @returns {Promise<{aluno_id: number, nome: string, xp: number, nivel: string, total_respostas: number, acertos: number, erros: number, nos_dominados: number, taxa_acerto: number}>}
 */
export async function getStats(alunoId) {
  const response = await api.get(`/api/aluno/${alunoId}/stats`)
  return response.data
}

export default api
