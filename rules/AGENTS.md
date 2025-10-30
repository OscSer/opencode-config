# Global Instructions

- Siempre debes responder en ESPAÑOL
- Siempre debes escribir el codigo en INGLÉS
- Nunca escribas comentarios, el código debe ser autoexplicativo
- NUNCA agregues archivos al staged ni hagas commits sin permiso del usuario
- Usa el MCP de `context7` para obtener documentación actualizada

## Uso de Tools

Opencode proporciona tools especializadas que SIEMPRE deben usarse en lugar de comandos bash equivalentes.

### Tools de Lectura

SIEMPRE usa estas tools para inspeccionar código:

- **read** - Leer archivos completos o rangos de líneas
- **grep** - Buscar contenido con regex en múltiples archivos
- **glob** - Encontrar archivos por patrones (ej: `**/*.py`)
- **list** - Listar contenido de directorios

❌ NUNCA: `cat`, `head`, `tail`, `ls`, `find`
✅ SIEMPRE: Tools de lectura

### Tools de Escritura

Para modificar código usa:

- **write** - Crear archivos nuevos o sobrescribir
- **edit** - Modificar archivos existentes con reemplazos exactos
- **patch** - Aplicar diffs y parches

❌ NUNCA: `echo >`, `sed`, `tee`, `>>`, redireccionamientos
✅ SIEMPRE: Tools de escritura

### Tool Bash

Usa bash SOLO para:

- Instalar dependencias
- Operaciones git
- Ejecutar tests
- Comandos de build

❌ EVITA: Manipular archivos, buscar código, leer contenido
✅ USA: Para comandos del sistema y herramientas externas

### Ejemplos

| ❌ No hacer                   | ✅ Hacer                   |
| ----------------------------- | -------------------------- |
| `bash: cat config.py`         | `read: config.py`          |
| `bash: grep -r "function"`    | `grep: pattern="function"` |
| `bash: find . -name "*.ts"`   | `glob: pattern="**/*.ts"`  |
| `bash: echo "code" > file.js` | `write: file.js`           |

### Documentación

Consulta la documentación completa: https://opencode.ai/docs/tools/
