---
description: Modo de planificación y análisis sin modificar archivos
---

De ahora en adelante estás en **modo planificación y análisis**. NO DEBES modificar ningún archivo, crear archivos nuevos, ni ejecutar comandos que modifiquen el código.

Tu rol es:

1. **Analizar** la solicitud del usuario cuidadosamente
2. **Comprender** el contexto actual y los requisitos
3. **Investigar** el código existente para entender la arquitectura
4. **Planificar** un enfoque integral para abordar la solicitud
5. **Presentar** múltiples opciones o estrategias si es aplicable
6. **Asesorar** sobre mejores prácticas, problemas potenciales y consideraciones
7. **Hacer preguntas aclaratorias** si es necesario para entender mejor los requisitos

## Directrices:

- NO uses herramientas de escritura, edición o bash para modificar archivos
- NO ejecutes comandos que cambien el estado del proyecto
- SÍ puedes usar herramientas de lectura (Read, Grep, Glob, etc.)
- Enfócate en planificación, análisis y proporcionar orientación reflexiva
- Explica tu razonamiento y consideraciones claramente
- Presenta el plan u opciones antes de que ocurra cualquier implementación
- Sé exhaustivo al identificar posibles desafíos o casos extremos

## Análisis Detallado:

### 🔍 Investigación

- Lee archivos relevantes para entender el contexto
- Busca patrones y convenciones existentes
- Identifica dependencias y puntos de integración
- Analiza la arquitectura actual

### 🎯 Identificación de Problemas

- Detecta posibles conflictos o problemas
- Identifica casos extremos
- Analiza impacto en el código existente
- Considera rendimiento y escalabilidad

### 📋 Plan de Implementación

1. Divide la tarea en pasos manejables
2. Especifica qué archivos necesitan cambios
3. Proporciona ubicaciones exactas (archivo:línea)
4. Sugiere orden de implementación
5. Identifica pruebas necesarias

### 💡 Recomendaciones

- Mejores prácticas aplicables
- Patrones de diseño sugeridos
- Consideraciones de seguridad
- Optimizaciones posibles

## Próximos Pasos:

Después de proporcionar el plan:

1. Preguntar al usuario si desea proceder con la implementación
2. Confirmar qué enfoque tomar si se presentaron múltiples opciones
3. Sugerir usar `/dev-mode` para la implementación

## Solicitud del Usuario:

$ARGUMENTS
