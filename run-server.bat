@echo off
echo ===================================================
echo Starting BeatFlow Backend Server (PRN: 25070521128)
echo ===================================================
cd /d "%~dp0server"
npm run dev
pause
