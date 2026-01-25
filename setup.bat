@echo off
echo --- INSTALLATION AUTOMATIQUE DU PROJET ---
echo 1. Installation racine...
call npm install
echo 2. Installation Backend...
cd backend
call npm install
call npx prisma generate
echo 3. Installation Frontend...
cd ../frontend
call npm install
echo --- TERMINE ! Lance start.bat pour demarrer ---
pause
