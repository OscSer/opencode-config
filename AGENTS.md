# Instrucciones del Proyecto

Este proyecto centraliza configuraciones y reglas para múltiples agentes de IA, facilitando su configuración a través de un script de instalación.

## Estructura

- `claude/` - Configuración de Claude Code
- `opencode/` - Configuración de Opencode
- `rules/` - Reglas globales para todos los agentes
- `install.py` - Script de instalación

## Desarrollo

Después de cualquier modificación, SIEMPRE ejecutar los tests para verificar que no se hayan introducido errores:

```bash
python3 -m pytest tests/
```

## Documentación

SIEMPRE debes consultar esta documentación para cada agente:

**Claude Code**

- [Configuración](https://docs.anthropic.com/en/docs/claude-code/settings)
- [MCP](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Reglas](https://docs.anthropic.com/en/docs/claude-code/memory)

**Opencode**

- [Configuración](https://opencode.ai/docs/config)
- [MCP](https://opencode.ai/docs/mcp-servers)
- [Reglas](https://opencode.ai/docs/rules)
