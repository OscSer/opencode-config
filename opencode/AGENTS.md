# Instrucciones Globales

Estas son tus instrucciones globales. DEBES seguirlas estrictamente en todo momento. No son negociables.

## Reglas No Negociables

- SIEMPRE comunícate en **ESPAÑOL**
- SIEMPRE escribe código en **INGLÉS** (nombres de variables, funciones, clases)
- NUNCA hagas `git add` ni `git push`. El usuario controla el historial de git
- Solo ejecuta `git commit` cuando el usuario lo solicite explícitamente (ej: comando `/commit`)
- NUNCA ignores estas reglas, sin excepciones

## Flujo de Trabajo

### Planificación

DEBES usar `TodoWrite` y `TodoRead` para cualquier trabajo que requiera más de 3 pasos. Esto te ayuda a:

- Organizar el trabajo antes de comenzar
- Dar visibilidad del progreso
- No olvidar pasos importantes

Marca cada tarea como completada INMEDIATAMENTE después de terminarla. No acumules tareas completadas.

### Investigar Antes de Cambiar

ANTES de modificar código existente:

1. Entiende el contexto y el propósito del código actual
2. Identifica dependencias y posibles efectos secundarios
3. Verifica si existen patrones similares en el proyecto

### Quality Gate

INMEDIATAMENTE después de hacer cambios, ejecuta las validaciones del proyecto:

- Tests
- Linter
- Verificación de tipos
- Cualquier otra validación configurada

No propongas cambios que rompan el quality gate.

### Cambios Incrementales

- Un commit = un cambio lógico
- Cambios pequeños y atómicos
- Fáciles de revisar y revertir

### Verificación Final

ANTES de considerar una tarea completada, verifica:

- El código cumple los principios de esta guía
- El quality gate pasa correctamente
- No hay código muerto o comentado

## Herramientas

Tienes acceso a herramientas especializadas. Usa la correcta según el contexto

### MCP

| MCP   | Cuándo usarla                                                                    |
| ----- | -------------------------------------------------------------------------------- |
| `ref` | Documentación de APIs y librerías. Consultar docs oficiales antes de implementar |

### Skills

| Skill                    | Cuándo usarla                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `testing-best-practices` | Use for testing, test cases, test quality, or flaky tests                             |
| `systematic-debugging`   | Use for bugs, failures, or unexpected behavior                                        |
| `prompt-engineering`     | Use for prompts, LLM interactions including AGENTS.md, commands, skills, or subagents |

### Preferencias de Tools

Prefiere las herramientas nativas de OpenCode sobre comandos de terminal equivalentes:

| Preferir       | En lugar de        | Razón                                                  |
| -------------- | ------------------ | ------------------------------------------------------ |
| `Grep` (tool)  | `grep`,`rg` (bash) | Mejor integración, resultados estructurados            |
| `Glob` (tool)  | `find` (bash)      | Búsqueda de archivos más eficiente                     |
| `Read` (tool)  | `cat` (bash)       | Lectura optimizada con contexto y numeración de líneas |
| `Write` (tool) | `echo` (bash)      | Escritura controlada sin efectos secundarios           |
| `Edit` (tool)  | `sed/awk` (bash)   | Edición precisa y confiable                            |

## Principios de Código

El código debe ser **claro**, **legible** y **modular**. Debe explicarse por sí mismo sin necesidad de comentarios.

### Early Return y Guard Clauses

Maneja casos excepcionales al inicio. Evita anidación excesiva.

```typescript
// MAL: anidación excesiva, difícil de seguir
function processOrder(order: Order | null) {
  if (order) {
    if (order.isValid) {
      if (order.hasItems) {
        return calculateTotal(order);
      }
    }
  }
  return null;
}

// BIEN: guard clauses, flujo claro
function processOrder(order: Order | null) {
  if (!order) return null;
  if (!order.isValid) return null;
  if (!order.hasItems) return null;

  return calculateTotal(order);
}
```

### Nombres Descriptivos

Los nombres deben revelar intención. Si necesitas un comentario para explicar qué hace una variable, el nombre es malo.

```typescript
// MAL: nombres crípticos
const d = Date.now() - s;
const arr = data.filter((x) => x.a > 10);
const flag = user.role === "admin";

// BIEN: nombres que revelan intención
const elapsedMs = Date.now() - startTime;
const highValueItems = data.filter((item) => item.amount > THRESHOLD);
const isAdmin = user.role === "admin";
```

### Funciones Pequeñas y Enfocadas

Una función = una responsabilidad. Si puedes describir lo que hace usando "y", probablemente hace demasiado.

```typescript
// MAL: función que hace múltiples cosas
function handleUserRegistration(userData: UserInput) {
  // valida datos
  // hashea password
  // guarda en base de datos
  // envía email de bienvenida
  // registra analytics
  // ...100 líneas más
}

// BIEN: composición de funciones pequeñas
function handleUserRegistration(userData: UserInput) {
  const validatedData = validateUserData(userData);
  const user = createUser(validatedData);
  await saveUser(user);
  await sendWelcomeEmail(user);
  trackRegistration(user);
}
```

### Evitar Else Innecesario

Si el bloque `if` termina con `return`, el `else` es redundante.

```typescript
// MAL: else innecesario
function getDiscount(user: User) {
  if (user.isPremium) {
    return 0.2;
  } else {
    return 0;
  }
}

// BIEN: sin else redundante
function getDiscount(user: User) {
  if (user.isPremium) {
    return 0.2;
  }
  return 0;
}
```

### Preferir Inmutabilidad

Evita mutar datos. Crea nuevas estructuras en lugar de modificar las existentes.

```typescript
// MAL: mutación de datos
function addItem(cart: Cart, item: Item) {
  cart.items.push(item);
  cart.total += item.price;
  return cart;
}

// BIEN: inmutabilidad
function addItem(cart: Cart, item: Item): Cart {
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + item.price,
  };
}
```

### Evitar Comentarios Obvios

El código debe ser autoexplicativo. Los comentarios deben explicar el "por qué", no el "qué".

```typescript
// MAL: comentarios que describen lo obvio
// Incrementa el contador
counter++;
// Obtiene el usuario por ID
const user = getUserById(id);

// BIEN: comentario que explica el por qué (cuando es necesario)
// Rate limiting: máximo 100 requests por minuto según política de la API
const delay = calculateBackoff(requestCount);
```

### Constantes con Nombre

Evita números y strings mágicos. Usa constantes con nombres descriptivos.

```typescript
// MAL: números mágicos
if (password.length < 8) { ... }
if (retryCount > 3) { ... }
setTimeout(fn, 86400000)

// BIEN: constantes con nombre
const MIN_PASSWORD_LENGTH = 8
const MAX_RETRY_ATTEMPTS = 3
const ONE_DAY_MS = 24 * 60 * 60 * 1000

if (password.length < MIN_PASSWORD_LENGTH) { ... }
if (retryCount > MAX_RETRY_ATTEMPTS) { ... }
setTimeout(fn, ONE_DAY_MS)
```

## Formato de Respuestas

### Referencias a Código

Cuando menciones código específico, incluye la ubicación para facilitar la navegación:

```
La función `validateUser` en `src/services/auth.ts:45` maneja la validación.
```

### Estructura

- Respuestas concisas y al punto
- Usa markdown para formatear (headers, listas, código)
- Prioriza la información más relevante primero
