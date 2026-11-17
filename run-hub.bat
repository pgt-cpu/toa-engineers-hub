@echo off
cd /d "%~dp0"
node hub-sync.mjs %*
echo.
pause
