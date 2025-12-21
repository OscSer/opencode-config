# Agents Config

Repositorio configuraciones y reglas centralizadas para agentes de IA.

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

## Script de Instalación

Ejecutar el instalador:

```bash
bun run setup
```

## Desarrollo

### Quality Gate

```bash
bun run lint
bun run format
bun run check
bun run typecheck
bun test
```

### Modificaciones comunes

| Tarea                                | Archivos clave                              |
| ------------------------------------ | ------------------------------------------- |
| Ajustar la configuración de OpenCode | `agents/opencode/opencode.jsonc`            |
| Actualizar reglas compartidas        | `agents/rules/AGENTS.md`                    |
| Registrar nuevos agentes o assets    | `src/agents-config.ts` y `src/installer.ts` |
| Modificar lógica de instalación      | `src/file-ops.ts` e `src/installer.ts`      |

## Stack Técnico

- **Runtime:** Bun
- **Lenguaje:** TypeScript
- **Linter/Formatter:** Biome

## Documentación

Siempre consulta la documentación oficial antes de hacer cambios:

- OpenCode: https://opencode.ai/docs
