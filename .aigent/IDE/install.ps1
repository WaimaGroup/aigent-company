# =============================================================================
# Aigent — Instalador de agentes, skills y MCPs (PowerShell / Windows)
#
# Uso no interactivo (flags):
#   .\install.ps1 [-Ide claude|opencode|all] [-Mode global|project]
#                 [-Dept <name>[,<name>]] [-Mcp] [-Update] [-DryRun]
#
# Uso interactivo (sin flags):
#   .\install.ps1
# =============================================================================

param(
  [ValidateSet("claude","opencode","all","")]
  [string]$Ide   = "",

  [ValidateSet("global","project","")]
  [string]$Mode  = "",

  [string]$Dept  = "",

  [switch]$Mcp,
  [switch]$Sync,         # solo regenera skills (omite agentes, MCP y BOSS bootstrap)
  [switch]$Prune,        # borra en destino las carpetas de skills sin source en el repo
  [switch]$Clean,        # modo declarativo: borra depts del repo NO listados en -Dept
  [switch]$Update,       # git pull del repo remoto antes de instalar
  [switch]$NodeStatus,   # muestra estado del runtime (sistema + bundled + pin) y sale
  [switch]$NodeInstall,  # descarga/asegura el Node bundled en IDE\bin\deps\ y sale
  [switch]$Force,        # con -NodeInstall: re-descarga aunque la versión ya cuadre
  [switch]$DryRun,
  [switch]$Help
)

# ── Trap global ──────────────────────────────────────────────────────────────
# Captura cualquier error no manejado, lo muestra y PAUSA la ventana antes de
# cerrar. Esto evita que el "Run with PowerShell" cierre la consola tan rápido
# que no te dé tiempo a leer el error. Sin esto, los fallos parpadean y mueren.
trap {
  Write-Host ""
  Write-Host "  ✗ ERROR no controlado:" -ForegroundColor Red
  Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
  if ($_.InvocationInfo -and $_.InvocationInfo.PositionMessage) {
    Write-Host ""
    Write-Host "  Posición:" -ForegroundColor DarkGray
    Write-Host "$($_.InvocationInfo.PositionMessage)" -ForegroundColor DarkGray
  }
  if ($_.ScriptStackTrace) {
    Write-Host ""
    Write-Host "  Stack trace:" -ForegroundColor DarkGray
    Write-Host "$($_.ScriptStackTrace)" -ForegroundColor DarkGray
  }
  Write-Host ""
  try { Read-Host "  Pulsa Enter para cerrar" } catch { }
  exit 1
}

# ── Rutas ─────────────────────────────────────────────────────────────────────
$ScriptDir      = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RepoRoot       = Split-Path -Parent $ScriptDir           # .aigent/
$ProjectRoot    = Split-Path -Parent $RepoRoot            # raíz del proyecto (siempre, sin importar desde dónde se invoque)
$DepartmentsDir = Join-Path $RepoRoot "departments"
$BossSrc        = Join-Path $RepoRoot "BOSS.md"

# ── Runtime Node bundled ──────────────────────────────────────────────────────
# Versión LTS fijada en IDE\bin\deps\.node-version (única fuente de verdad). El
# binario se descarga a IDE\bin\deps\ (nunca va en git). Las skills y el engine v2
# lo invocan vía el launcher IDE/bin/run, no con `node` a secas.
$RuntimeDir  = Join-Path $ScriptDir "bin"
$DepsDir     = Join-Path $RuntimeDir "deps"
$NodeVersion = "24.15.0"   # fallback defensivo si falta .node-version
$nodeVerFile = Join-Path $DepsDir ".node-version"
if (Test-Path $nodeVerFile) {
  $pinned = (Get-Content $nodeVerFile -Raw -ErrorAction SilentlyContinue)
  if ($pinned) { $pinned = $pinned.Trim(); if ($pinned) { $NodeVersion = $pinned } }
}

$ClaudeGlobalAgents  = Join-Path $env:APPDATA "Claude\agents"
$ClaudeProjectAgents = Join-Path $ProjectRoot ".claude\agents"
$ClaudeGlobalSkills  = Join-Path $env:APPDATA "Claude\skills"
$ClaudeProjectSkills = Join-Path $ProjectRoot ".claude\skills"
$ClaudeGlobalConfig  = Join-Path $env:APPDATA "Claude"
$ClaudeProjectConfig = Join-Path $ProjectRoot ".claude"

$OcGlobalAgents  = Join-Path $env:APPDATA "opencode\agents"
$OcProjectAgents = Join-Path $ProjectRoot ".opencode\agents"
$OcGlobalSkills  = Join-Path $env:APPDATA "opencode\skills"
$OcProjectSkills = Join-Path $ProjectRoot ".opencode\skills"
$OcGlobalConfig  = Join-Path $env:APPDATA "opencode"
$OcProjectConfig = Join-Path $ProjectRoot ".opencode"

# ── Helpers ───────────────────────────────────────────────────────────────────
function Write-Header {
  Write-Host ""
  Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Blue
  Write-Host "  ║   Aigent — Instalador de Agentes         ║" -ForegroundColor Blue
  Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Blue
  Write-Host ""
}
function Log-Info  ($msg) { Write-Host "  › $msg" -ForegroundColor Cyan }
function Log-Ok    ($msg) { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Log-Warn  ($msg) { Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
function Log-Error ($msg) { Write-Host "  ✗ $msg" -ForegroundColor Red }
function Log-Dry   ($msg) { Write-Host "  ~ $msg (dry-run)" -ForegroundColor DarkGray }
function Divider        { Write-Host "  ──────────────────────────────────────" -ForegroundColor DarkGray }

# Marcador leíble por wrappers externos (Cowork, otras UIs) para enumerar las
# opciones disponibles en cada prompt interactivo. Se imprime DENTRO del loop
# del menú, justo antes del Read-Host, para que aparezca también en reintentos.
# Formato:  ##OPTIONS:["1","2","Salir"]##
function Print-Options {
  param([string[]]$Options)
  $json = ($Options | ForEach-Object { '"' + ($_ -replace '"','\"') + '"' }) -join ','
  Write-Host ("##OPTIONS:[" + $json + "]##") -ForegroundColor DarkGray
}

function Get-Departments {
  Get-ChildItem -Path $DepartmentsDir -Directory |
    Where-Object { $_.Name -ne "_shared" } |
    Select-Object -ExpandProperty Name
}

function Copy-AgentFile($src, $destDir, $filename) {
  if ($DryRun) {
    Log-Dry "$([System.IO.Path]::GetFileName($src)) → $destDir\"
  } else {
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    Copy-Item -Path $src -Destination (Join-Path $destDir $filename) -Force
    $short = $destDir -replace [regex]::Escape($env:APPDATA), "%APPDATA%"
    $short = $short -replace [regex]::Escape((Get-Location).Path), "."
    Log-Ok "$([System.IO.Path]::GetFileName($src)) → $short\"
  }
}

# ── Skills ejecutables v2 ─────────────────────────────────────────────────────
# Las skills con `runtime: engine-v2` en su frontmatter no se copian tal cual:
# se genera un STUB ligero en el destino del IDE. La fuente pesada (manifiesto y
# bloques http) queda en .aigent/departments/<dept>/skills/<name>/SKILL.md.

function Get-SkillRuntime($skillMd) {
  $content = Get-Content -Raw -Path $skillMd -ErrorAction SilentlyContinue
  if (-not $content) { return "" }
  $content = $content -replace "`0", ""  # limpiar NULs residuales
  $fm = [regex]::Match($content, "^---\r?\n(.*?)\r?\n---", [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if (-not $fm.Success) { return "" }
  $rt = [regex]::Match($fm.Groups[1].Value, "(?m)^runtime:\s*([^\s#]+)")
  if ($rt.Success) { return $rt.Groups[1].Value.Trim().Trim('"',"'") }
  return ""
}

function Get-SkillMeta($skillMd) {
  $content = Get-Content -Raw -Path $skillMd -ErrorAction SilentlyContinue
  if (-not $content) { return @{ name = ""; description = "" } }
  $content = $content -replace "`0", ""
  $fm = [regex]::Match($content, "^---\r?\n(.*?)\r?\n---", [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if (-not $fm.Success) { return @{ name = ""; description = "" } }
  $body = $fm.Groups[1].Value

  $nameMatch = [regex]::Match($body, '(?m)^name:\s*"?([^"\n]+?)"?\s*$')
  $name = if ($nameMatch.Success) { $nameMatch.Groups[1].Value.Trim() } else { "" }

  # description folded `>` o literal `|`: capturar líneas indentadas
  $desc = ""
  $foldedMatch = [regex]::Match($body, '(?m)^description:\s*[>|]\s*\r?\n((?:[ \t]+.+\r?\n?)+)')
  if ($foldedMatch.Success) {
    $lines = $foldedMatch.Groups[1].Value -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    $desc = ($lines -join " ")
  } else {
    $scalarMatch = [regex]::Match($body, '(?m)^description:\s*"?([^"\n]+?)"?\s*$')
    if ($scalarMatch.Success) { $desc = $scalarMatch.Groups[1].Value.Trim() }
  }
  return @{ name = $name; description = $desc }
}

function Write-V2Stub($srcSkillMd, $destDir, $deptName, $skillName) {
  $meta = Get-SkillMeta $srcSkillMd
  $desc = if ($meta.description) { $meta.description } else { "Skill ejecutable v2 (sin description en el manifiesto)." }

  if ($DryRun) {
    Log-Dry "stub v2 → $destDir\SKILL.md  (engine: $skillName)"
    return
  }

  if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
  $destFile = Join-Path $destDir "SKILL.md"

  $stub = @"
---
name: $skillName
user-invocable: true
description: >
  $desc
---

# $skillName (engine v2)

<!-- AUTOGENERATED por install.ps1 — NO editar aquí.
     Fuente: .aigent/departments/$deptName/skills/$skillName/SKILL.md -->

Skill ejecutable. **No leas la fuente**: pide el contrato al engine, ahí está
el manifest exacto de acciones, inputs y outputs (formato JSON, ~100 tokens).

``````bash
# Ver acciones disponibles, sus inputs y sus outputs
.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs describe $skillName

# Ejecutar una acción
.aigent/IDE/bin/run .aigent/v2/engine/engine.cjs run $skillName <action> --inputs '{"...": "..."}'
``````

**Output del engine:** JSON a stdout, errores estructurados a stderr.
Exit code 0 si ``ok:true``, 1 si error.

``````json
{ "ok": true,  "data": { ... }, "meta": { "status": 200, "duration_ms": 142 } }
{ "ok": false, "error": { "code": "HTTP_404", "message": "..." }, "meta": {} }
``````

**Cuándo usar esta skill:** lo describe el ``description`` del frontmatter de
arriba. **Cuándo NO usar:** si la operación necesita razonamiento (decidir qué
pedir, redactar contenido, priorizar) — eso lo hace el agente; esta skill solo
ejecuta llamadas deterministas.
"@

  # Reemplazar `````` (escape PS1 dentro de string) por las triple-backticks reales
  $stub = $stub -replace '``````', '```'
  Set-Content -Path $destFile -Value $stub -Encoding UTF8

  $short = $destDir -replace [regex]::Escape($env:APPDATA), "%APPDATA%"
  $short = $short -replace [regex]::Escape((Get-Location).Path), "."
  Log-Ok "stub v2: $skillName → $short\  (engine: $skillName)"
}

function Install-Skill($srcSkillMd, $destDir, $deptName, $skillName) {
  $rt = Get-SkillRuntime $srcSkillMd
  if ($rt -eq "engine-v2") {
    Write-V2Stub $srcSkillMd $destDir $deptName $skillName
  } else {
    Copy-AgentFile $srcSkillMd $destDir "SKILL.md"
  }
}

# ── Instalación de un departamento ───────────────────────────────────────────
function Install-Dept($deptName, $agentsBase, $skillsBase) {
  $deptPath = Join-Path $DepartmentsDir $deptName
  $count    = 0

  Write-Host ""
  Write-Host "  📁 $deptName" -ForegroundColor White
  Divider

  # _shared → agentes en agentsBase/ (plano)  |  skills en skillsBase/shared-<skill>/SKILL.md
  if ($deptName -eq "_shared") {
    if (-not $Sync) {
      $agentsDir = Join-Path $deptPath "agents"
      if (Test-Path $agentsDir) {
        foreach ($f in (Get-ChildItem $agentsDir -Filter "*.md" -ErrorAction SilentlyContinue | Sort-Object Name)) {
          Copy-AgentFile $f.FullName $agentsBase $f.Name
          $count++
        }
      }
    }
    # Skills de _shared: cada carpeta ya viene con prefijo `shared-` → skillsBase/<skill_name>/SKILL.md
    $skillsDir = Join-Path $deptPath "skills"
    if (Test-Path $skillsDir) {
      foreach ($skillDir in (Get-ChildItem $skillsDir -Directory -ErrorAction SilentlyContinue | Sort-Object Name)) {
        $skillFile = Join-Path $skillDir.FullName "SKILL.md"
        if (Test-Path $skillFile) {
          Install-Skill $skillFile (Join-Path $skillsBase $skillDir.Name) "shared" $skillDir.Name
          $count++
        }
      }
    }
    Write-Host "  $count archivo(s) instalado(s)" -ForegroundColor Green
    return
  }

  # Orquestador y agentes — saltados en -Sync (solo skills)
  if (-not $Sync) {
    # Orquestador → agentsBase/ (plano, ya lleva prefijo de dept en el nombre)
    $orch = Join-Path $deptPath "$deptName-orchestrator.md"
    if (Test-Path $orch) {
      Copy-AgentFile $orch $agentsBase "$deptName-orchestrator.md"
      $count++
    }

    # Agentes especialistas → agentsBase/ (plano, nombres ya prefijados con dept)
    $agentsDir = Join-Path $deptPath "agents"
    if (Test-Path $agentsDir) {
      foreach ($f in (Get-ChildItem $agentsDir -Filter "*.md" -ErrorAction SilentlyContinue | Sort-Object Name)) {
        Copy-AgentFile $f.FullName $agentsBase $f.Name
        $count++
      }
    }
  }

  # Skills: cada carpeta ya viene con prefijo `<dept>-` → skillsBase/<skill_name>/SKILL.md
  # Si el SKILL.md es engine-v2, Install-Skill genera un stub en lugar de copiar.
  $skillsDir = Join-Path $deptPath "skills"
  if (Test-Path $skillsDir) {
    foreach ($skillDir in (Get-ChildItem $skillsDir -Directory -ErrorAction SilentlyContinue | Sort-Object Name)) {
      $skillFile = Join-Path $skillDir.FullName "SKILL.md"
      if (Test-Path $skillFile) {
        Install-Skill $skillFile (Join-Path $skillsBase $skillDir.Name) $deptName $skillDir.Name
        $count++
      }
    }
  }

  Write-Host "  $count archivo(s) instalado(s)" -ForegroundColor Green
}

function Install-ForIde($ideName, $agentsBase, $skillsBase, [string[]]$selectedDepts) {
  Write-Host ""
  Write-Host "  ▶ $ideName  →  agents: $agentsBase  |  skills: $skillsBase" -ForegroundColor Cyan
  Divider

  # _shared siempre primero
  Install-Dept "_shared" $agentsBase $skillsBase

  foreach ($dept in $selectedDepts) {
    Install-Dept $dept $agentsBase $skillsBase
  }
}

# ── Prune: borra carpetas en destino sin source en el repo ────────────────────
# Conservador: solo toca carpetas con prefijo `shared-` o `<dept>-` reconocido.
# Carpetas con otros prefijos (skills de otros sistemas, customs del usuario)
# NUNCA se tocan.
function Invoke-PruneOrphans($skillsBase) {
  if (-not (Test-Path $skillsBase)) { return }

  # Construir set de prefijos válidos: "shared-" + cada dept del repo
  $validPrefixes = @("shared-")
  foreach ($d in (Get-ChildItem $DepartmentsDir -Directory -ErrorAction SilentlyContinue)) {
    if ($d.Name -ne "_shared") { $validPrefixes += ("{0}-" -f $d.Name) }
  }

  $pruned = 0
  foreach ($entry in (Get-ChildItem $skillsBase -Directory -ErrorAction SilentlyContinue)) {
    $folder = $entry.Name
    $matchedDept = $null
    foreach ($p in $validPrefixes) {
      if ($folder.StartsWith($p)) { $matchedDept = $p.TrimEnd('-'); break }
    }
    if (-not $matchedDept) { continue }

    # ¿existe la carpeta source en el repo?
    if ($matchedDept -eq "shared") {
      $srcDir = Join-Path $DepartmentsDir "_shared/skills/$folder"
    } else {
      $srcDir = Join-Path $DepartmentsDir "$matchedDept/skills/$folder"
    }

    if (-not (Test-Path $srcDir -PathType Container)) {
      if ($DryRun) {
        Log-Dry "prune → $($entry.FullName) (no source)"
      } else {
        Remove-Item $entry.FullName -Recurse -Force
        Log-Ok "pruned → $($entry.FullName) (no source)"
      }
      $pruned++
    }
  }
  if ($pruned -gt 0) {
    Write-Host "  ♻  Prune: $pruned carpeta(s) huérfana(s) en $(Split-Path -Leaf $skillsBase)/" -ForegroundColor Yellow
  }
}

# ── Clean: borrar depts NO seleccionados (modo declarativo -Clean) ───────────
# Activado por -Clean. Tras instalar lo seleccionado, recorre el repo, identifica
# los departamentos NO listados en -Dept y borra en destino:
#   - Agentes con prefijo "<dept>-" (incluido el orquestador) en $agentsBase
#   - Carpetas con prefijo "<dept>-" en $skillsBase
# NUNCA toca shared-* ni archivos/carpetas con prefijos desconocidos.
function Invoke-CleanUnselectedDepts {
  param(
    [string]$IdeLabel,
    [string]$AgentsBase,
    [string]$SkillsBase,
    [string[]]$SelectedDepts
  )

  $repoDepts = @(Get-Departments)
  if ($repoDepts.Count -eq 0) { return }

  # Depts del repo que NO están en SelectedDepts → candidatos a limpiar
  $toClean = @()
  foreach ($rd in $repoDepts) {
    if ($SelectedDepts -notcontains $rd) { $toClean += $rd }
  }
  if ($toClean.Count -eq 0) { return }

  Write-Host ""
  Write-Host "  🧹 Clean → $IdeLabel  (depts no seleccionados: $($toClean -join ', '))" -ForegroundColor White
  Divider

  $totalRemoved = 0
  foreach ($dept in $toClean) {
    $removed = 0

    # Agentes: AgentsBase\<dept>-*.md
    if (Test-Path $AgentsBase) {
      foreach ($f in (Get-ChildItem -Path $AgentsBase -Filter "$dept-*.md" -File -ErrorAction SilentlyContinue)) {
        $short = $f.FullName -replace [regex]::Escape($env:APPDATA), "%APPDATA%"
        $short = $short -replace [regex]::Escape((Get-Location).Path), "."
        if ($DryRun) {
          Log-Dry "clean → $short"
        } else {
          Remove-Item -Path $f.FullName -Force
          Log-Ok "removed → $short"
        }
        $removed++
      }
    }

    # Skills: SkillsBase\<dept>-*\
    if (Test-Path $SkillsBase) {
      foreach ($entry in (Get-ChildItem -Path $SkillsBase -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name.StartsWith("$dept-") })) {
        $short = $entry.FullName -replace [regex]::Escape($env:APPDATA), "%APPDATA%"
        $short = $short -replace [regex]::Escape((Get-Location).Path), "."
        if ($DryRun) {
          Log-Dry "clean → $short\"
        } else {
          Remove-Item -Path $entry.FullName -Recurse -Force
          Log-Ok "removed → $short\"
        }
        $removed++
      }
    }

    if ($removed -eq 0) {
      Write-Host "    · $dept`: nada que limpiar en este IDE" -ForegroundColor DarkGray
    } else {
      Write-Host "    · $dept`: $removed artefacto(s) eliminado(s)" -ForegroundColor Yellow
    }
    $totalRemoved += $removed
  }

  if ($totalRemoved -eq 0) {
    Write-Host "  Nada que limpiar." -ForegroundColor DarkGray
  }
}

function Install-ContextSecrets {
  Write-Host ""
  Write-Host "  🔒 Scaffold de secretos → .context/" -ForegroundColor White
  Divider

  $contextDir = Join-Path $ProjectRoot ".context"

  if ($DryRun) {
    Log-Dry "mkdir .context/  +  crear .gitignore  +  crear .secrets.json (si faltan)"
    return
  }

  if (-not (Test-Path $contextDir)) {
    New-Item -ItemType Directory -Path $contextDir -Force | Out-Null
  }

  $gitignore = Join-Path $contextDir ".gitignore"
  if (-not (Test-Path $gitignore)) {
    @"
# Secretos locales — nunca commiteados
.secrets.json
*.local.json
"@ | Set-Content -Path $gitignore -Encoding UTF8
    Log-Ok ".gitignore creado en .context/"
  } else {
    $current = Get-Content $gitignore -Raw
    if ($current -notmatch '(?m)^\.secrets\.json\s*$') {
      Add-Content -Path $gitignore -Value "`n# Secretos locales — nunca commiteados`n.secrets.json"
      Log-Ok ".secrets.json añadido a .context/.gitignore existente"
    } else {
      Log-Info ".context/.gitignore ya excluye .secrets.json"
    }
  }

  $secretsFile = Join-Path $contextDir ".secrets.json"
  if (-not (Test-Path $secretsFile)) {
    "{}" | Set-Content -Path $secretsFile -Encoding UTF8
    Log-Ok ".secrets.json vacío creado en .context/ (rellenar con prepare-secrets)"
  } else {
    Log-Info ".context/.secrets.json ya existe — no se sobreescribe"
  }
}

# ── Runtime Node bundled ──────────────────────────────────────────────────────
# Major de un binario node dado (vacío si no ejecuta).
function Get-NodeMajor($bin) {
  $v = (& $bin -v 2>$null)
  if (-not $v) { return $null }
  $v = ([string]$v).Trim().TrimStart('v')
  return ($v -split '\.')[0]
}

# Pausa antes de salir SOLO si hay terminal interactiva (evita que una ventana
# lanzada por doble clic se cierre antes de leer). Si el stdin va por pipe/wrapper
# (redirigido), no pausa para no colgarse.
function Pause-BeforeExit {
  if (-not [Console]::IsInputRedirected) {
    Write-Host ""
    try { [void](Read-Host "  Pulsa Enter para salir") } catch { }
  }
}

# Estado del runtime: pin, bundled, sistema y qué resolvería el launcher.
function Get-NodeStatus {
  Write-Host ""
  Write-Host "  🔎 Estado del runtime Node" -ForegroundColor White
  Divider
  $target = Join-Path $DepsDir "node.exe"
  Write-Host "  Pin (.node-version):  $NodeVersion"

  $bundledOk = $false
  if (Test-Path $target) {
    $bver = (& $target -v 2>$null)
    if ($bver) { Write-Host "  Bundled (deps/):      OK $bver  ($target)" -ForegroundColor Green; $bundledOk = $true }
    else { Write-Host "  Bundled (deps/):      ! existe pero no ejecuta" -ForegroundColor Yellow }
  } else {
    Write-Host "  Bundled (deps/):      X no descargado" -ForegroundColor Red
  }

  $sysOk = $false
  $sysCmd = Get-Command node -ErrorAction SilentlyContinue
  if ($sysCmd) {
    $sver = (& node -v 2>$null); $smaj = Get-NodeMajor "node"
    if ($smaj -and [int]$smaj -ge 20) {
      Write-Host "  Sistema (PATH):       OK $sver en $($sysCmd.Source)" -ForegroundColor Green; $sysOk = $true
    } else {
      Write-Host "  Sistema (PATH):       ! $sver en $($sysCmd.Source) (< Node 20, no usable)" -ForegroundColor Yellow
    }
  } else {
    Write-Host "  Sistema (PATH):       X no encontrado" -ForegroundColor Red
  }

  if ($bundledOk)  { Write-Host "  El launcher usaria:   bundled deps/node.exe" }
  elseif ($sysOk)  { Write-Host "  El launcher usaria:   node del sistema (PATH)" }
  else { Write-Host "  El launcher usaria:   nada — instala con -NodeInstall" -ForegroundColor Red }
}

# Descarga el binario Node de nodejs.org a IDE\bin\deps\node.exe. Idempotente por
# versión salvo -Force. Detecta la arquitectura.
function Ensure-Runtime([switch]$ForceDl) {
  Write-Host ""
  Write-Host "  ⬇  Runtime Node $NodeVersion → IDE\bin\deps\" -ForegroundColor White
  Divider
  $target = Join-Path $DepsDir "node.exe"

  # ¿ya está la versión correcta? → idempotente, no re-descarga (salvo -Force).
  if ((-not $ForceDl) -and (Test-Path $target)) {
    $cur = (& $target -v 2>$null)
    if ($cur) { $cur = ([string]$cur).Trim().TrimStart('v') }
    if ($cur -eq $NodeVersion) {
      Log-Info "Node $NodeVersion ya presente en deps\ — no se descarga (usa -Force para reinstalar)."
      return
    }
    Log-Info "Node en deps\ es v$cur ≠ $NodeVersion — se re-descarga."
  }

  # Detectar arquitectura → artefacto win de nodejs.org.
  $arch = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }
  $pkg  = "node-v$NodeVersion-win-$arch"
  $url  = "https://nodejs.org/dist/v$NodeVersion/$pkg.zip"

  if ($DryRun) {
    Log-Dry "descargar $url → extraer node.exe → IDE\bin\deps\node.exe"
    return
  }

  if (-not (Test-Path $DepsDir)) { New-Item -ItemType Directory -Path $DepsDir -Force | Out-Null }
  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("aigent-node-" + [System.Guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Path $tmp -Force | Out-Null
  $zip = Join-Path $tmp "node.zip"

  Log-Info "Descargando $pkg.zip desde nodejs.org…"
  try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  } catch {
    Log-Error "Descarga fallida ($url): $($_.Exception.Message)"
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
    return
  }

  try {
    Expand-Archive -Path $zip -DestinationPath $tmp -Force
  } catch {
    Log-Error "Extracción fallida: $($_.Exception.Message)"
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
    return
  }

  Copy-Item -Path (Join-Path $tmp "$pkg\node.exe") -Destination $target -Force
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
  Log-Ok "Node $NodeVersion instalado → IDE\bin\deps\node.exe ($(& $target -v 2>$null))"
}

# Submenú interactivo "Runtime (Node)". PERSISTENTE: tras cada acción vuelve a
# mostrarse; sales tú con la opción 4 (o q). Blindajes: Read-Host en try/catch
# (EOF/stdin cerrado → salir limpio) y cada acción en try/catch para que un error
# no dispare el trap global ni cierre la ventana — solo se reporta y sigue.
function Invoke-RuntimeMenu {
  while ($true) {
    Write-Host ""
    Write-Host "  Runtime (Node)" -ForegroundColor White
    Write-Host "  1) Ver estado (sistema + bundled + pin)"
    Write-Host "  2) Instalar / actualizar a la versión fijada"
    Write-Host "  3) Reinstalar (force, re-descarga)"
    Write-Host "  4) Salir"
    Print-Options @("1","2","3","Salir")
    try { $c = Read-Host "  Opción [1] (q=salir)" } catch { Write-Host ""; return }
    if (Test-ControlInput $c) { continue }
    if ([string]::IsNullOrWhiteSpace($c)) { $c = "1" }
    switch ($c) {
      "1"     { try { Get-NodeStatus }          catch { Log-Error $_.Exception.Message } }
      "2"     { try { Ensure-Runtime }          catch { Log-Error $_.Exception.Message } }
      "3"     { try { Ensure-Runtime -ForceDl } catch { Log-Error $_.Exception.Message } }
      "4"     { return }
      "salir" { return }
      default { Write-Host "  Elige 1, 2, 3 o 4 (o q)." -ForegroundColor Red }
    }
  }
}

function Install-McpConfig($ideName, $configDir) {
  Write-Host ""
  Write-Host "  ⚙  MCP config → $configDir" -ForegroundColor White
  Divider
  switch ($ideName) {
    "claude"   {
      $src = Join-Path $ScriptDir ".mcp.json"
      if (Test-Path $src) { Copy-AgentFile $src $configDir ".mcp.json" }
      else { Log-Warn "IDE\.mcp.json not found" }
    }
    "opencode" {
      $src = Join-Path $ScriptDir "opencode.json"
      if (Test-Path $src) { Copy-AgentFile $src $configDir "opencode.json" }
      else { Log-Warn "IDE\opencode.json not found" }
    }
  }
}

# Permisos del IDE (allow / ask / deny). Para Claude se copia settings.local.json
# a $configDir (.claude\ proyecto o %APPDATA%\Claude\ global). Para OpenCode los
# permisos viven embebidos en el propio opencode.json — aquí solo se informa.
function Install-Permissions($ideName, $configDir) {
  Write-Host ""
  Write-Host "  🛡  Permisos → $ideName" -ForegroundColor White
  Divider
  switch ($ideName) {
    "claude" {
      $src = Join-Path $ScriptDir "settings.local.json"
      if (-not (Test-Path $src)) {
        Log-Warn "IDE\settings.local.json no encontrado — saltando permisos"
        return
      }
      $dest = Join-Path $configDir "settings.local.json"
      if (Test-Path $dest) {
        Log-Info "settings.local.json ya existe en $configDir — no se sobreescribe (edítalo a mano)"
      } else {
        Copy-AgentFile $src $configDir "settings.local.json"
      }
    }
    "opencode" {
      Log-Info "Permisos opencode embebidos en opencode.json (sección `"permission`")"
    }
  }
}

# ── Bootstrap: crea referencia dinámica a BOSS.md en el IDE ──────────────────
# CLAUDE.md        → "@.aigent/BOSS.md"              (Claude Code importa en cada sesión)
# opencode.json    → instructions: [".aigent/BOSS.md"] (OpenCode lee el fichero dinámicamente)
# Así cualquier cambio en BOSS.md se refleja sin re-instalar.
function Install-Boss($ideName) {
  if (-not (Test-Path $BossSrc)) {
    Log-Warn "BOSS.md no encontrado en $BossSrc — saltando bootstrap para $ideName"
    return
  }

  Write-Host ""
  Write-Host "  👑 Bootstrap → $ideName" -ForegroundColor White
  Divider

  switch ($ideName) {

    "claude" {
      $dest = Join-Path $ProjectRoot "CLAUDE.md"
      if ($DryRun) {
        Log-Dry "CLAUDE.md → @.aigent/BOSS.md (referencia dinámica)"
      } else {
        "@.aigent/BOSS.md" | Set-Content -Path $dest -Encoding UTF8
        Log-Ok "CLAUDE.md creado en $ProjectRoot (apunta a .aigent/BOSS.md)"
      }
    }

    "opencode" {
      # Buscar opencode.json: proyecto primero, luego global
      $ocConfig = $null
      if (Test-Path (Join-Path $ProjectRoot "opencode.json")) {
        $ocConfig = Join-Path $ProjectRoot "opencode.json"
      } elseif (Test-Path (Join-Path $env:APPDATA "opencode\opencode.json")) {
        $ocConfig = Join-Path $env:APPDATA "opencode\opencode.json"
      }
      if (-not $ocConfig) {
        Log-Warn "opencode.json no encontrado. Instala primero con -Mcp o cópialo manualmente."
        return
      }
      if ($DryRun) {
        Log-Dry "$ocConfig [instructions] → ['.aigent/BOSS.md'] (referencia dinámica)"
      } else {
        $cfg = Get-Content $ocConfig -Raw | ConvertFrom-Json
        # instructions acepta array de rutas → OpenCode las carga dinámicamente
        $cfg | Add-Member -NotePropertyName "instructions" -NotePropertyValue @(".aigent/BOSS.md") -Force
        $cfg | ConvertTo-Json -Depth 10 | Set-Content -Path $ocConfig -Encoding UTF8
        Log-Ok "$ocConfig [instructions] apunta a ['.aigent/BOSS.md']"
      }
    }
  }
}

# ── Actualización desde GitHub ────────────────────────────────────────────────
function Invoke-Update {
  Write-Host ""
  Write-Host "  ⟳  Comprobando actualizaciones..." -ForegroundColor White
  Divider

  # Verificar que .aigent es un repo git (sin remoto no podemos actualizar)
  $gitCheck = git -C $RepoRoot rev-parse --git-dir 2>$null
  if (-not $gitCheck) {
    Log-Error "Esta copia de .aigent no es un repositorio git, no puedo actualizar."
    Log-Info  "Para usar -Update, instala desde un clone del repo (no copiando los archivos a mano)."
    Log-Info  "Si copiaste el sistema sin git, descarga la nueva versión manualmente y sustituye .aigent/."
    exit 1
  }

  # Versión local
  $localVersion = "(desconocida)"
  $versionFile  = Join-Path $RepoRoot "VERSION"
  if (Test-Path $versionFile) {
    $localVersion = (Get-Content $versionFile -Raw).Trim()
  }

  # Fetch sin aplicar cambios aún
  Log-Info "Conectando con el repositorio remoto..."
  git -C $RepoRoot fetch --quiet 2>$null
  if ($LASTEXITCODE -ne 0) {
    Log-Error "No se pudo conectar con el repositorio remoto."
    Log-Info  "Verifica tu clave SSH y que tienes acceso al repo en GitHub."
    exit 1
  }

  # Rama remota (upstream o fallback a origin/main)
  $remoteBranch = git -C $RepoRoot rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null
  if (-not $remoteBranch) { $remoteBranch = "origin/main" }

  # Versión remota
  $remoteVersion = git -C $RepoRoot show "${remoteBranch}:VERSION" 2>$null
  if ($remoteVersion) { $remoteVersion = $remoteVersion.Trim() } else { $remoteVersion = "(desconocida)" }

  # Comparar
  if ($localVersion -eq $remoteVersion) {
    Write-Host ""
    Log-Ok "Ya tienes la última versión ($localVersion). No hay actualizaciones."
    Write-Host ""
    exit 0
  }

  Write-Host ""
  Write-Host "  Nueva versión disponible:  " -NoNewline -ForegroundColor White
  Write-Host "v$localVersion" -NoNewline -ForegroundColor Yellow
  Write-Host "  →  " -NoNewline -ForegroundColor White
  Write-Host "v$remoteVersion" -ForegroundColor Green
  Write-Host ""

  # Mostrar sección del CHANGELOG para la nueva versión
  $remoteChangelog = git -C $RepoRoot show "${remoteBranch}:CHANGELOG.md" 2>$null
  if ($remoteChangelog) {
    Write-Host "  Cambios en v${remoteVersion}:" -ForegroundColor White
    Divider
    $inSection = $false
    foreach ($line in ($remoteChangelog -split "`n")) {
      if ($line -match "^## $([regex]::Escape($remoteVersion))") { $inSection = $true; continue }
      if ($inSection -and ($line -match "^## " -or $line -match "^---")) { break }
      if ($inSection) { Write-Host "    $line" }
    }
    Write-Host ""
  }

  # Confirmar
  $done = $false
  while (-not $done) {
    Print-Options @("s","n","Salir")
    $confirm = Read-Host "  ¿Actualizar a v${remoteVersion}? [S/n]"
    $v = ($confirm).ToString().Trim().ToLowerInvariant()
    switch ($v) {
      { $_ -in @('s','si','sí','y','yes','') } { $done = $true }
      { $_ -in @('n','no','q','quit')         } {
        Write-Host "  Actualización cancelada." -ForegroundColor Yellow
        exit 0
      }
      default { Write-Host "  Responde s o n." -ForegroundColor Red }
    }
  }

  # Pull
  Write-Host ""
  if ($DryRun) {
    Log-Dry "git -C $RepoRoot pull"
  } else {
    Log-Info "Descargando actualizaciones..."
    git -C $RepoRoot pull --quiet
    if ($LASTEXITCODE -eq 0) {
      Log-Ok "Actualizado a v$remoteVersion"
    } else {
      Log-Error "Error al actualizar. Puede haber conflictos en .aigent/"
      Log-Info  "Revisa con: git -C .aigent status"
      exit 1
    }
  }

  Write-Host ""
  Write-Host "  Selecciona qué departamentos reinstalar con los cambios." -ForegroundColor DarkGray
  Write-Host ""
}

# ── Modo interactivo ──────────────────────────────────────────────────────────
function Invoke-Interactive {
  Write-Host "  Configuración de la instalación" -ForegroundColor White
  Write-Host ""
  Print-InteractiveBanner

  # 0. Tipo de instalación (solo si no vino -Sync por flag — ya está decidido)
  if (-not $Sync) {
    Write-Host "  ¿Qué tipo de instalación?" -ForegroundColor White
    Write-Host "  1) Completa - agentes + skills + MCP opcional + BOSS bootstrap"
    Write-Host "       (primer setup, nuevo departamento, instalación inicial)" -ForegroundColor DarkGray
    Write-Host "  2) Sync     - solo regenera skills (stubs v2 + copia v1)"
    Write-Host "       (refresca rápido tras editar un SKILL.md, sin tocar agentes/MCP/BOSS)" -ForegroundColor DarkGray
    Write-Host "  3) Runtime  - ver estado / instalar el Node bundled (no toca agentes/skills)"
    $typeDone = $false
    while (-not $typeDone) {
      Print-Options @("1","2","3","Salir")
      $installType = Read-Host "  Opción [1] (h=ayuda, q=salir)"
      if (Test-ControlInput $installType) { continue }
      if ([string]::IsNullOrWhiteSpace($installType)) { $installType = "1" }
      switch ($installType) {
        "1" { $script:Sync = $false; $typeDone = $true }
        "2" {
          $script:Sync = $true
          Write-Host "  ⟳  SYNC activado - el resto del flow se ajusta (sin MCP, sin BOSS)" -ForegroundColor Cyan
          $typeDone = $true
        }
        "3" { Invoke-RuntimeMenu; Write-Host ""; exit 0 }
        default { Write-Host "  Elige 1, 2 o 3 (o h/q)." -ForegroundColor Red }
      }
    }
    Write-Host ""
  }

  # 1. IDE
  Write-Host "  ¿En qué IDE quieres instalar los agentes?" -ForegroundColor White
  Write-Host "  1) Claude Code"
  Write-Host "  2) OpenCode"
  Write-Host "  3) Ambos"
  $script:Ide = $null
  while (-not $script:Ide) {
    Print-Options @("1","2","3","Salir")
    $ideChoice = Read-Host "  Opción (1/2/3, h=ayuda, q=salir)"
    if (Test-ControlInput $ideChoice) { continue }
    switch ($ideChoice) {
      "1" { $script:Ide = "claude" }
      "2" { $script:Ide = "opencode" }
      "3" { $script:Ide = "all" }
      default { Write-Host "  Elige 1, 2 o 3 (o h/q)." -ForegroundColor Red }
    }
  }
  Write-Host ""

  # 2. Scope
  Write-Host "  ¿Instalación en el proyecto actual o global?" -ForegroundColor White
  Write-Host "  1) Proyecto — solo en el directorio actual (recomendado: más control)" -ForegroundColor DarkGray
  Write-Host "  2) Global — disponible en todos los proyectos"
  $script:Mode = $null
  while (-not $script:Mode) {
    Print-Options @("1","2","Salir")
    $modeChoice = Read-Host "  Opción [1] (h=ayuda, q=salir)"
    if (Test-ControlInput $modeChoice) { continue }
    if ([string]::IsNullOrWhiteSpace($modeChoice)) { $modeChoice = "1" }
    switch ($modeChoice) {
      "1" { $script:Mode = "project" }
      "2" { $script:Mode = "global" }
      default { Write-Host "  Elige 1 o 2 (o h/q)." -ForegroundColor Red }
    }
  }
  Write-Host ""

  # 3. Departamentos
  $availableDepts = @(Get-Departments)
  if ($availableDepts.Count -eq 0) {
    Log-Error "No se encontraron departamentos en $DepartmentsDir"
    exit 1
  }

  Write-Host "  ¿Qué departamentos quieres instalar?" -ForegroundColor White
  Write-Host "  (los agentes de _shared se instalan siempre)" -ForegroundColor DarkGray
  Write-Host ""
  $i = 1
  foreach ($d in $availableDepts) {
    $nAgents = (Get-ChildItem (Join-Path $DepartmentsDir "$d\agents") -Filter "*.md" -ErrorAction SilentlyContinue).Count
    $nSkills = (Get-ChildItem (Join-Path $DepartmentsDir "$d\skills") -Filter "SKILL.md" -Recurse -ErrorAction SilentlyContinue).Count
    Write-Host "  $i) $d  — $nAgents agentes · $nSkills skills" -ForegroundColor White
    $i++
  }
  $allOption = $i
  Write-Host "  $allOption) Todos" -ForegroundColor DarkGray
  Write-Host ""

  # Construye las opciones del marcador: ["1","2",...,"N","Todos","Salir"].
  # Usamos "Todos" como label en vez del número equivalente para que el wrapper
  # pueda mostrarlo como botón distinto a los numéricos.
  $deptOptions = @()
  for ($n = 1; $n -lt $allOption; $n++) { $deptOptions += "$n" }
  $deptOptions += "Todos"
  $deptOptions += "Salir"

  $selectedDepts = @()
  while ($selectedDepts.Count -eq 0) {
    Print-Options $deptOptions
    $deptInput = Read-Host "  Números separados por espacio [$allOption] (h=ayuda, q=salir)"
    if (Test-ControlInput $deptInput) { continue }
    if ([string]::IsNullOrWhiteSpace($deptInput)) { $deptInput = "$allOption" }

    foreach ($num in ($deptInput -split '\s+')) {
      if ($num -match '^\d+$') {
        $n = [int]$num
        if ($n -eq $allOption) { $selectedDepts = $availableDepts; break }
        if ($n -ge 1 -and $n -lt $allOption) { $selectedDepts += $availableDepts[$n - 1] }
      }
    }
    if ($selectedDepts.Count -eq 0) {
      Write-Host "  Ningún número válido. Reintenta (o q para salir)." -ForegroundColor Red
    }
  }
  $script:Dept = $selectedDepts -join ","
  Write-Host ""

  # 4. Clean (modo declarativo) — solo si NO -Sync y hay depts del repo que NO
  # están en la selección (si están todos, no hay candidatos a limpiar).
  if (-not $Sync) {
    $toClean = @()
    foreach ($d in $availableDepts) {
      if ($selectedDepts -notcontains $d) { $toClean += $d }
    }

    if ($toClean.Count -gt 0) {
      Write-Host "  ¿Quitar los departamentos no seleccionados si ya estaban instalados?" -ForegroundColor White
      Write-Host "  Modo -Clean: borra agentes y skills de: $($toClean -join ', ')" -ForegroundColor Yellow
      Write-Host "  shared-* y carpetas personalizadas NUNCA se tocan." -ForegroundColor DarkGray
      $cleanDone = $false
      while (-not $cleanDone) {
        Print-Options @("s","n","Salir")
        $cleanChoice = Read-Host "  [s/N] (h=ayuda, q=salir)"
        if (Test-ControlInput $cleanChoice) { continue }
        $v = ($cleanChoice).ToString().Trim().ToLowerInvariant()
        switch ($v) {
          { $_ -in @('s','si','sí','y','yes') } { $script:Clean = $true;  $cleanDone = $true }
          { $_ -in @('','n','no')             } { $script:Clean = $false; $cleanDone = $true }
          default { Write-Host "  Responde s o n (o h/q)." -ForegroundColor Red }
        }
      }
      Write-Host ""
    }
  }

  # 5. MCPs (solo en instalación completa, no en -Sync)
  if (-not $Sync) {
    $done = $false
    while (-not $done) {
      Print-Options @("s","n","Salir")
      $mcpChoice = Read-Host "  ¿Instalar también los ficheros de configuración MCP? [s/N] (h=ayuda, q=salir)"
      if (Test-ControlInput $mcpChoice) { continue }
      $v = ($mcpChoice).ToString().Trim().ToLowerInvariant()
      switch ($v) {
        { $_ -in @('s','si','sí','y','yes') } { $script:Mcp = $true;  $done = $true }
        { $_ -in @('','n','no')             } { $script:Mcp = $false; $done = $true }
        default { Write-Host "  Responde s o n (o h/q)." -ForegroundColor Red }
      }
    }
    Write-Host ""
  }
}

# ── Main ──────────────────────────────────────────────────────────────────────

# ── Ayuda y atajos del modo interactivo ──────────────────────────────────────
function Print-Usage {
  Write-Host "  Uso:" -ForegroundColor White
  Write-Host "    .\install.ps1 [-Ide claude|opencode|all] [-Mode global|project]"
  Write-Host "                  [-Dept <name>[,<name>]|all] [-Mcp] [-Sync] [-Update] [-DryRun] [-Help]"
  Write-Host ""
  Write-Host "  Modos:" -ForegroundColor White
  Write-Host "    (sin -Sync)  Instalación completa: agentes + skills + MCP opcional + BOSS bootstrap."
  Write-Host "    -Sync        Solo skills (regenera stubs v2 + copia v1). Omite agentes,"
  Write-Host "                 MCP templates y BOSS bootstrap. Útil tras editar un SKILL.md"
  Write-Host "                 sin reinstalar todo el sistema."
  Write-Host "    -Update      Descarga cambios del repo GitHub (git pull) y luego instala."
  Write-Host "                 Muestra versión y changelog antes de aplicar."
  Write-Host ""
  Write-Host "  Flags:" -ForegroundColor White
  Write-Host "    -Ide           claude | opencode | all"
  Write-Host "    -Mode          global (%APPDATA%\Claude, %APPDATA%\opencode) | project (.claude, .opencode)"
  Write-Host "    -Dept          lista separada por comas (ej: marketing,operations) o 'all'"
  Write-Host "    -Mcp           copia los templates de configuración MCP al proyecto"
  Write-Host "    -Sync          solo regenera skills (omite agentes, MCP y BOSS)"
  Write-Host "    -Prune         al terminar, borra en destino las carpetas de skills sin source en el repo"
  Write-Host "    -Clean         modo declarativo: borra en destino los depts del repo NO listados en -Dept"
  Write-Host "                   (agentes y skills con prefijo <dept>-). Útil para 'quitar' un dept ya instalado."
  Write-Host "                   shared-* y customs del usuario NUNCA se tocan. Incompatible con -Sync."
  Write-Host "    -Update        git pull del repo remoto antes de instalar"
  Write-Host "    -NodeStatus    muestra qué Node hay (sistema + bundled + pin) y qué usaría el launcher; no instala"
  Write-Host "    -NodeInstall   descarga/asegura el Node bundled en IDE\bin\deps\ (aislado, no toca agentes/skills)"
  Write-Host "    -Force         con -NodeInstall: re-descarga aunque la versión ya cuadre"
  Write-Host "    -DryRun        muestra lo que haría sin escribir nada"
  Write-Host "    -Help          esta ayuda"
  Write-Host ""
  Write-Host "  Atajos rápidos:" -ForegroundColor White
  Write-Host "    .\install.ps1                                              # modo interactivo (recomendado)"
  Write-Host "    .\install.ps1 -Ide all -Mode project -Dept all             # instalación completa"
  Write-Host "    .\install.ps1 -Sync -Ide claude -Dept all                  # refresca todos los stubs"
  Write-Host "    .\install.ps1 -Sync -Ide all -Dept operations              # refresca solo redmine"
  Write-Host "    .\install.ps1 -Sync -Dept marketing -DryRun                # ver qué tocaría"
  Write-Host "    .\install.ps1 -Clean -Ide all -Dept marketing              # deja solo marketing (borra el resto)"
  Write-Host "    .\install.ps1 -Clean -Ide all -Dept marketing,operations -DryRun  # ver qué borraría"
  Write-Host "    .\install.ps1 -Update                                      # actualizar desde GitHub + reinstalar"
  Write-Host "    .\install.ps1 -Update -Sync -Ide claude -Dept all          # actualizar y sync rápido"
  Write-Host ""
  Write-Host "  Modo interactivo:" -ForegroundColor White
  Write-Host "    En cada paso puedes escribir:"
  Write-Host "      h  -> mostrar esta ayuda"
  Write-Host "      q  -> salir sin instalar"
}

function Print-InteractiveBanner {
  Write-Host "  Atajos en cada pregunta: h (ayuda)  q (salir)" -ForegroundColor DarkGray
  Write-Host "  Flags CLI: -Ide -Mode -Dept -Mcp -Sync -DryRun -Help" -ForegroundColor DarkGray
  Write-Host ""
}

# Devuelve $true si era control (h/q) y se gestionó (caller debe seguir el loop).
function Test-ControlInput($value) {
  $v = if ($null -eq $value) { "" } else { ($value).ToString().Trim().ToLowerInvariant() }
  if ($v -in @('h','help','?')) {
    Write-Host ""
    Print-Usage
    Write-Host ""
    return $true
  }
  if ($v -in @('q','quit','exit')) {
    Write-Host "  Cancelado por el usuario." -ForegroundColor Yellow
    exit 0
  }
  return $false
}

# ── Main ──────────────────────────────────────────────────────────────────────
# Forzar UTF-8 en la consola para que los caracteres especiales (cajas, acentos,
# símbolos) se rendericen bien tanto en PowerShell 5.1 como en 7. El archivo en
# disco DEBE estar guardado como UTF-8 con BOM o PS 5.1 lo leerá como ANSI.
try {
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  $OutputEncoding           = [System.Text.Encoding]::UTF8
} catch { }

Write-Header

if ($Help) {
  Print-Usage
  exit 0
}

if ($DryRun) { Write-Host "  ⚠  Modo DRY-RUN activado — no se realizarán cambios`n" -ForegroundColor Yellow }
if ($Sync)   { Write-Host "  ⟳  SYNC — solo se procesan skills (omite agentes, MCP, BOSS)`n" -ForegroundColor Cyan }
if ($Prune)  { Write-Host "  ♻  PRUNE — al terminar se eliminarán las skills huérfanas en destino`n" -ForegroundColor Yellow }
if ($Clean)  { Write-Host "  🧹 CLEAN — modo declarativo: se borrarán los depts no listados en -Dept`n" -ForegroundColor Yellow }
# Acciones aisladas de runtime (short-circuit): no tocan agentes/skills/MCP.
if ($NodeStatus) {
  try { Get-NodeStatus } catch { Log-Error $_.Exception.Message }
  Pause-BeforeExit; exit 0
}
if ($NodeInstall) {
  try { if ($Force) { Ensure-Runtime -ForceDl } else { Ensure-Runtime } } catch { Log-Error $_.Exception.Message }
  Pause-BeforeExit; exit 0
}

if ($Update) { Invoke-Update }

# -Clean + -Sync no tienen sentido juntos: -Sync solo toca skills.
if ($Clean -and $Sync) {
  Log-Error "-Clean es incompatible con -Sync (no toca agentes). Quita uno de los dos."
  exit 1
}

# En -Sync, Mode default = project
if ($Sync -and [string]::IsNullOrWhiteSpace($Mode)) { $Mode = "project" }

# Modo interactivo si faltan datos
if ([string]::IsNullOrWhiteSpace($Ide) -or [string]::IsNullOrWhiteSpace($Mode) -or [string]::IsNullOrWhiteSpace($Dept)) {
  Invoke-Interactive
}

# Resolver rutas
if ($Mode -eq "global") {
  $claudeAgents = $ClaudeGlobalAgents; $claudeSkills = $ClaudeGlobalSkills; $claudeConfig = $ClaudeGlobalConfig
  $ocAgents     = $OcGlobalAgents;     $ocSkills     = $OcGlobalSkills;     $ocConfig     = $OcGlobalConfig
} else {
  $claudeAgents = $ClaudeProjectAgents; $claudeSkills = $ClaudeProjectSkills; $claudeConfig = $ClaudeProjectConfig
  $ocAgents     = $OcProjectAgents;     $ocSkills     = $OcProjectSkills;     $ocConfig     = $OcProjectConfig
}

# Expandir "all" → lista real de departamentos disponibles.
# Sin esto, -Dept all dejaba $selectedDepts = @("all") e Install-Dept buscaba un dept inexistente.
if ($Dept -eq "all") {
  $selectedDepts = @(Get-Departments)
  if ($selectedDepts.Count -eq 0) {
    Log-Error "No se encontraron departamentos en $DepartmentsDir"
    exit 1
  }
} else {
  $selectedDepts = @($Dept -split '[,\s]+' | Where-Object { $_ })
}

# Instalar agentes y skills (en -Sync, Install-Dept salta agentes internamente)
if ($Ide -eq "claude"   -or $Ide -eq "all") { Install-ForIde "Claude Code" $claudeAgents $claudeSkills $selectedDepts }
if ($Ide -eq "opencode" -or $Ide -eq "all") { Install-ForIde "OpenCode"    $ocAgents     $ocSkills     $selectedDepts }

# Prune: solo si -Prune. Recorre cada $skillsBase y borra carpetas huérfanas.
if ($Prune) {
  Write-Host ""
  if ($Ide -eq "claude"   -or $Ide -eq "all") { Invoke-PruneOrphans $claudeSkills }
  if ($Ide -eq "opencode" -or $Ide -eq "all") { Invoke-PruneOrphans $ocSkills }
}

# Clean: solo si -Clean. Borra agentes + carpetas de skills de depts del repo
# que NO están en $selectedDepts. shared-* y customs del usuario nunca se tocan.
if ($Clean) {
  if ($Ide -eq "claude"   -or $Ide -eq "all") {
    Invoke-CleanUnselectedDepts -IdeLabel "Claude Code" -AgentsBase $claudeAgents -SkillsBase $claudeSkills -SelectedDepts $selectedDepts
  }
  if ($Ide -eq "opencode" -or $Ide -eq "all") {
    Invoke-CleanUnselectedDepts -IdeLabel "OpenCode" -AgentsBase $ocAgents -SkillsBase $ocSkills -SelectedDepts $selectedDepts
  }
}

# Runtime Node bundled — siempre (idempotente por versión). Necesario para que
# las skills y el engine v2 se ejecuten vía IDE/bin/run sin Node del sistema.
Ensure-Runtime

# MCP templates, BOSS bootstrap, permisos y scaffold de secretos — saltados en -Sync
if (-not $Sync) {
  if ($Mcp) {
    if ($Ide -eq "claude"   -or $Ide -eq "all") { Install-McpConfig "claude"   $claudeConfig }
    if ($Ide -eq "opencode" -or $Ide -eq "all") { Install-McpConfig "opencode" $ocConfig }
  }
  if ($Ide -eq "claude"   -or $Ide -eq "all") { Install-Permissions "claude"   $claudeConfig }
  if ($Ide -eq "opencode" -or $Ide -eq "all") { Install-Permissions "opencode" $ocConfig }
  if ($Ide -eq "claude"   -or $Ide -eq "all") { Install-Boss "claude" }
  if ($Ide -eq "opencode" -or $Ide -eq "all") { Install-Boss "opencode" }
  Install-ContextSecrets
}

# ── Resumen ───────────────────────────────────────────────────────────────────
Write-Host ""
if ($Sync) {
  Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
  Write-Host "  ║      ⟳  Sincronización completada        ║" -ForegroundColor Green
  Write-Host "  ╚═════════════════════════════════════════╝" -ForegroundColor Green
} else {
  Write-Host "  ╔═════════════════════════════════════════╗" -ForegroundColor Green
  Write-Host "  ║       ✓  Instalación completada          ║" -ForegroundColor Green
  Write-Host "  ╚═════════════════════════════════════════╝" -ForegroundColor Green
}
Write-Host ""
if (-not $DryRun) {
  Log-Info "Departamentos: $($selectedDepts -join ', ') + _shared"
  Log-Info "Scope:         $Mode"
  if ($Sync)  { Log-Info "Modo:          -Sync (solo skills)" }
  if ($Clean) { Log-Info "Modo:          -Clean activado (depts no seleccionados se han limpiado)" }
  if ($Ide -eq "claude"   -or $Ide -eq "all") {
    if (-not $Sync) { Log-Info "Claude agents: $claudeAgents\" }
    Log-Info "Claude skills: $claudeSkills\"
  }
  if ($Ide -eq "opencode" -or $Ide -eq "all") {
    if (-not $Sync) { Log-Info "OpenCode agents: $ocAgents\" }
    Log-Info "OpenCode skills: $ocSkills\"
  }
  Write-Host ""
  if ($Sync) {
    Write-Host "  Stubs regenerados. No hace falta reiniciar el IDE para skills." -ForegroundColor DarkGray
  } else {
    Write-Host "  Reinicia el IDE para que los agentes aparezcan disponibles." -ForegroundColor DarkGray
  }
}
Write-Host "" 