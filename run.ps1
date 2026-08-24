Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting Smart Nutrition Assistant (Backend + Frontend)" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

$projectDir = $PSScriptRoot

Write-Host "Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectDir'; python -m uvicorn backend:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "Starting React Frontend on http://localhost:1234 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectDir'; npm run dev"

Write-Host "`nBoth services have been launched in new windows!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:1234" -ForegroundColor Cyan
Write-Host "Backend:  http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
