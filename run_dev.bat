@echo off
title CarbonGuard AI Launcher
echo ========================================================
echo       Starting CarbonGuard AI Multi-Agent Platform
echo ========================================================
echo.

echo [1/3] Starting Python FastAPI Microservice on http://127.0.0.1:8000 ...
start "CarbonGuard AI Backend (Port 8000)" cmd /k ".\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Waiting 2 seconds for backend initialization...
timeout /t 2 /nobreak >nul

echo [3/3] Starting Next.js Web Frontend on http://localhost:3000 ...
cd carbongaurd
start http://localhost:3000
npm run dev
