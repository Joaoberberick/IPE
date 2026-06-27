# TutorHistória — Sistema Tutor Inteligente sobre a Primeira Guerra Mundial

## Sobre o Projeto

TutorHistória é um Sistema Tutor Inteligente (ITS) focado na Primeira Guerra Mundial. O sistema guia o aluno por um grafo de conhecimento em 6 camadas temáticas — do contexto pré-guerra até as consequências do conflito — avaliando o domínio de cada tópico por meio de quizzes de múltipla escolha e perguntas abertas. Com base no desempenho, o tutor adapta o percurso de estudo, fornece feedback explicativo e atribui XP e patentes militares ao aluno conforme seu progresso.

## Stack Tecnológica

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6 + Axios
- **Backend:** Python Flask + Flask-SQLAlchemy + SQLite
- **Deploy sugerido:** Vercel (frontend) + Render (backend)

## Estrutura do Projeto

```
IPE/
├── backend/
│   ├── app.py              # Aplicação Flask com todas as rotas da API
│   ├── models.py           # Modelos SQLAlchemy (Aluno, NoDominio, Questao, ProgressoAluno, HistoricoResposta)
│   ├── seed.py             # Script de população do banco com nós e questões
│   ├── requirements.txt    # Dependências Python
│   └── .env.example        # Variáveis de ambiente de exemplo
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js              # Cliente Axios com todas as chamadas à API
│   │   ├── components/
│   │   │   ├── FeedbackBox.jsx     # Exibe feedback após resposta
│   │   │   ├── Navbar.jsx          # Barra de navegação superior
│   │   │   ├── NodeCard.jsx        # Card de nó de conhecimento no mapa
│   │   │   ├── ProgressBar.jsx     # Barra de progresso de domínio
│   │   │   └── XPCounter.jsx       # Contador de XP e nível do aluno
│   │   ├── context/
│   │   │   └── AlunoContext.jsx    # Contexto React com estado global do aluno
│   │   ├── pages/
│   │   │   ├── TelaEntrada.jsx     # Tela de login/identificação do aluno
│   │   │   ├── MapaDominio.jsx     # Mapa de campanha com os 6 nós de conhecimento
│   │   │   ├── TelaEstudo.jsx      # Leitura do conteúdo de cada nó
│   │   │   ├── TelaQuiz.jsx        # Quiz com questões do nó selecionado
│   │   │   └── PainelProgresso.jsx # Painel com estatísticas e progresso geral
│   │   ├── App.jsx                 # Roteamento principal com guards de autenticação
│   │   ├── main.jsx                # Ponto de entrada React
│   │   └── index.css               # Estilos globais e variáveis Tailwind customizadas
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Como Rodar Localmente

### Pré-requisitos

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python app.py
```

Backend rodando em http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend rodando em http://localhost:5173

> O Vite está configurado com proxy: requisições para `/api` são redirecionadas automaticamente para `http://localhost:5000` durante o desenvolvimento.

## Rotas da API

| Método | Rota                        | Descrição                                   |
| ------ | --------------------------- | ------------------------------------------- |
| `GET`  | `/api/aluno/<nome>`         | Busca ou cria um aluno pelo nome            |
| `GET`  | `/api/dominio`              | Retorna todos os nós com questões           |
| `GET`  | `/api/aluno/<id>/progresso` | Progresso do aluno por nó                   |
| `POST` | `/api/resposta`             | Registra uma resposta e atualiza domínio/XP |
| `GET`  | `/api/aluno/<id>/stats`     | Estatísticas agregadas do aluno             |

## Uso WEB

URL = https://tutorhistoria.netlify.app/
