@echo off
echo ===================================================
echo   Starting Smart Nutrition Assistant (Backend + Frontend)
echo ===================================================

cd /d "%~dp0"

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Smart Nutrition Assistant - Backend" cmd /k "python -m uvicorn backend:app --host 127.0.0.1 --port 8000 --reload"

echo Starting React Frontend on http://localhost:1234 ...
start "Smart Nutrition Assistant - Frontend" cmd /k "npm run dev"

echo.
echo Both services are starting!
echo Frontend: http://localhost:1234
echo Backend:  http://127.0.0.1:8000
echo ===================================================
pause
