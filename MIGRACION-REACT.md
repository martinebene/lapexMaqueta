# Migración de maqueta a React + shadcn/ui (prototipo independiente)

**Estado:** preparación / decisiones visuales en revisión, no implementación H1 de Lapex2.

## Fuente de referencia
- Maqueta existente: `index.html` de `main` en SHA `e8be767b2731849ca94e47043dd6ae1ed5aa1361`.
- La disposición navegable y los comportamientos actuales del prototipo son la referencia de migración. **No** se toman como aprobación normativa de producto ni se actualiza Lapex2 en esta tarea.
- Publicación vigente del prototipo HTML: https://martinebene.github.io/lapexMaqueta/
- Conservar esa publicación hasta verificar la versión migrada y obtener revisión humana.

## Stack de destino
- React 19, TypeScript estricto, Vite, Tailwind CSS, shadcn/ui con componentes reales (no réplicas).
- Seleccionar una sola base de primitivas entre Base UI (predeterminada de shadcn/ui desde julio 2026) y Radix, preferentemente Base UI si no aparece incompatibilidad.
- Simulación local de datos y estados, sin backend, autenticación, pagos, IA ni persistencia de producción.
- Catalogación de textos propios en español con `react-i18next` desde la primera pantalla migrada, por compatibilidad con el stack aprobado de Lapex2.
- Iconos de Lucide; gráficos de muestra sin decidir el motor gráfico real de telemetría.
- `pnpm-lock.yaml` versionado y `pnpm install --frozen-lockfile` para reproducibilidad.
- Vite con `base: '/lapexMaqueta/'` al publicar en Pages. Compilación/verificación previa a reemplazar `main` y el sitio.

## Estilo visual a resolver antes de instalar componentes
La dirección SaaS híbrida (barra lateral azul marino oscuro + lienzo claro + acento turquesa) ya es la referencia actual.
La familia específica shadcn/ui todavía debe validarse visualmente con el director:
- candidata: **Nova** (compacta y legible para formularios, bibliotecas y dashboards)
- alternativa: **Vega** (clásica, menos densa)
- alternativa: **Mira** (mayor densidad, útil para grids técnicos)
- base neutral/Zinc; contraste de sidebar independiente; radios discretos; fuente Inter/Geist, íconos Lucide.
- usar shadcn/create para producir preset, archivar sus parámetros, sin inventar un identificador de preset.

Galerías: https://ui.shadcn.com/create · https://ui.shadcn.com/docs/components · https://ui.shadcn.com/blocks/sidebar · https://ui.shadcn.com/blocks

## Inventario a migrar desde index.html actual
1. Shell completo sin cabecera superior, logo y cuatro botones (Análisis, Recursos, Datos, Configuración).
2. Análisis sin sesión: nueva sesión, lista compacta de registros con scroll vertical y abrir sesión.
3. Nueva sesión: siete bloques (nombre, piloto, circuito, vehículo, datos objetivos, datos de referencia, módulos); validación antes de crear.
4. Análisis con sesión: Fuentes de datos, Contexto, Módulos de análisis.
5. Módulos: superficie superior con visualización y selectores, chat contextual inferior simulado.
6. Recursos: bibliotecas de pilotos, circuitos, vehículos y módulos; rutas/breadcrumbs; edición de metadatos simulada.
7. Datos: biblioteca filtrable con estadísticas, importación inicial, detalles y acciones simuladas.
8. Pie de barra lateral: cuenta Free/Pro y popover de usuario.
9. Adaptación móvil y accesibilidad; estados vacíos, errores y selección.

## Límites / aceptación antes de sustituir la versión publicada
- No modificar `index.html` ni el origen de Pages en `main` hasta que haya build y revisión humana de la nueva versión.
- La migración **no cambia reglas funcionales aprobadas** ni altera documentación/roadmap de Lapex2.
- No declarar paridad funcional por mera similitud de capturas: verificar recorridos humanos.
- La selección final de preset/familia visual precede la generación de los componentes.
