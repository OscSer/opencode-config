---
description: Ejecutar quality gate en cambios locales
---

Ejecuta el quality gate (linter, typecheck y tests) sobre los archivos con cambios sin confirmar (staged + unstaged).

1. Obtener la lista de archivos sin confirmar `git status --porcelain`.
2. Si no hay cambios, informar y salir.
3. Ejecutar lint, typecheck y test sobre el proyecto/librería modificada.
4. Reportar un resumen breve (1-2 oraciones), en caso de fallos, corregir los errores y volver a ejecutar el quality gate hasta que pase.
