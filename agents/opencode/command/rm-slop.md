---
description: Eliminar código basura generado por IA
---

Revisa los cambios no confirmados y elimina todo el código basura generado por IA. Esto incluye:

- Comentarios extra que un humano no añadiría o que sean inconsistentes con el resto del archivo
- Validaciones defensivas extra o bloques try/catch que sean anormales para esa área del código, especialmente si son llamados por rutas de código confiables o validadas
- Casteos a any para evitar problemas de tipos
- Cualquier otro estilo que sea inconsistente con el archivo
- Uso innecesario de emojis

Al finalizar, reporta solo un resumen de 1-3 oraciones sobre lo que cambiaste
