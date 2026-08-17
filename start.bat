@echo off
echo ===================================================
echo   Starting Ghanshyam Technocast Web Server...
echo   Hosting website at http://localhost:3000
echo   Press Ctrl+C in this window to stop the server.
echo ===================================================
echo.

:: Automatically launch default web browser at localhost:3000
start "" "http://localhost:3000"

:: Start the Python HTTP server on port 3000
python -m http.server 3000

pause
