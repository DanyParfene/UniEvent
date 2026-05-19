@echo off
REM UVT Events Platform — Windows setup launcher (double-click or: setup.cmd)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-windows.ps1"
if errorlevel 1 exit /b 1
