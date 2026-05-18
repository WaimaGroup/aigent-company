#!/usr/bin/env bash
# =============================================================================
# MULTIDEPS — Instalador de agentes, skills y bootstrap de IDE
#
# Modos:
#   (sin --sync)  Instalación completa: agentes + skills + MCP opcional + BOSS bootstrap.
#   --sync        Solo skills (regenera stubs v2 + copia v1). Omite agentes,
#                 MCP templates y BOSS bootstrap.
#
# Uso interactivo (recomendado):
#   ./install.sh
#
# Uso no interactivo:
#   ./install.sh --ide claude|opencode|all --mode global|project --dept <name>|all
#   ./install.sh --sync --ide claude --dept all
# =============================================================================

set -euo pipefail

# ── Colores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

# ── Rutas del repositorio ─────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"          # .aigent/
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"    # raíz del proyecto
DEPARTMENTS_DIR="$REPO_ROOT/departments"
BOSS_SRC="$REPO_ROOT/BOSS.md"

# ── Rutas por IDE ─────────────────────────────────────────────────────────────
CLAUDE_GLOBAL_AGENTS="$HOME/.claude/agents"
CLAUDE_PROJECT_AGENTS="$PROJECT_ROOT/.claude/agents"
CLAUDE_GLOBAL_SKILLS="$HOME/.claude/skills"
CLAUDE_PROJECT_SKILLS="$PROJECT_ROOT/.claude/skills"

OPENCODE_GLOBAL_AGENTS="$HOME/.config/opencode/agents"
OPENCODE_PROJECT_AGENTS="$PROJECT_ROOT/.opencode/agents"
OPENCODE_GLOBAL_SKILLS="$HOME/.config/opencode/skills"
OPENCODE_PROJECT_SKILLS="$PROJECT_ROOT/.opencode/skills"

# ── Valores por defecto ───────────────────────────────────────────────────────
IDE=""
MODE=""
DEPT=""
INSTALL_MCP=false
DRY_RUN=false
SYNC_ONLY=false       # --sync: solo skills (omite agentes, MCP, BOSS)
UPDATE=false          # --update: git pull antes de instalar
PRUNE=false           # --prune: borrar carpetas en destino que no tengan source en el repo
CLAUDE_SKILLS=""
OC_SKILLS=""

# ── Helpers ───────────────────────────────────────────────────────────────────
log_info()  { echo -e "${CYAN}  ›${NC} $1"; }
log_ok()    { echo -e "${GREEN}  ✓${NC} $1"; }
log_warn()  { echo -e "${YELLOW}  ⚠${NC} $1"; }
log_error() { echo -e "${RED}  ✗${NC} $1"; }
log_dry()   { echo -e "${DIM}  ~${NC} $1 ${DIM}(dry-run)${NC}"; }
divider()   { echo -e "${DIM}  ──────────────────────────────────────${NC}"; }

# Marcador leíble por wrappers externos (Cowork, otras UIs) para enumerar las
# opciones disponibles en cada prompt interactivo. Se imprime DENTRO del loop
# del menú, justo antes del read, para que aparezca también en reintentos.
# Formato:  ##OPTIONS:["1","2","Salir"]##
print_options() {
  local out="" first=1
  for it in "$@"; do
    if [ $first -eq 1 ]; then first=0; else out+=","; fi
    out+="\"$it\""
  done
  echo -e "${DIM}##OPTIONS:[$out]##${NC}"
}

print_header() {
  echo ""
  echo -e "${BOLD}${BLUE}  ╔══════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${BLUE}  ║     Aigent — Instalador de Agentes       ║${NC}"
  echo -e "${BOLD}${BLUE}  ╚══════════════════════════════════════════╝${NC}"
  echo ""
}

list_departments() {
  for d in "$DEPARTMENTS_DIR"/*/; do
    local name; name="$(basename "$d")"
    [[ "$name" == _shared ]] && continue
    echo "$name"
  done
}

copy_file() {
  local src="$1" dest_dir="$2" filename="$3"
  if $DRY_RUN; then
    log_dry "$(basename "$src") → ${dest_dir##"$HOME"}/"
  else
    mkdir -p "$dest_dir"
    cp "$src" "$dest_dir/$filename"
    log_ok "$(basename "$src") → ${dest_dir##"$HOME"}/"
  fi
}

# ── Ayuda ─────────────────────────────────────────────────────────────────────
print_usage() {
  echo -e "  ${BOLD}Uso:${NC}"
  echo "    ./install.sh [--ide claude|opencode|all] [--mode global|project]"
  echo "                 [--dept <name>[,<name>]|all] [--mcp] [--sync] [--update] [--dry-run] [--help|-h]"
  echo ""
  echo -e "  ${BOLD}Modos:${NC}"
  echo "    (sin --sync)  Instalación completa: agentes + skills + MCP opcional + BOSS bootstrap."
  echo "    --sync        Solo skills (regenera stubs v2 + copia v1). Omite agentes,"
  echo "                  MCP templates y BOSS bootstrap. Útil tras editar un SKILL.md"
  echo "                  sin reinstalar todo el sistema."
  echo "    --update      Descarga cambios del repo GitHub (git pull) y luego instala."
  echo "                  Muestra versión y changelog antes de aplicar."
  echo ""
  echo -e "  ${BOLD}Flags:${NC}"
  echo "    --ide          claude | opencode | all"
  echo "    --mode         global (~/.claude, ~/.config/opencode) | project (.claude, .opencode)"
  echo "    --dept         lista separada por comas (ej: marketing,operations) o 'all'"
  echo "    --mcp          copia los templates de configuración MCP al proyecto"
  echo "    --sync         solo regenera skills (omite agentes, MCP y BOSS)"
  echo "    --prune        al terminar, borra en destino las carpetas de skills sin source en el repo"
  echo "    --update       git pull del repo remoto antes de instalar"
  echo "    --dry-run      muestra lo que haría sin escribir nada"
  echo "    --help, -h     esta ayuda"
  echo ""
  echo -e "  ${BOLD}Atajos rápidos:${NC}"
  echo "    ./install.sh                                              # modo interactivo (recomendado)"
  echo "    ./install.sh --ide all --mode project --dept all          # instalación completa"
  echo "    ./install.sh --sync --ide claude --dept all               # refresca todos los stubs"
  echo "    ./install.sh --sync --prune --ide all --dept all          # refresca + limpia huérfanas"
  echo "    ./install.sh --sync --ide all --dept operations           # refresca solo redmine"
  echo "    ./install.sh --sync --dept marketing --dry-run            # ver qué tocaría"
  echo "    ./install.sh --update                                     # actualizar desde GitHub + reinstalar"
  echo "    ./install.sh --update --sync --ide claude --dept all      # actualizar y sync rápido"
  echo ""
  echo -e "  ${BOLD}Modo interactivo:${NC}"
  echo "    En cada paso puedes escribir:"
  echo -e "      ${BOLD}h${NC}  → mostrar esta ayuda"
  echo -e "      ${BOLD}q${NC}  → salir sin instalar"
}

print_interactive_banner() {
  echo -e "  ${DIM}Atajos en cada pregunta: ${BOLD}h${NC}${DIM} (ayuda)  ${BOLD}q${NC}${DIM} (salir)${NC}"
  echo -e "  ${DIM}Flags CLI: --ide --mode --dept --mcp --sync --dry-run --help${NC}"
  echo ""
}

# Helper: maneja respuestas de control en cualquier prompt del modo interactivo.
# Retorna 0 si era un control y se gestionó (caller debe seguir el loop).
handle_control() {
  case "${1,,}" in
    h|help|\?) echo ""; print_usage; echo ""; return 0 ;;
    q|quit|exit) echo -e "  ${YELLOW}Cancelado por el usuario.${NC}"; exit 0 ;;
    *) return 1 ;;
  esac
}

# ── Skills ejecutables v2 ─────────────────────────────────────────────────────
# Las skills con `runtime: engine-v2` no se copian: se genera un STUB ligero.

detect_skill_runtime() {
  local skill_md="$1"
  python3 - "$skill_md" <<'PYEOF' 2>/dev/null || true
import sys, re
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    content = f.read().replace('\x00', '')
m = re.match(r'^---\r?\n(.*?)\r?\n---', content, re.DOTALL)
if not m:
    sys.exit(0)
fm = m.group(1)
rt = re.search(r'^runtime:\s*([^\s#]+)', fm, re.MULTILINE)
if rt:
    print(rt.group(1).strip().strip('"').strip("'"))
PYEOF
}

extract_skill_meta() {
  local skill_md="$1"
  python3 - "$skill_md" <<'PYEOF' 2>/dev/null || true
import sys, re
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    content = f.read().replace('\x00', '')
m = re.match(r'^---\r?\n(.*?)\r?\n---', content, re.DOTALL)
if not m:
    sys.exit(0)
fm = m.group(1)
name_m = re.search(r'^name:\s*"?([^"\n]+?)"?\s*$', fm, re.MULTILINE)
name = name_m.group(1).strip() if name_m else ""
desc = ""
folded_m = re.search(r'^description:\s*[>|]\s*\n((?:[ \t]+.+\n?)+)', fm, re.MULTILINE)
if folded_m:
    lines = [l.strip() for l in folded_m.group(1).splitlines() if l.strip()]
    desc = ' '.join(lines)
else:
    scalar_m = re.search(r'^description:\s*"?([^"\n]+?)"?\s*$', fm, re.MULTILINE)
    if scalar_m:
        desc = scalar_m.group(1).strip()
print(f"{name}|||{desc}")
PYEOF
}

write_v2_stub() {
  local src_skill_md="$1" dest_dir="$2" dept_name="$3" skill_name="$4"
  local meta name desc dest_file="$dest_dir/SKILL.md"

  meta="$(extract_skill_meta "$src_skill_md")"
  name="${meta%%|||*}"
  desc="${meta#*|||}"
  [ -z "$name" ] && name="${skill_name}"
  [ -z "$desc" ] && desc="Skill ejecutable v2 (sin description en el manifiesto)."

  if $DRY_RUN; then
    log_dry "stub v2 → ${dest_dir##"$HOME"}/SKILL.md  (engine: ${skill_name})"
    return
  fi

  mkdir -p "$dest_dir"
  cat > "$dest_file" <<'STUB_EOF'
---
name: __SKILL__
user-invocable: true
description: >
  __DESC__
---

# __SKILL__ (engine v2)

<!-- AUTOGENERATED por install.sh — NO editar aquí.
     Fuente: .aigent/departments/__DEPT__/skills/__SKILL__/SKILL.md -->

Skill ejecutable. **No leas la fuente**: pide el contrato al engine, ahí está
el manifest exacto de acciones, inputs y outputs (formato JSON, ~100 tokens).

```bash
# Ver acciones disponibles, sus inputs y sus outputs
node .aigent/v2/engine/engine.js describe __SKILL__

# Ejecutar una acción
node .aigent/v2/engine/engine.js run __SKILL__ <action> --inputs '{"...": "..."}'
```

**Output del engine:** JSON a stdout, errores estructurados a stderr.
Exit code 0 si `ok:true`, 1 si error.

```json
{ "ok": true,  "data": { ... }, "meta": { "status": 200, "duration_ms": 142 } }
{ "ok": false, "error": { "code": "HTTP_404", "message": "..." }, "meta": {} }
```

**Cuándo usar esta skill:** lo describe el `description` del frontmatter de
arriba. **Cuándo NO usar:** si la operación necesita razonamiento (decidir qué
pedir, redactar contenido, priorizar) — eso lo hace el agente; esta skill solo
ejecuta llamadas deterministas.
STUB_EOF

  local desc_esc; desc_esc=$(printf '%s' "$desc" | sed -e 's/[\\&|]/\\&/g')
  sed -i \
    -e "s|__DEPT__|${dept_name}|g" \
    -e "s|__SKILL__|${skill_name}|g" \
    -e "s|__DESC__|${desc_esc}|g" \
    "$dest_file"

  log_ok "stub v2: ${skill_name} → ${dest_dir##"$HOME"}/  (engine: ${skill_name})"
}

install_skill() {
  local src_skill_md="$1" dest_dir="$2" dept_name="$3" skill_name="$4"
  local rt; rt="$(detect_skill_runtime "$src_skill_md")"
  if [ "$rt" = "engine-v2" ]; then
    write_v2_stub "$src_skill_md" "$dest_dir" "$dept_name" "$skill_name"
  else
    copy_file "$src_skill_md" "$dest_dir" "SKILL.md"
  fi
}

# ── Instalación de un departamento ───────────────────────────────────────────
install_dept() {
  local dept_name="$1" agents_base="$2" skills_base="$3"
  local dept_path="$DEPARTMENTS_DIR/$dept_name"
  local count=0

  echo ""; echo -e "  ${BOLD}📁 $dept_name${NC}"; divider

  # _shared: agentes (saltados en --sync) + skills compartidas
  if [[ "$dept_name" == "_shared" ]]; then
    if ! $SYNC_ONLY; then
      local src_dir="$dept_path/agents"
      if [ -d "$src_dir" ]; then
        while IFS= read -r f; do
          copy_file "$f" "$agents_base" "$(basename "$f")"; ((count++)) || true
        done < <(find "$src_dir" -name "*.md" 2>/dev/null | sort)
      fi
    fi
    src_dir="$dept_path/skills"
    if [ -d "$src_dir" ]; then
      for skill_dir in "$src_dir"/*/; do
        [ -d "$skill_dir" ] || continue
        local skill_name; skill_name="$(basename "$skill_dir")"
        if [ -f "$skill_dir/SKILL.md" ]; then
          install_skill "$skill_dir/SKILL.md" "$skills_base/${skill_name}" "shared" "$skill_name"
          ((count++)) || true
        fi
      done
    fi
    echo -e "  ${GREEN}$count archivo(s)${NC}"; return
  fi

  # Orquestador y agentes — saltados en --sync
  if ! $SYNC_ONLY; then
    local orch="$dept_path/${dept_name}-orchestrator.md"
    if [ -f "$orch" ]; then
      copy_file "$orch" "$agents_base" "${dept_name}-orchestrator.md"
      ((count++)) || true
    fi
    local agents_dir="$dept_path/agents"
    if [ -d "$agents_dir" ]; then
      while IFS= read -r f; do
        copy_file "$f" "$agents_base" "$(basename "$f")"; ((count++)) || true
      done < <(find "$agents_dir" -name "*.md" 2>/dev/null | sort)
    fi
  fi

  # Skills (siempre)
  local skills_dir="$dept_path/skills"
  if [ -d "$skills_dir" ]; then
    for skill_dir in "$skills_dir"/*/; do
      [ -d "$skill_dir" ] || continue
      local skill_name; skill_name="$(basename "$skill_dir")"
      if [ -f "$skill_dir/SKILL.md" ]; then
        install_skill "$skill_dir/SKILL.md" "$skills_base/${skill_name}" "$dept_name" "$skill_name"
        ((count++)) || true
      fi
    done
  fi

  echo -e "  ${GREEN}$count archivo(s)${NC}"
}

install_for_ide() {
  local ide_name="$1" agents_base="$2" skills_base="$3"; shift 3
  local selected_depts=("$@")
  echo ""
  echo -e "${BOLD}${CYAN}  ▶ $ide_name${NC}  →  agents: ${agents_base##"$HOME"}  |  skills: ${skills_base##"$HOME"}"
  divider
  install_dept "_shared" "$agents_base" "$skills_base"
  for dept in "${selected_depts[@]}"; do install_dept "$dept" "$agents_base" "$skills_base"; done
}

# ── Prune: borrar carpetas en destino que no tengan source en el repo ─────────
# Conservador: solo toca carpetas con prefijo `shared-` o `<dept>-` reconocido,
# y solo si NO existe la carpeta correspondiente en el repo. Carpetas con otros
# prefijos (skills de otros sistemas, customs del usuario) NUNCA se tocan.
prune_orphans() {
  local skills_base="$1"
  [ -d "$skills_base" ] || return 0

  # Construir set de prefijos válidos: "shared-" + cada dept del repo
  local valid_prefixes=("shared-")
  for d in "$DEPARTMENTS_DIR"/*/; do
    local name; name="$(basename "$d")"
    [[ "$name" == _shared ]] && continue
    valid_prefixes+=("${name}-")
  done

  local pruned=0
  for entry in "$skills_base"/*/; do
    [ -d "$entry" ] || continue
    local folder; folder="$(basename "$entry")"

    # ¿empieza por algún prefijo Aigent conocido?
    local has_aigent_prefix=false
    local matched_dept=""
    for p in "${valid_prefixes[@]}"; do
      if [[ "$folder" == ${p}* ]]; then
        has_aigent_prefix=true
        matched_dept="${p%-}"
        break
      fi
    done
    $has_aigent_prefix || continue

    # ¿existe la carpeta source en el repo?
    local src_dept_dir
    if [ "$matched_dept" == "shared" ]; then
      src_dept_dir="$DEPARTMENTS_DIR/_shared/skills/$folder"
    else
      src_dept_dir="$DEPARTMENTS_DIR/$matched_dept/skills/$folder"
    fi

    if [ ! -d "$src_dept_dir" ]; then
      local short="${entry%/}"
      short="${short/#$HOME/~}"
      if $DRY_RUN; then
        log_dry "prune → $short (no source)"
      else
        rm -rf "$entry"
        log_ok "pruned → $short (no source)"
      fi
      pruned=$((pruned+1))
    fi
  done
  local base_name
  base_name="$(basename "$skills_base")"
  if [ $pruned -gt 0 ]; then
    echo -e "  ${YELLOW}♻  Prune:${NC} $pruned carpeta(s) huérfana(s) en $base_name/"
  fi
}

# ── Bootstrap BOSS ────────────────────────────────────────────────────────────
install_boss() {
  local ide="$1"
  if [ ! -f "$BOSS_SRC" ]; then
    log_warn "BOSS.md no encontrado — saltando bootstrap para $ide"; return
  fi
  echo ""; echo -e "  ${BOLD}👑 Bootstrap → $ide${NC}"; divider

  case "$ide" in
    claude)
      local dest="$PROJECT_ROOT/CLAUDE.md"
      if $DRY_RUN; then
        log_dry "CLAUDE.md → @.aigent/BOSS.md (referencia dinámica)"
      else
        echo "@.aigent/BOSS.md" > "$dest"
        log_ok "CLAUDE.md creado en $PROJECT_ROOT/ (apunta a .aigent/BOSS.md)"
      fi
      ;;
    opencode)
      local oc_config
      if [ -f "$PROJECT_ROOT/opencode.json" ]; then
        oc_config="$PROJECT_ROOT/opencode.json"
      elif [ -f "$HOME/.config/opencode/opencode.json" ]; then
        oc_config="$HOME/.config/opencode/opencode.json"
      else
        log_warn "opencode.json no encontrado. Instala primero con --mcp o cópialo manualmente."
        return
      fi
      if $DRY_RUN; then
        log_dry "$oc_config [\"instructions\"] → [\".aigent/BOSS.md\"] (referencia dinámica)"
      else
        python3 - "$oc_config" <<PYEOF
import json, sys
cfg_path = sys.argv[1]
with open(cfg_path) as f: cfg = json.load(f)
cfg["instructions"] = [".aigent/BOSS.md"]
with open(cfg_path, "w") as f: json.dump(cfg, f, indent=2, ensure_ascii=False)
PYEOF
        log_ok "$oc_config [\"instructions\"] apunta a [\".aigent/BOSS.md\"]"
      fi
      ;;
    *) log_warn "Bootstrap no implementado para IDE: $ide" ;;
  esac
}

# ── Scaffold .context/.gitignore + .context/.secrets.json ────────────────────
# Garantiza que .context/ tenga un .gitignore que excluya los secretos y un
# .secrets.json vacío. El engine también lo crea al llamar a `prepare-secrets`,
# pero lo hacemos en install para que esté disponible desde el primer momento.
install_context_secrets() {
  local context_dir="$PROJECT_ROOT/.context"
  echo ""; echo -e "  ${BOLD}🔒 Scaffold de secretos → .context/${NC}"; divider

  if $DRY_RUN; then
    log_dry "mkdir .context/  +  crear .gitignore  +  crear .secrets.json (si faltan)"
    return
  fi

  mkdir -p "$context_dir"

  local gitignore="$context_dir/.gitignore"
  if [ ! -f "$gitignore" ]; then
    cat > "$gitignore" <<'EOF'
# Secretos locales — nunca commiteados
.secrets.json
*.local.json
EOF
    log_ok ".gitignore creado en .context/"
  else
    if ! grep -qE '^\.secrets\.json\s*$' "$gitignore"; then
      printf '\n# Secretos locales — nunca commiteados\n.secrets.json\n' >> "$gitignore"
      log_ok ".secrets.json añadido a .context/.gitignore existente"
    else
      log_info ".context/.gitignore ya excluye .secrets.json"
    fi
  fi

  local secrets_file="$context_dir/.secrets.json"
  if [ ! -f "$secrets_file" ]; then
    echo '{}' > "$secrets_file"
    log_ok ".secrets.json vacío creado en .context/ (rellenar con prepare-secrets)"
  else
    log_info ".context/.secrets.json ya existe — no se sobreescribe"
  fi
}

# ── MCP config (opcional) ─────────────────────────────────────────────────────
install_mcp() {
  local ide="$1"
  echo ""; echo -e "  ${BOLD}⚙  MCP config → $ide${NC}"; divider
  case "$ide" in
    claude)
      local src="$SCRIPT_DIR/.mcp.json"
      [ -f "$src" ] && copy_file "$src" "$PROJECT_ROOT" ".mcp.json" || log_warn ".mcp.json no encontrado en IDE/"
      ;;
    opencode)
      local src="$SCRIPT_DIR/opencode.json"
      [ -f "$src" ] && copy_file "$src" "$PROJECT_ROOT" "opencode.json" || log_warn "opencode.json no encontrado en IDE/"
      ;;
  esac
}

# ── Modo interactivo ──────────────────────────────────────────────────────────
ask_interactive() {
  echo -e "${BOLD}  Configuración de la instalación${NC}"; echo ""
  print_interactive_banner

  # 0. Tipo de instalación (solo si no vino --sync por flag — ya está decidido)
  if ! $SYNC_ONLY; then
    echo -e "  ${BOLD}¿Qué tipo de instalación?${NC}"
    echo -e "  ${DIM}1)${NC} Completa — agentes + skills + MCP opcional + BOSS bootstrap"
    echo -e "       ${DIM}(primer setup, nuevo departamento, instalación inicial)${NC}"
    echo -e "  ${DIM}2)${NC} Sync     — solo regenera skills (stubs v2 + copia v1)"
    echo -e "       ${DIM}(refresca rápido tras editar un SKILL.md, sin tocar agentes/MCP/BOSS)${NC}"
    while true; do
      print_options "1" "2" "Salir"
      printf "  Opción [1] (h=ayuda, q=salir): "; read -r install_type
      handle_control "$install_type" && continue
      install_type="${install_type:-1}"
      case "$install_type" in
        1) SYNC_ONLY=false; break ;;
        2) SYNC_ONLY=true
           echo -e "  ${CYAN}⟳  SYNC activado — el resto del flow se ajusta (sin MCP, sin BOSS)${NC}"
           break ;;
        *) echo -e "  ${RED}  Elige 1 o 2 (o h/q).${NC}" ;;
      esac
    done
    echo ""
  fi

  # 1. IDE
  echo -e "  ${BOLD}¿En qué IDE quieres instalar los agentes?${NC}"
  echo -e "  ${DIM}1)${NC} Claude Code"
  echo -e "  ${DIM}2)${NC} OpenCode"
  echo -e "  ${DIM}3)${NC} Ambos"
  while true; do
    print_options "1" "2" "3" "Salir"
    printf "  Opción (1/2/3, h=ayuda, q=salir): "; read -r ide_choice
    handle_control "$ide_choice" && continue
    case "$ide_choice" in
      1) IDE="claude";   break ;;
      2) IDE="opencode"; break ;;
      3) IDE="all";      break ;;
      *) echo -e "  ${RED}  Elige 1, 2 o 3 (o h/q).${NC}" ;;
    esac
  done
  echo ""

  # 2. Scope
  echo -e "  ${BOLD}¿Instalación en el proyecto actual o global?${NC}"
  echo -e "  ${DIM}1)${NC} Proyecto — solo en el directorio actual ${DIM}(recomendado: más control)${NC}"
  echo -e "  ${DIM}2)${NC} Global — disponible en todos los proyectos"
  while true; do
    print_options "1" "2" "Salir"
    printf "  Opción [1] (h=ayuda, q=salir): "; read -r mode_choice; mode_choice="${mode_choice:-1}"
    handle_control "$mode_choice" && continue
    case "$mode_choice" in
      1) MODE="project"; break ;;
      2) MODE="global";  break ;;
      *) echo -e "  ${RED}  Elige 1 o 2 (o h/q).${NC}" ;;
    esac
  done
  echo ""

  # 3. Departamentos
  local available_depts=()
  while IFS= read -r d; do available_depts+=("$d"); done < <(list_departments)
  [ ${#available_depts[@]} -eq 0 ] && { log_error "No se encontraron departamentos"; exit 1; }

  echo -e "  ${BOLD}¿Qué departamentos quieres instalar?${NC}"
  echo -e "  ${DIM}(_shared se instala siempre)${NC}"; echo ""
  local i=1
  for d in "${available_depts[@]}"; do
    local na ns
    na=$(find "$DEPARTMENTS_DIR/$d/agents" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    ns=$(find "$DEPARTMENTS_DIR/$d/skills"  -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    echo -e "  ${DIM}$i)${NC} ${BOLD}$d${NC} ${DIM}— $na agentes · $ns skills${NC}"; ((i++))
  done
  echo -e "  ${DIM}$i)${NC} Todos"

  # Construye las opciones del marcador: ("1" "2" ... "N" "Todos" "Salir").
  # "Todos" como label en lugar del número equivalente para que el wrapper
  # pueda mostrarlo como botón distinto de los numéricos.
  local dept_options=()
  for ((n=1; n<i; n++)); do dept_options+=("$n"); done
  dept_options+=("Todos" "Salir")

  local selected_depts=()
  while true; do
    print_options "${dept_options[@]}"
    printf "  Números separados por espacio [${i}] (h=ayuda, q=salir): "
    read -r dept_input; dept_input="${dept_input:-$i}"
    handle_control "$dept_input" && continue

    selected_depts=()
    if echo "$dept_input" | grep -qw "$i"; then
      selected_depts=("${available_depts[@]}")
    else
      for num in $dept_input; do
        [[ "$num" =~ ^[0-9]+$ ]] && [ "$num" -ge 1 ] && [ "$num" -lt "$i" ] \
          && selected_depts+=("${available_depts[$((num-1))]}")
      done
    fi
    if [ ${#selected_depts[@]} -gt 0 ]; then break; fi
    echo -e "  ${RED}  Ningún número válido. Reintenta (o q para salir).${NC}"
  done
  DEPT="${selected_depts[*]}"; echo ""

  # 4. MCPs (solo en instalación completa, no en --sync)
  if ! $SYNC_ONLY; then
    echo -e "  ${BOLD}¿Copiar también los templates de configuración MCP?${NC}"
    while true; do
      print_options "s" "n" "Salir"
      printf "  [s/N] (h=ayuda, q=salir): "; read -r mcp_choice
      handle_control "$mcp_choice" && continue
      case "${mcp_choice,,}" in
        s|si|sí|y|yes) INSTALL_MCP=true; break ;;
        n|no|"")       INSTALL_MCP=false; break ;;
        *)             echo -e "  ${RED}  Responde s o n (o h/q).${NC}" ;;
      esac
    done
    echo ""
  fi
}

# ── Actualización desde GitHub ────────────────────────────────────────────────
run_update() {
  echo ""; echo -e "  ${BOLD}⟳  Comprobando actualizaciones...${NC}"; divider

  # Verificar que .aigent es un repo git (sin remoto no podemos actualizar)
  if ! git -C "$REPO_ROOT" rev-parse --git-dir &>/dev/null; then
    log_error "Esta copia de .aigent no es un repositorio git, no puedo actualizar."
    log_info  "Para usar --update, instala desde un clone del repo (no copiando los archivos a mano)."
    log_info  "Si copiaste el sistema sin git, descarga la nueva versión manualmente y sustituye .aigent/."
    exit 1
  fi

  # Versión local
  LOCAL_VERSION="(desconocida)"
  [ -f "$REPO_ROOT/VERSION" ] && LOCAL_VERSION=$(cat "$REPO_ROOT/VERSION" | tr -d '[:space:]')

  # Fetch sin aplicar cambios aún
  log_info "Conectando con el repositorio remoto..."
  if ! git -C "$REPO_ROOT" fetch --quiet 2>/dev/null; then
    log_error "No se pudo conectar con el repositorio remoto."
    log_info  "Verifica tu clave SSH y que tienes acceso al repo en GitHub."
    exit 1
  fi

  # Rama remota (upstream configurado, o fallback a origin/main)
  REMOTE_BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo "origin/main")

  # Versión remota
  REMOTE_VERSION=$(git -C "$REPO_ROOT" show "$REMOTE_BRANCH:VERSION" 2>/dev/null | tr -d '[:space:]')
  [ -z "$REMOTE_VERSION" ] && REMOTE_VERSION="(desconocida)"

  # Comparar
  if [ "$LOCAL_VERSION" = "$REMOTE_VERSION" ]; then
    echo ""
    log_ok "Ya tienes la última versión ($LOCAL_VERSION). No hay actualizaciones."
    echo ""; exit 0
  fi

  echo ""
  echo -e "  ${BOLD}Nueva versión disponible:${NC}  ${YELLOW}v$LOCAL_VERSION${NC}  →  ${GREEN}v$REMOTE_VERSION${NC}"
  echo ""

  # Mostrar sección del CHANGELOG para la nueva versión
  REMOTE_CHANGELOG=$(git -C "$REPO_ROOT" show "$REMOTE_BRANCH:CHANGELOG.md" 2>/dev/null)
  if [ -n "$REMOTE_CHANGELOG" ]; then
    echo -e "  ${BOLD}Cambios en v$REMOTE_VERSION:${NC}"
    divider
    echo "$REMOTE_CHANGELOG" | \
      awk "/^## $REMOTE_VERSION/{found=1; next} found && /^## /{exit} found && /^---/{exit} found{print}" | \
      while IFS= read -r line; do echo "    $line"; done
    echo ""
  fi

  # Confirmar
  while true; do
    print_options "s" "n" "Salir"
    printf "  ¿Actualizar a v$REMOTE_VERSION? [S/n] (q=cancelar): "; read -r confirm
    case "${confirm,,}" in
      s|si|sí|y|yes|"") break ;;
      n|no|q|quit)
        echo -e "  ${YELLOW}Actualización cancelada.${NC}"; exit 0 ;;
      *) echo -e "  ${RED}  Responde s o n.${NC}" ;;
    esac
  done

  # Pull
  echo ""
  log_info "Descargando actualizaciones..."
  if $DRY_RUN; then
    log_dry "git -C $REPO_ROOT pull"
  elif git -C "$REPO_ROOT" pull --quiet; then
    log_ok "Actualizado a v$REMOTE_VERSION"
  else
    log_error "Error al actualizar. Puede haber conflictos en .aigent/"
    log_info  "Revisa con: git -C .aigent status"
    exit 1
  fi

  echo ""
  echo -e "  ${DIM}Selecciona qué departamentos reinstalar con los cambios.${NC}"
  echo ""
}

# ── Parse de argumentos ───────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --ide)         IDE="$2";         shift 2 ;;
    --mode)        MODE="$2";        shift 2 ;;
    --dept)        DEPT="$2";        shift 2 ;;
    --mcp)         INSTALL_MCP=true; shift   ;;
    --sync)        SYNC_ONLY=true;   shift   ;;
    --prune)       PRUNE=true;       shift   ;;
    --update)      UPDATE=true;      shift   ;;
    --dry-run)     DRY_RUN=true;     shift   ;;
    --help|-h)     print_header; print_usage; exit 0 ;;
    *) log_error "Opción desconocida: $1"; exit 1 ;;
  esac
done

# ── Main ──────────────────────────────────────────────────────────────────────
print_header
$DRY_RUN   && echo -e "  ${YELLOW}⚠  DRY-RUN — no se realizarán cambios${NC}\n"
$SYNC_ONLY && echo -e "  ${CYAN}⟳  SYNC — solo se procesan skills (omite agentes, MCP, BOSS)${NC}\n"
$PRUNE     && echo -e "  ${YELLOW}♻  PRUNE — al terminar se eliminarán las skills huérfanas en destino${NC}\n"
$UPDATE    && run_update

# En sync, mode default = project (lo más común al refrescar stubs)
if $SYNC_ONLY && [ -z "$MODE" ]; then MODE="project"; fi

if [ -z "$IDE" ] || [ -z "$MODE" ] || [ -z "$DEPT" ]; then ask_interactive; fi

# Rutas según scope
if [ "$MODE" == "global" ]; then
  CLAUDE_AGENTS="$CLAUDE_GLOBAL_AGENTS"
  CLAUDE_SKILLS="$CLAUDE_GLOBAL_SKILLS"
  OC_AGENTS="$OPENCODE_GLOBAL_AGENTS"
  OC_SKILLS="$OPENCODE_GLOBAL_SKILLS"
else
  CLAUDE_AGENTS="$CLAUDE_PROJECT_AGENTS"
  CLAUDE_SKILLS="$CLAUDE_PROJECT_SKILLS"
  OC_AGENTS="$OPENCODE_PROJECT_AGENTS"
  OC_SKILLS="$OPENCODE_PROJECT_SKILLS"
fi

# Expandir "all" → lista real de departamentos disponibles.
# Sin esto, --dept all dejaba SELECTED_DEPTS=("all") y install_dept buscaba un dept inexistente.
if [ "$DEPT" == "all" ]; then
  SELECTED_DEPTS=()
  while IFS= read -r d; do SELECTED_DEPTS+=("$d"); done < <(list_departments)
  if [ ${#SELECTED_DEPTS[@]} -eq 0 ]; then
    log_error "No se encontraron departamentos en $DEPARTMENTS_DIR"
    exit 1
  fi
else
  IFS=', ' read -r -a SELECTED_DEPTS <<< "$DEPT"
fi

# 1. Agentes + skills (en --sync solo skills)
if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then install_for_ide "Claude Code" "$CLAUDE_AGENTS" "$CLAUDE_SKILLS" "${SELECTED_DEPTS[@]}"; fi
if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then install_for_ide "OpenCode"    "$OC_AGENTS"     "$OC_SKILLS"     "${SELECTED_DEPTS[@]}"; fi

# 1.5 Prune: solo si --prune. Recorre cada $skills_base y borra carpetas huérfanas.
if $PRUNE; then
  echo ""
  if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then prune_orphans "$CLAUDE_SKILLS"; fi
  if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then prune_orphans "$OC_SKILLS";     fi
fi

# 2. MCP templates, BOSS bootstrap y scaffold de secretos — saltados en --sync
if ! $SYNC_ONLY; then
  if $INSTALL_MCP; then
    if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then install_mcp "claude";   fi
    if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then install_mcp "opencode"; fi
  fi
  if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then install_boss "claude";   fi
  if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then install_boss "opencode"; fi
  install_context_secrets
fi

# ── Resumen ───────────────────────────────────────────────────────────────────
echo ""
if $SYNC_ONLY; then
  echo -e "${BOLD}${GREEN}  ╔══════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${GREEN}  ║       ⟳  Sincronización completada       ║${NC}"
  echo -e "${BOLD}${GREEN}  ╚══════════════════════════════════════════╝${NC}"
else
  echo -e "${BOLD}${GREEN}  ╔══════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}${GREEN}  ║         ✓  Instalación completada        ║${NC}"
  echo -e "${BOLD}${GREEN}  ╚══════════════════════════════════════════╝${NC}"
fi
echo ""
if ! $DRY_RUN; then
  log_info "Departamentos: ${SELECTED_DEPTS[*]} + _shared"
  log_info "Scope:         $MODE"
  if $SYNC_ONLY; then log_info "Modo:          --sync (solo skills)"; fi
  if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then
    $SYNC_ONLY || log_info "Claude agents: ${CLAUDE_AGENTS##"$HOME"}/"
    log_info "Claude skills: ${CLAUDE_SKILLS##"$HOME"}/"
  fi
  if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then
    $SYNC_ONLY || log_info "OpenCode agents: ${OC_AGENTS##"$HOME"}/"
    log_info "OpenCode skills: ${OC_SKILLS##"$HOME"}/"
  fi
  echo ""
  if $SYNC_ONLY; then
    echo -e "  ${DIM}Stubs regenerados. No hace falta reiniciar el IDE para skills.${NC}"
  else
    echo -e "  ${DIM}Reinicia el IDE para que los agentes aparezcan disponibles.${NC}"
  fi
fi
echo ""
