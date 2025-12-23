# OpenCode Config

Configuración centralizada para OpenCode con estructura simplificada.

## Estructura

```
opencode-config/
├── opencode/
│   ├── opencode.jsonc              # Configuración principal de OpenCode
│   ├── AGENTS.md                   # Reglas globales para OpenCode
│   ├── command/                    # Comandos personalizados
│   └── skill/                      # Skills personalizados
├── src/
│   ├── installer.ts                # Instalador con detección automática
│   ├── installer.test.ts           # Tests del instalador
│   ├── file-ops.ts                 # Utilidades de paths y symlinks
│   ├── file-ops.test.ts            # Tests de operaciones de archivos
│   └── types-def.ts                # Tipos e interfaces TypeScript
├── .husky/
│   └── pre-commit
├── package.json                    # Dependencias de Bun
├── tsconfig.json                   # Configuración de TypeScript
├── biome.json                      # Configuración de Biome (linter/formatter)
├── .gitignore
└── AGENTS.md                       # Este archivo (documentación del repo)
```

## Script de Instalación

Ejecutar el instalador:

```bash
bun run setup
```

El instalador detecta automáticamente todos los archivos y directorios en `opencode/` y los vincula a `~/.config/opencode/`.

## Desarrollo

### Quality Gate

```bash
bun run check
bun run typecheck
bun test
```

### Modificaciones comunes

| Tarea                                | Archivos clave            | Pasos adicionales |
| ------------------------------------ | ------------------------- | ----------------- |
| Ajustar la configuración de OpenCode | `opencode/opencode.jsonc` | -                 |
| Actualizar reglas globales           | `opencode/AGENTS.md`      | -                 |
| Agregar nuevos comandos              | `opencode/command/`       | -                 |
| Agregar nuevas skills                | `opencode/skill/`         | -                 |
| Modificar lógica de instalación      | `src/installer.ts`        | -                 |

## Extensibilidad

El instalador utiliza **detección automática** de assets. Al agregar nuevos directorios o archivos en `opencode/`:

1. El instalador los detectará automáticamente
2. Se crearán symlinks en `~/.config/opencode/` con el mismo nombre
3. No es necesario modificar código del instalador

Ejemplo: Si agregas `opencode/skill/`, el instalador automáticamente lo enlazará a `~/.config/opencode/skill/`.

## Stack Técnico

- **Runtime:** Bun
- **Lenguaje:** TypeScript
- **Linter/Formatter:** Biome

## Documentación

Consulta la documentación oficial de OpenCode: https://opencode.ai/docs
