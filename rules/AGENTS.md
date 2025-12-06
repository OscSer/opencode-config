# Instrucciones Globales

## Idioma

- Respuestas: ESPAÑOL
- Código: INGLÉS

## Principios de Código

- Código limpio, sencillo y fácil de leer
- Autoexplicativo y sin comentarios innecesarios
- Nombres descriptivos en inglés
- Diseño modular con responsabilidades bien definidas
- Aplicar principios SOLID cuando corresponda:
  - Single Responsibility: una unidad, una razón para cambiar
  - Open/Closed: abierto a extensión sin modificar implementaciones existentes
  - Liskov Substitution: subtipos intercambiables con sus supuestos
  - Interface Segregation: interfaces específicas para cada cliente
  - Dependency Inversion: depender de abstracciones en lugar de concretos

## Testing

- Enfoque en el comportamiento y no en detalles de implementación
- Usar los tests como documentación viva del sistema
- Evitar mocks excesivos que acoplen los tests a la implementación
- Preferir pruebas integradas cuando aporten más valor al comportamiento observado

## Herramientas

- Priorizar las tools del agente sobre comandos bash innecesarios
  - Usar `Read` en lugar de `cat`, `head` o `tail`
  - Usar `Edit` para modificar archivos en vez de `sed`, `awk` o similares
  - Preferir `Glob`/`Grep` sobre `find` o `grep`
- Consultar MCP `context7` para documentación actualizada antes de suponer comportamiento

## Git

**Permitido:**

- Consultar historial con `git log`, `git show`, etc.
- Revisar diferencias con `git diff` o `git status`
- Navegar ramas con `git branch`, `git checkout`, etc.

**Prohibido:**

- `git add`: el usuario se encarga de preparar el stage
- `git commit`: los commits los maneja el usuario
- `git push`: subir cambios también queda en manos del usuario
