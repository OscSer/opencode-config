# Instrucciones del Proyecto

Repositorio centralizado de configuraciones y reglas que unifican cómo se instalan agentes de IA.

## Estructura

```
agents-config/
├── opencode/           # Configuración específica de Opencode
│   └── opencode.json   # Archivo principal
├── rules/              # Reglas globales compartidas
│   └── AGENTS.md       # Instrucciones para todos los agentes
├── tests/              # Tests del script de instalación
│   └── test_install.py
├── install.py          # Script de instalación
└── AGENTS.md           # Este archivo (reglas para este repo)
```

## Desarrollo

### Tests

Ejecutar los tests siempre que modifiques `install.py` o cambies assets usados por el instalador:

```bash
python3 -m pytest tests/
```

### Modificaciones comunes

| Tarea                                | Archivos clave                    |
| ------------------------------------ | --------------------------------- |
| Ajustar la configuración de Opencode | `opencode/opencode.json`          |
| Actualizar reglas compartidas        | `rules/AGENTS.md`                 |
| Registrar nuevos agentes o assets    | `install.py` y nuevos directorios |

## Flujo de trabajo

1. Revisa la documentación relevante antes de tocar configuraciones.
2. Modifica los archivos adecuados según la tarea.
3. Ejecuta los tests mencionados sobre `install.py`.

## Documentación

Siempre consulta la documentación oficial antes de hacer cambios:

**Opencode**

- [Configuración](https://opencode.ai/docs/config)
- [MCP Servers](https://opencode.ai/docs/mcp-servers)
- [Reglas](https://opencode.ai/docs/rules)
- [Comandos](https://opencode.ai/docs/commands)
