@echo off
echo ===================================================
echo   INTERNSHIELD LAUNCHER - Starting Dev environment
echo ===================================================

echo Starting Backend Server on port 5000...
start "InternShield Backend Server" cmd /k "cd backend && npm start"

echo Starting Frontend Client on port 5173...
start "InternShield Frontend Client" cmd /k "cd /d frontend && npm run dev"

echo ===================================================
echo   Both services are launching in separate windows.
echo   - Backend: http://localhost:5000
echo   - Frontend: http://localhost:5173
echo ===================================================
pause
