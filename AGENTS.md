# Agents Config

Repositorio centralizado de configuraciones y reglas que unifican cómo se instalan agentes de IA.

## Estructura

```
agents-config/
├── agents/
│   ├── opencode/
│   │   └── opencode.jsonc       # Configuración específica de Opencode
│   └── rules/
│       └── AGENTS.md            # Reglas globales compartidas
├── src/
│   ├── agents_config.py         # Registro de agentes y assets
│   ├── file_ops.py              # Utilidades de paths y symlinks
│   ├── installer.py             # Script del instalador
│   └── types_def.py             # Tipos compartidos
├── tests/                       # Pruebas del instalador y paths
├── requirements-dev.txt         # Dependencias de desarrollo
└── AGENTS.md                    # Este archivo (reglas para este repo)
```

## Setup de desarrollo

```bash
# Crear entorno virtual
python3 -m venv .venv

# Activar entorno virtual
source .venv/bin/activate

# Instalar dependencias de desarrollo
pip install -r requirements-dev.txt

# Instalar hooks de pre-commit (solo primera vez)
pre-commit install

# Ejecutar validaciones contra todos los archivos (opcional, verifica setup)
pre-commit run --all-files
```

**Requisitos:**

- Python 3.10 o superior
- Los hooks se ejecutan automáticamente antes de cada commit

## Uso

Ejecutar el instalador:

```bash
python3 -m src.installer
```

## Desarrollo

### Validaciones Pre-commit

Los hooks pre-commit se ejecutan automáticamente antes de cada commit para validar código, formato y tests. Si necesitas ejecutarlos manualmente:

```bash
# Ejecutar todos los hooks contra archivos modificados
pre-commit run

# Ejecutar todos los hooks contra todos los archivos
pre-commit run --all-files

# Ejecutar un hook específico
pre-commit run ruff --all-files
```

**Hooks configurados:**

- `ruff` (lint y autofix de problemas)
- `ruff-format` (formateo de código)
- `pyupgrade` (actualiza sintaxis a Python 3.10+)
- `check-merge-conflict`, `end-of-file-fixer`, `trailing-whitespace` (limpieza)
- `check-yaml`, `check-json`, `check-toml` (validación de sintaxis)
- `pytest` (pruebas unitarias antes de commit)

### Tests

Ejecutar los tests cuando modifiques `src/installer.py`, `src/agents_config.py`, `src/file_ops.py` o assets:

```bash
python3 -m pytest tests/
```

### Linting

Verificar calidad de código con ruff:F

```bash
ruff check .
```

### Modificaciones comunes

| Tarea                                | Archivos clave                              |
| ------------------------------------ | ------------------------------------------- |
| Ajustar la configuración de Opencode | `agents/opencode/opencode.jsonc`            |
| Actualizar reglas compartidas        | `agents/rules/AGENTS.md`                    |
| Registrar nuevos agentes o assets    | `src/agents_config.py` y `src/installer.py` |

## Flujo de trabajo

1. Revisa la documentación relevante antes de tocar configuraciones.
2. Modifica los archivos adecuados según la tarea.
3. Ejecuta los tests.

## Documentación

Siempre consulta la documentación oficial antes de hacer cambios:

**Opencode**

- [Configuración](https://opencode.ai/docs/config)
- [MCP Servers](https://opencode.ai/docs/mcp-servers)
- [Reglas](https://opencode.ai/docs/rules)
- [Comandos](https://opencode.ai/docs/commands)
