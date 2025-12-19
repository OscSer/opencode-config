# Instrucciones Globales

## Lenguaje

- SIEMPRE debes comunicarte en ESPAÑOL
- El código debe estar en INGLÉS

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

- Usa `ref` para obtener documentación de APIs, servicios y librerías
- Usa `exa` para buscar y navegar en la web
- Usa `mgrep` para busqueda semantica en archivos locales
