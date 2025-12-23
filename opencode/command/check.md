---
description: Quality gate y detección de slop en cambios locales
---

Archivos con cambios sin confirmar:

!`git status --porcelain`

Si no hay cambios, informa "Sin cambios pendientes" y termina.

## Fases (en paralelo)

1. **Quality Gate** - Errores técnicos
2. **Slop Detection** - Código basura de IA

## Proceso

### 1. Análisis en Paralelo

Ejecutar simultáneamente y registrar hallazgos en TodoWrite:

**Quality Gate:**

- Typecheck
- Lint
- Tests

**Slop Detection:**

- Comentarios redundantes
- Validaciones excesivas
- Casteos a `any`
- Emojis
- Inconsistencias de estilo

### 2. Reporte Detallado

Presentar hallazgos consolidados:

```
## Hallazgos

### Quality Gate

**Typecheck**
- `src/file.ts:12` - Property 'x' does not exist on type 'Y'

**Lint**
- `src/file.ts:8` - Unexpected console statement

**Tests**
✅ Pasando

### Slop Detection

**src/installer.ts**
- Línea 23: Comentario redundante "// Get the user"
- Línea 45: Casteo innecesario a `any`

**src/file-ops.ts**
✅ Sin problemas
```

### 3. Confirmación

```
¿Procedo con las correcciones? (sí/no)
```

### 4. Corrección Iterativa

Si el usuario confirma:

1. Crear TodoWrite con cada hallazgo
2. Priorizar: tipos > lint > slop > tests
3. Corregir uno a la vez
4. Re-ejecutar ambas fases
5. Repetir hasta cero hallazgos

## Criterios de Slop Detection

**Eliminar si:**

- El comentario describe lo que el código ya dice
- La validación duplica el sistema de tipos
- El casteo a `any` existe solo para silenciar errores

**Preservar si:**

- El comentario explica el "por qué", no el "qué"
- La validación protege contra input externo (APIs, usuarios)
- El casteo es necesario por limitaciones de librerías externas

## Ejemplos de Slop

### Comentario redundante

```typescript
// ❌ Describe lo obvio
// Function to get the current user
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}

// ✅ Sin comentario innecesario
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}
```

### Validación excesiva

```typescript
// ❌ Redundante cuando el tipo ya garantiza existencia
function processUser(user: User) {
  if (!user) throw new Error("User is required");
  if (!user.id) throw new Error("User ID is required");
  // ...
}

// ✅ Confía en el sistema de tipos
function processUser(user: User) {
  // ...
}
```

### Casteo a any

```typescript
// ❌ Casteo para silenciar el compilador
const data = response.body as any;
const name = data.user.name;

// ✅ Tipo explícito
interface ApiResponse {
  user: { name: string };
}
const data: ApiResponse = response.body;
const name = data.user.name;
```

## Reglas

**Failure modes:**

- Corregir sin reportar → usuario pierde visibilidad
- Corregir múltiples errores antes de re-validar → riesgo de nuevos errores

**Obligatorio:**

- SIEMPRE reportar hallazgos ANTES de corregir
- SIEMPRE esperar confirmación del usuario
- NUNCA eliminar código funcional solo por "parecer IA"
- PRESERVAR el estilo existente del archivo
- Reportar AMBAS fases aunque solo una tenga hallazgos
- Priorizar quality gate sobre code review en conflictos
