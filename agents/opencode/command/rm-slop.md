---
description: Eliminar código basura generado por IA
---

Revisa los cambios no confirmados y elimina todo el código basura generado por IA.

1. Obtén una lista de los archivos sin confirmar `git status --porcelain`, si no hay cambios termina el proceso.
2. Busca patrones comunes de código basura generado por IA, tales como:

- Comentarios extra que un humano no añadiría o que sean inconsistentes con el resto del archivo
- Validaciones extra o bloques try/catch que sean anormales, especialmente si son llamados por rutas de código confiables o validadas
- Casteos a any para evitar problemas de tipos
- Uso innecesario de emojis
- Cualquier otro estilo que sea inconsistente con el archivo

Al finalizar, reporta un resumen muy conciso de los cambios realizados.
