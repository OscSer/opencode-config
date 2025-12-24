---
description: Genera un conventional commit
agent: general
---

Diff de los cambios staged:

!`git diff --cached`

Commits recientes:

!`git log --oneline -5`

Analizar los cambios y generar un mensaje de commit siguiendo el formato **Conventional Commits**:

**Formato del mensaje:**

```
<type>[optional scope]: <description>
```

**Tipos de commits (seleccionar el más apropiado):**

- `feat`: Nueva funcionalidad o característica
- `fix`: Corrección de un bug
- `refactor`: Cambios de código sin agregar funcionalidad ni corregir bugs
- `docs`: Cambios en documentación únicamente
- `style`: Cambios de formato, espacios, sin impacto funcional
- `test`: Agregar o modificar tests
- `ci`: Cambios en CI/CD
- `build`: Cambios en sistema de build o dependencias
- `chore`: Tareas de mantenimiento, configuración
- `perf`: Mejoras de performance

**Reglas para el mensaje:**

- Usar **minúsculas** para el tipo
- El scope es opcional: identificar el modulo/libreria afectada (ej: `auth`, `products-api`, `db`, `ui`)
- La descripción debe ser **concisa**, en **imperativo** (ej: "add" no "added")
- **SOLO una línea** — NUNCA incluir body ni footer
- El mensaje DEBE estar en **inglés** (estándar de la industria)
- SOLO ejecutar `git commit`, **NUNCA** ejecutar `git push`

Si el usuario proporcionó argumentos ($ARGUMENTS), usar esa información para guiar el análisis:

- Ej: `/commit refactor de autenticación` → priorizar `refactor(auth):`
- Ej: `/commit fix en utilidades` → priorizar `fix(utils):`

Generar el mensaje basado en el análisis del diff.

Ejecutar el commit con el mensaje generado.

Si el commit **falla por algun motivo**, explica el error de forma clara

Si el commit es **exitoso**, informa:

```
Commit exitoso: <hash corto> - <mensaje>
```
