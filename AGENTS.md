# Agents Config

Repositorio centralizado de configuraciones y reglas que unifican cómo se instalan agentes de IA.

## Estructura

```
agents-config/
├── agents/
│   ├── opencode/
│   │   └── opencode.jsonc       # Configuración específica de OpenCode
│   └── rules/
│       └── AGENTS.md            # Reglas globales compartidas
├── src/
│   ├── agents-config.ts         # Registro de agentes y assets
│   ├── file-ops.ts              # Utilidades de paths y symlinks
│   ├── installer.ts             # Script del instalador
│   └── types-def.ts             # Tipos e interfaces TypeScript
├── tests/                       # Tests de instalador y módulos
├── package.json                 # Dependencias de Bun
├── tsconfig.json                # Configuración de TypeScript
├── biome.json                   # Configuración de Biome (linter/formatter)
└── AGENTS.md                    # Este archivo (reglas para este repo)
```

## Setup de desarrollo

```bash
# Instalar dependencias (requiere Bun)
bun install

# Verificar que todo funciona
bun test
```

## Uso

Ejecutar el instalador:

```bash
bun run setup
```

## Desarrollo

### Tests

Ejecutar los tests:

```bash
bun test
```

### Linting y Formato

Verificar código con Biome:

```bash
# Lint
bun run lint

# Formatear (si es necesario)
bun run format

# Lint + format check combinados
bun run check

# Verificar tipos TypeScript
bun run typecheck
```

### Modificaciones comunes

| Tarea                                | Archivos clave                              |
| ------------------------------------ | ------------------------------------------- |
| Ajustar la configuración de OpenCode | `agents/opencode/opencode.jsonc`            |
| Actualizar reglas compartidas        | `agents/rules/AGENTS.md`                    |
| Registrar nuevos agentes o assets    | `src/agents-config.ts` y `src/installer.ts` |
| Modificar lógica de instalación      | `src/file-ops.ts` e `src/installer.ts`      |

## Flujo de trabajo

1. Revisa la documentación relevante antes de tocar configuraciones.
2. Modifica los archivos adecuados según la tarea.
3. Ejecuta `bun test` para validar cambios.
4. Ejecuta `bun run check` para verificar formato y lint.

## Stack Técnico

- **Runtime:** Bun
- **Lenguaje:** TypeScript
- **Linter/Formatter:** Biome
- **Tests:** bun:test

## Documentación

Siempre consulta la documentación oficial antes de hacer cambios:

**OpenCode**

- [Configuración](https://opencode.ai/docs/config)
- [MCP Servers](https://opencode.ai/docs/mcp-servers)
- [Reglas](https://opencode.ai/docs/rules)
- [Comandos](https://opencode.ai/docs/commands)
