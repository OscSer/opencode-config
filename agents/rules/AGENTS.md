# Instrucciones Globales

SIEMPRE sigue estas reglas al escribir código en cualquier proyecto.

## Principios

- El Código siempre debe estar en inglés
- Código limpio, sencillo, fácil de leer, nombres descriptivos
- Autoexplicativo y sin comentarios
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

- Usa siempre las tools nativas; evita equivalentes en bash.
  - `Read` para inspeccionar archivos, nunca `cat`/`head`/`tail`.
  - `Edit`/`Write` para modificar archivos, no `sed`/`awk`/`echo`.
  - `Glob`/`Grep`/`List` para buscar y listar, no `find`/`grep`/`ls`.
  - `Webfetch` para URLs, no `curl`/`wget`.
- Consulta MCP `context7` para documentación actualizada de cualquier librería o herramienta.
