@echo off
rem ===========================================================================
rem Aigent - runtime launcher / multiplexor (Windows cmd/PowerShell nativo)
rem
rem Cortesia para setups Windows donde el shell del agente NO es Git-Bash.
rem En la mayoria de casos (Claude Code / OpenCode) el shell es bash y se usa
rem el launcher `run` (sin extension). Este .cmd replica la MISMA logica y el
rem MISMO contrato de errores tipados.
rem
rem Uso:  .aigent\IDE\bin\run.cmd [node^|npm^|npx] ^<args...^>
rem   - 1er arg node/npm/npx = runtime; cualquier otra cosa = node (retrocompat).
rem   - Resolucion SYSTEM-FIRST: sistema (PATH) -^> bundled en deps\.
rem   - En error: JSON a stdout + linea [ERROR ...] a stderr + exit /b 1.
rem     Codigos: RUNTIME_UNAVAILABLE
rem ===========================================================================
setlocal enabledelayedexpansion
set "DIR=%~dp0"
set "DEPS=%DIR%deps"

rem --- Seleccion de runtime (default node) ---
set "RT=node"
set "first=%~1"
if /i "%first%"=="node" ( set "RT=node" & shift )
if /i "%first%"=="npm"  ( set "RT=npm"  & shift )
if /i "%first%"=="npx"  ( set "RT=npx"  & shift )

rem --- Reconstruir args tras el posible shift (preserva comillas/espacios) ---
set "ARGS="
:collect
if "%~1"=="" goto dispatch
set ARGS=!ARGS! "%~1"
shift
goto collect

:dispatch
if "%RT%"=="npm" goto do_npm
if "%RT%"=="npx" goto do_npx
goto do_node

:do_node
where node >nul 2>&1
if not errorlevel 1 (
  node !ARGS!
  exit /b !errorlevel!
)
if exist "%DEPS%\node.exe" (
  "%DEPS%\node.exe" !ARGS!
  exit /b !errorlevel!
)
set "CODE=RUNTIME_UNAVAILABLE" & set "RTN=node" & set "MSG=No hay Node usable ni en el sistema (PATH) ni bundled en %DEPS%. Reinstala el runtime con install.ps1."
goto fail

:do_npm
where npm >nul 2>&1
if not errorlevel 1 (
  npm !ARGS!
  exit /b !errorlevel!
)
if exist "%DEPS%\node.exe" if exist "%DEPS%\node_modules\npm\bin\npm-cli.js" (
  "%DEPS%\node.exe" "%DEPS%\node_modules\npm\bin\npm-cli.js" !ARGS!
  exit /b !errorlevel!
)
set "CODE=RUNTIME_UNAVAILABLE" & set "RTN=npm" & set "MSG=No hay npm ni en el sistema (PATH) ni bundled en %DEPS%\node_modules\npm. Reinstala el runtime."
goto fail

:do_npx
where npx >nul 2>&1
if not errorlevel 1 (
  npx !ARGS!
  exit /b !errorlevel!
)
if exist "%DEPS%\node.exe" if exist "%DEPS%\node_modules\npm\bin\npx-cli.js" (
  "%DEPS%\node.exe" "%DEPS%\node_modules\npm\bin\npx-cli.js" !ARGS!
  exit /b !errorlevel!
)
set "CODE=RUNTIME_UNAVAILABLE" & set "RTN=npx" & set "MSG=No hay npx ni en el sistema (PATH) ni bundled en %DEPS%\node_modules\npm. Reinstala el runtime."
goto fail

:fail
echo {"ok":false,"error":{"code":"!CODE!","runtime":"!RTN!","message":"!MSG!"}}
echo [ERROR !CODE!] ^(!RTN!^) !MSG! 1>&2
exit /b 1
