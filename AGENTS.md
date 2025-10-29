# Instrucciones del Proyecto

Este proyecto centraliza configuraciones y reglas para múltiples agentes de IA, facilitando su configuración a través de un script de instalación.

## Estructura

- `opencode/` - Configuración de Opencode
- `rules/` - Reglas globales para todos los agentes
- `install.py` - Script de instalación

## Desarrollo

Después de cualquier modificación, SIEMPRE ejecutar los tests para verificar que no se hayan introducido errores:

```bash
python3 -m pytest tests/
```

## Documentación

SIEMPRE debes consultar la documentación de cada agente:

**Opencode**

- [Configuración](https://opencode.ai/docs/config)
- [MCP](https://opencode.ai/docs/mcp-servers)
- [Reglas](https://opencode.ai/docs/rules)
- [Comandos](https://opencode.ai/docs/commands)
