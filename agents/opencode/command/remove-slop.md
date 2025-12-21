---
description: Eliminar código basura generado por IA
---

Cambios sin confirmar (staged + unstaged):

!`git diff HEAD`

Si no hay cambios, informa "Sin cambios pendientes" y termina.

Revisa los cambios y elimina código basura generado por IA.

## Proceso

1. Crea un TodoWrite con cada archivo a revisar.
2. Para cada archivo, identifica y elimina:
   - Comentarios redundantes o inconsistentes con el estilo del archivo
   - Try/catch o validaciones excesivas en rutas ya validadas
   - Casteos a `any` para evadir el sistema de tipos
   - Emojis innecesarios
   - Cualquier estilo inconsistente con el resto del archivo
3. Marca cada todo como completado al terminar.
4. Reporta UN resumen de una línea por archivo.

## Reglas

- NUNCA elimines código funcional solo por "parecer IA"
- DEBES preservar el estilo existente del archivo
- Si no hay problemas, reporta "Sin cambios necesarios" y termina

## Ejemplos

### Comentarios redundantes

```typescript
// ❌ Mal: comentario obvio que un humano no añadiría
// Function to get the current user from the database
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}

// ✅ Bien: sin comentario innecesario
async function getCurrentUser(id: string) {
  return db.users.findUnique({ where: { id } });
}
```

### Validaciones excesivas

```typescript
// ❌ Mal: validación redundante cuando el caller ya validó
function processUser(user: User) {
  if (!user) {
    throw new Error("User is required");
  }
  if (!user.id) {
    throw new Error("User ID is required");
  }
  // ... lógica
}

// ✅ Bien: confía en el sistema de tipos
function processUser(user: User) {
  // ... lógica
}
```

### Casteos a any

```typescript
// ❌ Mal: casteo para silenciar el compilador
const data = response.body as any;
const name = data.user.name;

// ✅ Bien: tipo explícito o inferido
interface ApiResponse {
  user: { name: string };
}
const data: ApiResponse = response.body;
const name = data.user.name;
```
