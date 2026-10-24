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

## Estilo visual aprobado
**Nova**, confirmado por el director en ChatGPT Web, 2026-10-24. Base UI, Tailwind CSS, Inter, Lucide y temática de Lapex: barra lateral azul petróleo oscuro, lienzo claro, acento turquesa; densidad compacta, bordes moderados. `components.json` identifica `base-nova`, y `src/index.css` incorpora las reglas oficiales Nova pertinentes a los componentes instalados. No es un preset exportado de shadcn/create.

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

## Migración ejecutada en rama (2026-10-24)
- `src/App.tsx`: shell lateral, navegación contextual, creación de sesiones, fuentes, módulos con chat ilustrativo, recursos, datos, importación, cuenta/menú e indicadores simulados.
- Componentes oficiales `button, card, checkbox, input, label, table` desde el registro Base UI de shadcn/ui. Estilos Nova a partir de su CSS oficial, ajustados a la paleta de Lapex.
- `src/i18n/es.json` y react-i18next: catálogo de interfaz español. Quedan pendientes auditoría exhaustiva de textos del catálogo y paridad visual humana.
- `pnpm-lock.yaml` generado y versionado mediante la Action en la rama de prueba.
- Compilación TypeScript/Vite y dos pruebas Playwright exitosas (creación de sesión con selección de datos/módulo y consulta filtrada de biblioteca) en [Actions run #40133458742](https://github.com/martinebene/lapexMaqueta/actions/runs/40133458742).
- Archivo compilado disponible como artefacto `lapex-nova-preview` de esa ejecución. No es todavía una página publicada.
- No se cambió `main`, el origen de GitHub Pages ni repositorios documentales/de producto de Lapex2.
- Próxima revisión: abrir el frontend en navegador, evaluar fidelidad visual/funcional y decidir publicación paralela en ruta propia (sin reemplazar la HTML vigente), antes de promover cambios.
