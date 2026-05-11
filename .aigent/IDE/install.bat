@echo off
REM =============================================================================
REM Aigent — Lanzador del instalador (Windows)
REM
REM Doble-click sobre este .bat para abrir el instalador interactivo, o llamarlo
REM desde una terminal con los mismos flags que el .ps1:
REM
REM     install.bat -Ide all -Mode project -Dept all
REM     install.bat -Sync -Ide claude -Dept all
REM     install.bat -Update
REM     install.bat -Help
REM
REM Por debajo invoca PowerShell con -ExecutionPolicy Bypass SOLO para esta
REM ejecucion: no toca la politica del sistema ni del usuario, no requiere
REM permisos de administrador, y no deja nada configurado al cerrar.
REM =============================================================================

REM %~dp0 = carpeta donde vive este .bat (con barra final). Asi funciona aunque
REM lo llamen desde otro directorio o por doble-click.
set "SCRIPT_DIR=%~dp0"
set "PS1=%SCRIPT_DIR%install.ps1"

if not exist "%PS1%" (
  echo.
  echo   [ERROR] No se encuentra install.ps1 junto a este .bat:
  echo           %PS1%
  echo.
  pause
  exit /b 1
)

REM Preferimos PowerShell 7 (pwsh) si esta instalado; si no, caemos al 5.1
where pwsh >nul 2>nul
if %ERRORLEVEL%==0 (
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%PS1%" %*
) else (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%" %*
)

set "RC=%ERRORLEVEL%"

REM Si se ejecuto por doble-click (sin terminal padre), pausamos para que
REM el usuario pueda leer el resumen antes de que cierre la ventana.
REM CMDCMDLINE contiene "/c" cuando se lanzo de esa manera.
echo %CMDCMDLINE% | findstr /I /C:"/c" >nul
if %ERRORLEVEL%==0 (
  echo.
  pause
)

exit /b %RC%
