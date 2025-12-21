---
description: Ejecutar quality gate en cambios locales
---

Archivos con cambios sin confirmar:

!`git status --porcelain`

Si no hay cambios, informa "Sin cambios pendientes" y termina.

Ejecuta lint, typecheck y tests sobre los archivos modificados.

## Proceso

1. Ejecuta en paralelo: lint, typecheck, tests.
2. Si todo pasa, reporta y termina.
3. Si hay fallos:
   - Crea un TodoWrite con cada error
   - Prioriza: errores de tipos > lint > tests
   - Corrige uno a la vez
   - Re-ejecuta el quality gate
   - MÁXIMO 3 iteraciones

## Reglas

- DEBES usar TodoWrite para trackear cada error
- NUNCA corrijas más de un error antes de re-ejecutar
- DEBES detenerte después de 3 iteraciones fallidas

## Escalación

Si después de 3 iteraciones persisten errores, DETENTE y presenta:

```
## Quality Gate Fallido

**Errores restantes:** [lista]
**Intentos realizados:** [resumen]
**Solicitud:** ¿Cómo proceder?
```

## Ejemplo de flujo

```
Iteración 1:
- Ejecuto quality gate
- 3 errores de tipos, 1 de lint
- Creo TodoWrite con 4 items
- Corrijo primer error de tipos
- Marco todo como completado

Iteración 2:
- Re-ejecuto quality gate
- 2 errores de tipos, 1 de lint
- Corrijo siguiente error de tipos
...

Iteración 3 (si persisten errores):
- Presento resumen y solicito dirección
```
