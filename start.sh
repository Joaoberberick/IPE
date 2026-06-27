#!/bin/bash

ROOT="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
    echo ""
    echo "Encerrando processos..."
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Iniciando backend..."
cd "$ROOT/backend"
source venv/bin/activate
python app.py &
BACKEND_PID=$!

echo "Iniciando frontend..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "Pressione Ctrl+C para encerrar ambos."

wait "$BACKEND_PID" "$FRONTEND_PID"
