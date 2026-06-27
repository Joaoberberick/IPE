import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AlunoProvider, useAluno } from './context/AlunoContext'
import Navbar from './components/Navbar'
import TelaEntrada from './pages/TelaEntrada'
import MapaDominio from './pages/MapaDominio'
import TelaEstudo from './pages/TelaEstudo'
import TelaQuiz from './pages/TelaQuiz'
import PainelProgresso from './pages/PainelProgresso'

// Guard: redirect unauthenticated users to entry
function RequireAuth({ children }) {
  const { alunoId } = useAluno()
  if (!alunoId) return <Navigate to="/" replace />
  return children
}

function AppLayout() {
  const { alunoId } = useAluno()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar only shown when logged in */}
      {alunoId && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<TelaEntrada />} />
          <Route
            path="/mapa"
            element={
              <RequireAuth>
                <MapaDominio />
              </RequireAuth>
            }
          />
          <Route
            path="/estudo/:noId"
            element={
              <RequireAuth>
                <TelaEstudo />
              </RequireAuth>
            }
          />
          <Route
            path="/quiz/:noId"
            element={
              <RequireAuth>
                <TelaQuiz />
              </RequireAuth>
            }
          />
          <Route
            path="/progresso"
            element={
              <RequireAuth>
                <PainelProgresso />
              </RequireAuth>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AlunoProvider>
        <AppLayout />
      </AlunoProvider>
    </BrowserRouter>
  )
}
