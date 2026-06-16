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

# ── Runtime Node bundled ──────────────────────────────────────────────────────
# Versión LTS fijada en IDE/bin/deps/.node-version (única fuente de verdad, leída
# también por nvm/fnm). El binario se descarga a IDE/bin/deps/ (nunca va en git).
# Las skills y el engine v2 lo invocan vía el launcher IDE/bin/run, no con `node`.
RUNTIME_DIR="$SCRIPT_DIR/bin"
DEPS_DIR="$RUNTIME_DIR/deps"
NODE_VERSION="$(tr -d '[:space:]' < "$DEPS_DIR/.node-version" 2>/dev/null || true)"
[ -z "$NODE_VERSION" ] && NODE_VERSION="24.15.0"   # fallback defensivo si falta el fichero

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
CLEAN=false           # --clean: modo declarativo — borrar depts del repo NO seleccionados en --dept
NODE_ACTION=""        # --node-status | --node-install: acción aislada de runtime (short-circuit)
FORCE=false           # --force: re-descarga el runtime aunque la versión ya cuadre
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
  echo "    --clean        modo declarativo: borra en destino los depts del repo NO listados en --dept"
  echo "                   (agentes y skills con prefijo <dept>-). Útil para 'quitar' un dept ya instalado."
  echo "                   shared-* y customs del usuario NUNCA se tocan. Incompatible con --sync."
  echo "    --update       git pull del repo remoto antes de instalar"
  echo "    --node-status  muestra qué Node hay (sistema + bundled + pin) y qué usaría el launcher; no instala"
  echo "    --node-install descarga/asegura el Node bundled en IDE/bin/deps/ (aislado, no toca agentes/skills)"
  echo "    --force        con --node-install: re-descarga aunque la versión ya cuadre"
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
  echo "    ./install.sh --clean --ide all --dept marketing           # deja solo marketing (borra el resto)"
  echo "    ./install.sh --clean --ide all --dept marketing,operations --dry-run  # ver qué borraría"
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
.aigent/IDE/bin/run node .aigent/v2/engine/engine.cjs describe __SKILL__

# Ejecutar una acción
.aigent/IDE/bin/run node .aigent/v2/engine/engine.cjs run __SKILL__ <action> --inputs '{"...": "..."}'
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

# ── Clean: borrar depts NO seleccionados (modo declarativo --clean) ──────────
# Activado por --clean. Tras instalar lo seleccionado, recorre el repo, identifica
# los departamentos NO listados en --dept y borra en destino:
#   - Agentes con prefijo "<dept>-" (incluido el orquestador) en $agents_base
#   - Carpetas con prefijo "<dept>-" en $skills_base
# NUNCA toca shared-* (siempre se quedan) ni archivos/carpetas con prefijos
# desconocidos (customs del usuario, skills de otros sistemas).
clean_unselected_depts() {
  local ide_label="$1" agents_base="$2" skills_base="$3"; shift 3
  local selected_depts=("$@")

  # Set de depts del repo (todos menos _shared)
  local repo_depts=()
  while IFS= read -r d; do repo_depts+=("$d"); done < <(list_departments)
  [ ${#repo_depts[@]} -eq 0 ] && return 0

  # Identificar depts del repo que NO están seleccionados → candidatos a limpiar
  local to_clean=()
  for rd in "${repo_depts[@]}"; do
    local found=false
    for sd in "${selected_depts[@]}"; do
      if [ "$rd" == "$sd" ]; then found=true; break; fi
    done
    $found || to_clean+=("$rd")
  done

  [ ${#to_clean[@]} -eq 0 ] && return 0

  echo ""
  echo -e "  ${BOLD}🧹 Clean → $ide_label${NC}  ${DIM}(depts no seleccionados: ${to_clean[*]})${NC}"
  divider

  local total_removed=0
  for dept in "${to_clean[@]}"; do
    local removed=0

    # Agentes: agents_base/<dept>-*.md
    if [ -d "$agents_base" ]; then
      while IFS= read -r f; do
        [ -z "$f" ] && continue
        local short="${f/#$HOME/~}"
        if $DRY_RUN; then
          log_dry "clean → $short"
        else
          rm -f "$f"
          log_ok "removed → $short"
        fi
        removed=$((removed+1))
      done < <(find "$agents_base" -maxdepth 1 -type f -name "${dept}-*.md" 2>/dev/null)
    fi

    # Skills: skills_base/<dept>-*/
    if [ -d "$skills_base" ]; then
      for entry in "$skills_base"/${dept}-*/; do
        [ -d "$entry" ] || continue
        local short="${entry%/}"
        short="${short/#$HOME/~}"
        if $DRY_RUN; then
          log_dry "clean → $short/"
        else
          rm -rf "$entry"
          log_ok "removed → $short/"
        fi
        removed=$((removed+1))
      done
    fi

    if [ $removed -eq 0 ]; then
      echo -e "  ${DIM}  · $dept: nada que limpiar en este IDE${NC}"
    else
      echo -e "  ${YELLOW}  · $dept: $removed artefacto(s) eliminado(s)${NC}"
    fi
    total_removed=$((total_removed+removed))
  done

  if [ $total_removed -eq 0 ]; then
    echo -e "  ${DIM}Nada que limpiar.${NC}"
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

# ── Activar el .gitignore de deployment (desde la plantilla .gitignore_) ──────
# La plantilla vive en .aigent/.gitignore_ (inerte en el framework). En el repo
# del cliente se activa copiándola a .aigent/.gitignore, para que ese repo ignore
# la copia vendorizada de .aigent/. NO se activa en el repo fuente del framework
# (heurística: ahí .aigent/ está trackeado en git).
activate_deployment_gitignore() {
  local tmpl="$REPO_ROOT/.gitignore_"
  local dest="$REPO_ROOT/.gitignore"
  [ -f "$tmpl" ] || return 0
  echo ""; echo -e "  ${BOLD}🙈 .gitignore de .aigent (deployment)${NC}"; divider

  # Repo fuente del framework (.aigent/ trackeado) → no activar, se trackea normal.
  if git -C "$PROJECT_ROOT" ls-files --error-unmatch ".aigent/README.md" >/dev/null 2>&1; then
    log_info "Repo fuente del framework (.aigent/ versionado) — no se activa el .gitignore de deployment."
    return 0
  fi

  if $DRY_RUN; then
    log_dry "activar .aigent/.gitignore desde .gitignore_ (el cliente ignora .aigent/)"
    return 0
  fi
  cp "$tmpl" "$dest"
  log_ok ".aigent/.gitignore activado — este repo ignora la copia vendorizada de .aigent/"
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

# ── Runtime Node bundled ──────────────────────────────────────────────────────
# Descarga el binario Node de nodejs.org a IDE/bin/node y asegura que el launcher
# IDE/bin/run sea ejecutable. Idempotente por versión: si ya está la versión
# fijada, no re-descarga. Detecta SO + arquitectura para elegir el artefacto.
ensure_runtime_perms() {
  [ -f "$RUNTIME_DIR/run" ] && chmod +x "$RUNTIME_DIR/run" 2>/dev/null || true
}

# Major de un binario node dado (vacío si no ejecuta). Uso: rt_major <bin>
rt_major() {
  local v; v="$("$1" -v 2>/dev/null)" || return 1
  v="${v#v}"; echo "${v%%.*}"
}

# Pausa antes de salir SOLO si hay terminal interactiva (evita que una ventana
# lanzada por doble clic se cierre antes de poder leer). Si el stdin va por
# pipe/wrapper (no TTY), no pausa para no colgarse. EOF-safe.
pause_before_exit() {
  if [ -t 0 ] && [ -t 1 ]; then
    echo ""
    printf "  ${DIM}Pulsa Enter para salir...${NC}"
    read -r _ || true
    echo ""
  fi
}

# Estado del runtime: pin, bundled, sistema y qué resolvería el launcher.
node_status() {
  echo ""; echo -e "  ${BOLD}🔎 Estado del runtime Node${NC}"; divider
  echo -e "  ${BOLD}Pin (.node-version):${NC}  ${NODE_VERSION}"

  # Bundled: en Windows el binario es node.exe (probar ambos nombres).
  local bundled_ok=false bundled_bin=""
  for cand in "$DEPS_DIR/node" "$DEPS_DIR/node.exe"; do
    [ -x "$cand" ] && { bundled_bin="$cand"; break; }
  done
  if [ -n "$bundled_bin" ]; then
    local bver; bver="$("$bundled_bin" -v 2>/dev/null)" || bver=""
    if [ -n "$bver" ]; then
      echo -e "  ${BOLD}Bundled (deps/):${NC}     ${GREEN}✓${NC} ${bver}  (${bundled_bin})"
      bundled_ok=true
    else
      echo -e "  ${BOLD}Bundled (deps/):${NC}     ${YELLOW}⚠${NC} existe pero no ejecuta (${bundled_bin})"
    fi
  else
    echo -e "  ${BOLD}Bundled (deps/):${NC}     ${RED}✗${NC} no descargado"
  fi

  # Sistema: en Git Bash 'node' suele ser un alias (winpty node.exe) y no da
  # versión en un script; 'node.exe' lo evita, así que se prueba primero.
  local sys_ok=false sys_bin="" sver=""
  for cand in node.exe node; do
    if command -v "$cand" >/dev/null 2>&1; then
      local v; v="$("$cand" -v 2>/dev/null)" || v=""
      [ -n "$v" ] && { sys_bin="$cand"; sver="$v"; break; }
    fi
  done
  if [ -n "$sver" ]; then
    local smaj="${sver#v}"; smaj="${smaj%%.*}"
    if [ -n "$smaj" ] && [ "$smaj" -ge 20 ] 2>/dev/null; then
      echo -e "  ${BOLD}Sistema (PATH):${NC}      ${GREEN}✓${NC} ${sver} (${sys_bin})"
      sys_ok=true
    else
      echo -e "  ${BOLD}Sistema (PATH):${NC}      ${YELLOW}⚠${NC} ${sver} (${sys_bin}, < Node 20)"
    fi
  else
    echo -e "  ${BOLD}Sistema (PATH):${NC}      ${RED}✗${NC} no encontrado (o solo alias sin binario ejecutable)"
  fi

  # npm / npx — también SYSTEM-FIRST: sistema (PATH) → bundled (deps/node_modules/npm).
  local npm_cli="$DEPS_DIR/node_modules/npm/bin/npm-cli.js"
  local npx_cli="$DEPS_DIR/node_modules/npm/bin/npx-cli.js"
  if command -v npm >/dev/null 2>&1;   then echo -e "  ${BOLD}npm:${NC}                 ${GREEN}✓${NC} sistema (PATH)"
  elif [ -f "$npm_cli" ];              then echo -e "  ${BOLD}npm:${NC}                 ${GREEN}✓${NC} bundled (deps/node_modules/npm)"
  else echo -e "  ${BOLD}npm:${NC}                 ${RED}✗${NC} ni sistema ni bundled"; fi
  if command -v npx >/dev/null 2>&1;   then echo -e "  ${BOLD}npx:${NC}                 ${GREEN}✓${NC} sistema (PATH)"
  elif [ -f "$npx_cli" ];              then echo -e "  ${BOLD}npx:${NC}                 ${GREEN}✓${NC} bundled (deps/node_modules/npm)"
  else echo -e "  ${BOLD}npx:${NC}                 ${RED}✗${NC} ni sistema ni bundled"; fi

  # SYSTEM-FIRST: el launcher prefiere el del sistema y cae al bundled.
  if $sys_ok;         then echo -e "  ${BOLD}El launcher usaría:${NC}  node del sistema (PATH)"
  elif $bundled_ok;   then echo -e "  ${BOLD}El launcher usaría:${NC}  bundled deps/node"
  else echo -e "  ${BOLD}El launcher usaría:${NC}  ${RED}nada — instala con --node-install${NC}"; fi
  return 0
}

# Asegura que haya un runtime Node usable. Sin force: NO descarga si ya hay uno
# (bundled descargado o Node del sistema en PATH, ≥20). Con force: descarga la
# versión fijada al bundled aunque ya exista otro runtime.
ensure_runtime() {
  local force="${1:-}"
  echo ""; echo -e "  ${BOLD}⬇  Runtime Node ${NODE_VERSION} → IDE/bin/deps/${NC}"; divider

  # Sin --force: si YA hay un runtime usable, NO se descarga nada. Se comprueban
  # los dos sitios que el launcher resuelve: (1) el bundled ya descargado en
  # deps/, (2) un Node del sistema en PATH. Cualquiera ≥20 vale. Solo se baja si
  # no hay ninguno. Con --force se ignora esto y se baja la versión fijada.
  if [ -z "$force" ]; then
    local b maj
    for b in "$DEPS_DIR/node" "$DEPS_DIR/node.exe"; do
      if [ -x "$b" ]; then
        maj="$(rt_major "$b" 2>/dev/null || true)"
        if [ -n "$maj" ] && [ "$maj" -ge 20 ] 2>/dev/null; then
          log_info "Bundled ya descargado ($("$b" -v 2>/dev/null)) — no se descarga (usa --force para reinstalar la versión fijada)."
          ensure_runtime_perms; return
        fi
      fi
    done
    for b in node.exe node; do
      if command -v "$b" >/dev/null 2>&1; then
        maj="$(rt_major "$b" 2>/dev/null || true)"
        if [ -n "$maj" ] && [ "$maj" -ge 20 ] 2>/dev/null; then
          log_info "Node del sistema usable ($("$b" -v 2>/dev/null) en PATH) — no se descarga el bundled (usa --force para forzarlo)."
          ensure_runtime_perms; return
        fi
      fi
    done
    log_info "No hay runtime usable (ni bundled ni en PATH) — se descarga el bundled."
  fi

  # Detectar SO (incluido Git Bash/MSYS = win) + arquitectura → artefacto.
  local os arch ext target bin_in
  case "$(uname -s)" in
    Linux)                os=linux;  ext=tar.gz ;;
    Darwin)               os=darwin; ext=tar.gz ;;
    MINGW*|MSYS*|CYGWIN*) os=win;    ext=zip ;;     # Git Bash en Windows
    *) log_warn "SO no soportado para descarga automática ($(uname -s)). Instala Node ≥20 a mano en IDE/bin/deps/."; ensure_runtime_perms; return ;;
  esac
  case "$(uname -m)" in
    x86_64|amd64)  arch=x64 ;;
    aarch64|arm64) arch=arm64 ;;
    *) log_warn "Arquitectura no soportada ($(uname -m)). Instala Node ≥20 a mano."; ensure_runtime_perms; return ;;
  esac

  local pkg="node-v${NODE_VERSION}-${os}-${arch}"
  if [ "$os" = "win" ]; then target="$DEPS_DIR/node.exe"; bin_in="$pkg/node.exe"
  else                       target="$DEPS_DIR/node";     bin_in="$pkg/bin/node"; fi

  local url="https://nodejs.org/dist/v${NODE_VERSION}/${pkg}.${ext}"

  if $DRY_RUN; then
    log_dry "descargar $url → extraer $bin_in → $target"
    ensure_runtime_perms
    return
  fi

  mkdir -p "$DEPS_DIR"
  local tmp; tmp="$(mktemp -d)"
  local dl="$tmp/node.${ext}"
  log_info "Descargando ${pkg}.${ext} desde nodejs.org…"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$dl" || { log_error "Descarga fallida ($url)"; rm -rf "$tmp"; return 1; }
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$dl" "$url" || { log_error "Descarga fallida ($url)"; rm -rf "$tmp"; return 1; }
  else
    log_error "Ni curl ni wget disponibles para descargar Node. Instálalo a mano en IDE/bin/deps/."; rm -rf "$tmp"; return 1
  fi

  # Extraer según formato.
  if [ "$ext" = "tar.gz" ]; then
    tar -xzf "$dl" -C "$tmp" || { log_error "Extracción tar fallida."; rm -rf "$tmp"; return 1; }
  else
    # ZIP (Windows): unzip si está; si no, Expand-Archive vía PowerShell.
    if command -v unzip >/dev/null 2>&1; then
      unzip -q -o "$dl" -d "$tmp" || { log_error "Extracción unzip fallida."; rm -rf "$tmp"; return 1; }
    elif command -v powershell.exe >/dev/null 2>&1; then
      local wdl wtmp
      wdl="$(cygpath -w "$dl" 2>/dev/null || echo "$dl")"
      wtmp="$(cygpath -w "$tmp" 2>/dev/null || echo "$tmp")"
      powershell.exe -NoProfile -Command "Expand-Archive -Force -LiteralPath '$wdl' -DestinationPath '$wtmp'" \
        || { log_error "Extracción Expand-Archive fallida."; rm -rf "$tmp"; return 1; }
    else
      log_error "No hay 'unzip' ni 'powershell.exe' para descomprimir el zip. Usa install.ps1 o instala 'unzip'."; rm -rf "$tmp"; return 1
    fi
  fi

  if [ ! -f "$tmp/$bin_in" ]; then
    log_error "No se encontró $bin_in dentro del paquete descargado."; rm -rf "$tmp"; return 1
  fi
  cp "$tmp/$bin_in" "$target"
  chmod +x "$target" 2>/dev/null || true

  # Conservar npm del propio tarball de Node (antes se descartaba). Así las skills
  # híbridas (shared-docx-rich, shared-pdf-toolkit) instalan sus librerías con el
  # runtime bundled, sin depender de que el usuario tenga npm en el PATH. En el
  # dist de Node, npm vive en lib/node_modules/npm (unix/mac) o node_modules/npm
  # (win). Se copia a deps/node_modules/npm (gitignored).
  local npm_src=""
  if [ "$os" = "win" ]; then npm_src="$tmp/$pkg/node_modules/npm"; else npm_src="$tmp/$pkg/lib/node_modules/npm"; fi
  if [ -d "$npm_src" ]; then
    mkdir -p "$DEPS_DIR/node_modules"
    rm -rf "$DEPS_DIR/node_modules/npm" 2>/dev/null || true
    if cp -R "$npm_src" "$DEPS_DIR/node_modules/npm"; then
      log_ok "npm bundled → ${DEPS_DIR}/node_modules/npm"
    else
      log_warn "No se pudo copiar npm; las skills híbridas usarán el npm del sistema."
    fi
  else
    log_warn "npm no encontrado en el paquete ($npm_src); las skills híbridas usarán el npm del sistema."
  fi

  rm -rf "$tmp"
  ensure_runtime_perms
  log_ok "Node ${NODE_VERSION} instalado → ${target} ($("$target" -v 2>/dev/null))"
}

# Smoke-test del launcher: comprueba que `run node|npm|npx` resuelven de verdad
# (system-first → bundled). No aborta la instalación: solo informa. Útil para
# detectar pronto un bundle sin npm/npx o un PATH roto.
runtime_smoke_test() {
  local run="$RUNTIME_DIR/run"
  [ -x "$run" ] || run="bash $RUNTIME_DIR/run"
  echo ""; echo -e "  ${BOLD}🚦 Smoke-test del launcher${NC}"; divider
  local rt out
  for rt in node npm npx; do
    if out="$($run "$rt" -v 2>/dev/null)"; then
      echo -e "  ${BOLD}run ${rt} -v:${NC}  ${GREEN}✓${NC} ${out}"
    else
      echo -e "  ${BOLD}run ${rt} -v:${NC}  ${YELLOW}⚠${NC} no resuelve (${rt} no está ni en PATH ni bundled)"
    fi
  done
  return 0
}

# Submenú interactivo "Runtime (Node)". PERSISTENTE: tras cada acción vuelve a
# mostrarse, así puedes leer el estado y salir tú con la opción 4 (o q). Dos
# blindajes imprescindibles bajo `set -e`:
#   · `read ... || { return 0; }` → si el stdin se cierra (EOF), sale limpio (0),
#      no muere con código 1.
#   · `node_status || true` / `ensure_runtime || true` → suspende errexit DENTRO
#      de la función y captura su retorno: ningún comando interno puede matar el
#      script tras pintar el estado.
runtime_menu() {
  local rt_choice=""
  while true; do
    echo ""
    echo -e "  ${BOLD}Runtime (Node)${NC}"
    echo -e "  ${DIM}1)${NC} Ver estado (sistema + bundled + pin)"
    echo -e "  ${DIM}2)${NC} Instalar / actualizar a la versión fijada"
    echo -e "  ${DIM}3)${NC} Reinstalar (force, re-descarga)"
    echo -e "  ${DIM}4)${NC} Salir"
    print_options "1" "2" "3" "Salir"
    printf "  Opción [1] (q=salir): "
    read -r rt_choice || { echo ""; return 0; }
    handle_control "$rt_choice" && continue
    case "${rt_choice:-1}" in
      1)             node_status || true ;;
      2)             ensure_runtime || true ;;
      3)             ensure_runtime force || true ;;
      4|salir|Salir) return 0 ;;
      *)             echo -e "  ${RED}  Elige 1, 2, 3 o 4 (o q).${NC}" ;;
    esac
  done
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
      if [ -f "$src" ]; then
        local oc_dest_dir
        if [ "$MODE" = "global" ]; then oc_dest_dir="$HOME/.config/opencode"; else oc_dest_dir="$PROJECT_ROOT"; fi
        local oc_dest="$oc_dest_dir/opencode.json"
        local merge_script="$SCRIPT_DIR/bin/merge-settings.cjs"
        local runner="$SCRIPT_DIR/bin/run"
        # Fusión NO destructiva (no pisar mcp/model/permisos del usuario; añadir
        # los patrones de permiso que falten, '*' al final). Crea si no existe.
        if $DRY_RUN; then
          if [ -f "$oc_dest" ]; then log_dry "fusionar opencode.json en $oc_dest (conservando mcp/model y permisos del usuario)"
          else log_dry "crear opencode.json en $oc_dest_dir/"; fi
        elif [ -f "$merge_script" ] && [ -x "$runner" ] && "$runner" "$merge_script" "$src" "$oc_dest" >/dev/null 2>&1; then
          log_ok "opencode.json instalado/actualizado en $oc_dest (fusión no destructiva; backup .bak si hubo cambios)"
        else
          if [ -f "$oc_dest" ]; then log_warn "No se pudo fusionar opencode.json (¿sin Node?). $oc_dest sin tocar."
          else copy_file "$src" "$oc_dest_dir" "opencode.json"; fi
        fi
      else
        log_warn "opencode.json no encontrado en IDE/"
      fi
      ;;
  esac
}

# ── Permisos del IDE (allow/ask/deny) ─────────────────────────────────────────
# Plantilla con permisos sensatos: allow para herramientas habituales (bash,
# node, python, powershell, git read-only), ask para acciones potencialmente
# destructivas (rm, sudo, git push, npm publish, terraform apply…), deny para
# las catastróficas (rm -rf /, dd, mkfs, shutdown…). El usuario edita después.
install_permissions() {
  local ide="$1"
  echo ""; echo -e "  ${BOLD}🛡  Permisos → $ide${NC}"; divider
  case "$ide" in
    claude)
      local src="$SCRIPT_DIR/settings.local.json"
      if [ ! -f "$src" ]; then
        log_warn "settings.local.json no encontrado en IDE/ — saltando permisos"
        return
      fi
      local dest_dir
      if [ "$MODE" = "global" ]; then
        dest_dir="$HOME/.claude"
      else
        dest_dir="$PROJECT_ROOT/.claude"
      fi
      local dest="$dest_dir/settings.local.json"
      local merge_script="$SCRIPT_DIR/bin/merge-settings.cjs"
      local runner="$SCRIPT_DIR/bin/run"
      # Fusión NO destructiva: añade las entradas de permiso que falten (p. ej.
      # Bash(.aigent/IDE/bin/run:*) en instalaciones previas a 4.0.0) conservando
      # lo que el usuario ya tuviera. Crea el fichero si no existe. Idempotente.
      if $DRY_RUN; then
        if [ -f "$dest" ]; then log_dry "fusionar permisos nuevos de la plantilla en $dest (conservando lo existente, backup .bak)"
        else log_dry "crear settings.local.json en $dest_dir/"; fi
      elif [ -f "$merge_script" ] && [ -x "$runner" ] && "$runner" "$merge_script" "$src" "$dest" >/dev/null 2>&1; then
        mkdir -p "$dest_dir" 2>/dev/null || true
        log_ok "Permisos instalados/actualizados en $dest (fusión no destructiva; backup .bak si hubo cambios)"
      else
        # Sin Node usable no se puede fusionar: no pisar lo existente.
        if [ -f "$dest" ]; then log_warn "No se pudo fusionar permisos (¿sin Node?). $dest sin tocar — compáralo a mano con IDE/settings.local.json."
        else copy_file "$src" "$dest_dir" "settings.local.json"; fi
      fi
      ;;
    opencode)
      # En opencode los permisos viven en el mismo opencode.json. Se fusionan de
      # forma NO destructiva (mismo merge que MCP; idempotente si --mcp ya lo hizo).
      local src="$SCRIPT_DIR/opencode.json"
      if [ ! -f "$src" ]; then log_warn "opencode.json no encontrado en IDE/ — saltando permisos opencode"; return; fi
      local oc_dest_dir
      if [ "$MODE" = "global" ]; then oc_dest_dir="$HOME/.config/opencode"; else oc_dest_dir="$PROJECT_ROOT"; fi
      local oc_dest="$oc_dest_dir/opencode.json"
      local merge_script="$SCRIPT_DIR/bin/merge-settings.cjs"
      local runner="$SCRIPT_DIR/bin/run"
      if $DRY_RUN; then
        log_dry "fusionar permisos en $oc_dest (sección permission.bash, '*' al final; conservando mcp/model)"
      elif [ -f "$merge_script" ] && [ -x "$runner" ] && "$runner" "$merge_script" "$src" "$oc_dest" >/dev/null 2>&1; then
        log_ok "Permisos opencode instalados/actualizados en $oc_dest (fusión no destructiva)"
      else
        if [ -f "$oc_dest" ]; then log_warn "No se pudo fusionar permisos opencode (¿sin Node?). $oc_dest sin tocar."
        else copy_file "$src" "$oc_dest_dir" "opencode.json"; fi
      fi
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
    echo -e "  ${DIM}3)${NC} Runtime  — ver estado / instalar el Node bundled (no toca agentes/skills)"
    while true; do
      print_options "1" "2" "3" "Salir"
      printf "  Opción [1] (h=ayuda, q=salir): "; read -r install_type
      handle_control "$install_type" && continue
      install_type="${install_type:-1}"
      case "$install_type" in
        1) SYNC_ONLY=false; break ;;
        2) SYNC_ONLY=true
           echo -e "  ${CYAN}⟳  SYNC activado — el resto del flow se ajusta (sin MCP, sin BOSS)${NC}"
           break ;;
        3) runtime_menu; echo ""; exit 0 ;;
        *) echo -e "  ${RED}  Elige 1, 2 o 3 (o h/q).${NC}" ;;
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

  # 4. Clean (modo declarativo) — solo si NO --sync y NO se seleccionaron todos
  # los depts (si están todos, no hay nada que limpiar). Pensado para el caso
  # "tenía marketing+sales instalados, ahora solo quiero operations".
  if ! $SYNC_ONLY; then
    # Calcular qué depts del repo NO están en la selección → candidatos a borrar
    local to_clean=()
    for d in "${available_depts[@]}"; do
      local in_sel=false
      for s in "${selected_depts[@]}"; do
        [ "$d" == "$s" ] && in_sel=true && break
      done
      $in_sel || to_clean+=("$d")
    done

    if [ ${#to_clean[@]} -gt 0 ]; then
      echo -e "  ${BOLD}¿Quitar los departamentos no seleccionados si ya estaban instalados?${NC}"
      echo -e "  ${DIM}Modo --clean: borra agentes y skills de: ${YELLOW}${to_clean[*]}${NC}"
      echo -e "  ${DIM}shared-* y carpetas personalizadas NUNCA se tocan.${NC}"
      while true; do
        print_options "s" "n" "Salir"
        printf "  [s/N] (h=ayuda, q=salir): "; read -r clean_choice
        handle_control "$clean_choice" && continue
        case "${clean_choice,,}" in
          s|si|sí|y|yes) CLEAN=true;  break ;;
          n|no|"")       CLEAN=false; break ;;
          *)             echo -e "  ${RED}  Responde s o n (o h/q).${NC}" ;;
        esac
      done
      echo ""
    fi
  fi

  # 5. MCPs (solo en instalación completa, no en --sync)
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
    --clean)       CLEAN=true;       shift   ;;
    --update)      UPDATE=true;      shift   ;;
    --node-status) NODE_ACTION="status";  shift ;;
    --node-install) NODE_ACTION="install"; shift ;;
    --force)       FORCE=true;       shift   ;;
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
$CLEAN     && echo -e "  ${YELLOW}🧹 CLEAN — modo declarativo: se borrarán los depts no listados en --dept${NC}\n"
# Acciones aisladas de runtime (short-circuit): no tocan agentes/skills/MCP.
if [ "$NODE_ACTION" = "status" ]; then
  node_status || true; pause_before_exit; exit 0
elif [ "$NODE_ACTION" = "install" ]; then
  if $FORCE; then ensure_runtime force || true; else ensure_runtime || true; fi
  runtime_smoke_test || true
  pause_before_exit; exit 0
fi

$UPDATE    && run_update

# --clean + --sync no tienen sentido juntos: --sync ya solo toca skills y
# evita los agentes; el modo declarativo necesita la pasada completa.
if $CLEAN && $SYNC_ONLY; then
  log_error "--clean es incompatible con --sync (no toca agentes). Quita uno de los dos."
  exit 1
fi

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

# 1.6 Clean: solo si --clean. Borra agentes + carpetas de skills de depts del
# repo que NO están en SELECTED_DEPTS. Pensado para "quitar" un dept ya
# instalado. shared-* y customs del usuario nunca se tocan.
if $CLEAN; then
  if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then
    clean_unselected_depts "Claude Code" "$CLAUDE_AGENTS" "$CLAUDE_SKILLS" "${SELECTED_DEPTS[@]}"
  fi
  if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then
    clean_unselected_depts "OpenCode" "$OC_AGENTS" "$OC_SKILLS" "${SELECTED_DEPTS[@]}"
  fi
fi

# 1.7 Runtime Node bundled — siempre (idempotente por versión). Necesario para
# que las skills y el engine v2 se ejecuten vía IDE/bin/run sin Node del sistema.
# `|| true`: un fallo de runtime no debe abortar el resto de la instalación.
ensure_runtime || true
runtime_smoke_test || true

# 2. MCP templates, BOSS bootstrap, permisos y scaffold de secretos — saltados en --sync
if ! $SYNC_ONLY; then
  if $INSTALL_MCP; then
    if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then install_mcp "claude";   fi
    if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then install_mcp "opencode"; fi
  fi
  if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then install_permissions "claude";   fi
  if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then install_permissions "opencode"; fi
  if [ "$IDE" == "claude"   ] || [ "$IDE" == "all" ]; then install_boss "claude";   fi
  if [ "$IDE" == "opencode" ] || [ "$IDE" == "all" ]; then install_boss "opencode"; fi
  install_context_secrets
  activate_deployment_gitignore
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
  if $CLEAN;     then log_info "Modo:          --clean activado (depts no seleccionados se han limpiado)"; fi
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