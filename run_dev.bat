@echo off

docker compose up -d

start "Backend" cmd /k "cd backend && npm run start:dev"

start "Frontend" cmd /k "cd frontend && npm run dev"