# `.aigent/IDE/` — Plantillas e instaladores

Este directorio contiene los **scripts de instalación** y las **plantillas técnicas** de configuración para los IDEs soportados por Aigent. No son recomendaciones del sistema, son ejemplos para que el usuario sepa por dónde empezar.

---

## Archivos

| Archivo | Qué es |
|---|---|
| `install.sh` | Instalador para Unix / macOS. Copia agentes y skills al IDE elegido y cablea `BOSS.md` como punto de entrada. |
| `install.ps1` | Lo mismo para Windows (PowerShell). |
| `.mcp.json` | **Plantilla** de configuración MCP para Claude Code. Muestra el formato del archivo, no es una recomendación de qué MCPs usar. |
| `opencode.json` | **Plantilla** de configuración para OpenCode (MCP + modelo + permisos `allow/ask/deny`). |
| `settings.local.json` | **Plantilla** de permisos para Claude Code. Se copia a `.claude/settings.local.json` del proyecto (o del usuario, en scope global). Lista por defecto los binarios habituales (bash, node, python, powershell, git read-only) como `allow`, las acciones destructivas (rm, sudo, git push, npm publish, terraform apply…) como `ask`, y las catastróficas (rm -rf /, dd, mkfs, shutdown…) como `deny`. |

---

## Qué hace el instalador

1. Copia los agentes y skills de los departamentos seleccionados al directorio que el IDE espera (`~/.claude/agents/`, `~/.config/opencode/agents/`, etc.).
2. **Cablea `BOSS.md` como punto de entrada del IDE**, sin duplicarlo:
   - **Claude Code:** crea `<root>/CLAUDE.md` con `@.aigent/BOSS.md` (referencia dinámica). Cualquier cambio en BOSS se refleja en la siguiente sesión sin reinstalar.
   - **OpenCode:** configura `instructions: [".aigent/BOSS.md"]` en `opencode.json` (también referencia dinámica).
3. Opcionalmente copia las plantillas `.mcp.json` u `opencode.json` al sitio que el IDE espera, para que el usuario las edite con sus propios MCPs.
4. Copia la plantilla de permisos al IDE elegido:
   - **Claude Code:** `settings.local.json` → `.claude/settings.local.json` (proyecto) o `%APPDATA%\Claude\settings.local.json` / `~/.claude/settings.local.json` (global). Si ya existe en destino, **no se sobreescribe** (el usuario manda).
   - **OpenCode:** los permisos viven embebidos en `opencode.json` bajo `"permission"`. Si se instaló la plantilla de OpenCode en el paso 3, los permisos vienen ya incluidos.

---

## Sobre `.mcp.json` y `opencode.json`

Estos archivos llevan dentro un único MCP de ejemplo, `brave-search`, con una API key placeholder. **Es ilustrativo, no es lo que recomendamos instalar**. Sirve para que el usuario:

- Vea el formato exacto que su IDE espera.
- Tenga un punto de partida funcional (cambiando la API key, brave-search funcionaría).
- Pueda añadir sus propios MCPs siguiendo el mismo patrón.

Las recomendaciones reales de MCPs por departamento viven en `.aigent/README.md`, sección *MCPs*. Y la lista de los que están realmente vigentes en cada proyecto se mantiene en `.context/config.json` (`mcps (en .context/<proyecto>/config.json)`).

---

## Recordatorio importante

Cuando configures cualquier MCP en tu IDE, **dale una `description` clara**: qué hace y cuándo invocarlo. El modelo decide si lo usa basándose en esa descripción. Una description vaga = MCP ignorado o mal usado.
