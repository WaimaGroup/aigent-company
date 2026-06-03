@echo off
rem ===========================================================================
rem Aigent - runtime launcher (Windows cmd/PowerShell nativo)
rem
rem Cortesia para setups Windows donde el shell del agente NO es Git-Bash.
rem En la mayoria de casos (Claude Code / OpenCode) el shell es bash y se usa
rem el launcher `run` (sin extension). Este .cmd replica la misma logica:
rem   1) Node bundled junto al launcher (.aigent\IDE\bin\node.exe)
rem   2) Node del sistema en PATH
rem   3) Error claro
rem
rem Uso:  .aigent\IDE\bin\run.cmd <script.cjs> [args...]
rem ===========================================================================
setlocal enabledelayedexpansion
set "DIR=%~dp0"

rem 1) Bundled node.exe en deps/.
if exist "%DIR%deps\node.exe" (
  "%DIR%deps\node.exe" -v >nul 2>&1
  if not errorlevel 1 (
    "%DIR%deps\node.exe" %*
    exit /b !errorlevel!
  )
)

rem 2) Node del sistema en PATH.
where node >nul 2>&1
if not errorlevel 1 (
  node %*
  exit /b !errorlevel!
)

rem 3) Sin runtime usable.
echo aigent: no se encontro un runtime Node usable.>&2
echo         Esperaba el binario bundled en: %DIR%deps\node.exe>&2
echo         Reinstala el runtime con install.ps1.>&2
exit /b 1
