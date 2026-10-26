# Criterios de diseño de frontend — maqueta Lapex

**Estado:** criterio aprobado por el director para las próximas iteraciones de la maqueta.  
**Fecha:** 2026-10-24.  
**Alcance:** `martinebene/lapexMaqueta`, versión de trabajo `prototipo/sidebar-07`.  
**Transferencia a Lapex2:** pendiente de reconciliación con la documentación y el roadmap del producto. Este documento **no** modifica ni aprueba requisitos funcionales o hitos de Lapex2.

## Objetivo

Utilizar los componentes establecidos del frontend definitivo para que la maqueta sea consistente, mantenible y fácil de evolucionar por agentes. Se prioriza compatibilidad, accesibilidad y previsibilidad por encima de preferencias visuales particulares.

## Orden obligatorio de preferencia para implementar la interfaz

1. **Componente oficial de shadcn/ui sin modificar.** Utilizar sus propiedades, estados, tamaños y variantes documentadas. No alterar el código interno del componente si ofrece el comportamiento necesario.
2. **Composición de componentes oficiales.** Construir la interfaz combinando componentes existentes (por ejemplo `Card` + `Table` + `Pagination`, o `Data Table` + `Checkbox`) antes de fabricar uno propio. Conservar las responsabilidades de cada componente.
3. **Personalización compartida mediante el tema visual.** Priorizar el estilo **Nova**, las variables semánticas, tipografía, colores, espaciados y radios de borde definidos globalmente. Evitar ajustes CSS específicos de pantalla o sobrescrituras de clases internas cuando el tema o una variante resuelven el caso.
4. **Comportamiento o presentación propios, solo por necesidad funcional justificada.** Si ninguna opción anterior satisface un requisito necesario, admitir personalización mínima y localizada; documentar qué problema resuelve, por qué no alcanza lo oficial, cómo probarla y qué riesgo de mantenimiento supone. No crear excepciones por gusto estético únicamente.

## Reglas de aplicación

- **Stack de referencia:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui sobre Base UI, estilo Nova, Lucide y la paleta Lapex aprobada.
- Utilizar siempre que sea posible las variantes **oficiales y documentadas**. Una galería o bloque de terceros es referencia visual, **no** una variante oficial ni garantía de compatibilidad.
- `Table` es una tabla básica. `Data Table` es un patrón de composición con TanStack Table para selección, filtros, ordenamiento y paginación; no implica que todas esas funciones sean simples propiedades de `Table`.
- Para registros extensos, evaluar primero filtros y paginación documentados antes de forzar scroll interno. Si un listado requiere scroll, preferir composición con `Scroll Area` y conservar una cabecera clara; cualquier solución especial debe justificarse conforme al punto 4.
- No modificar silenciosamente componentes shadcn/ui vendorizados en `src/components/ui/`. Preferir envolverlos/componerlos desde las pantallas. Si una modificación interna fuera inevitable, tratarla como excepción explícita, identificable y probada.
- Mantener coherencia de componentes entre las pantallas (sesiones, nueva sesión, recursos, biblioteca de datos, configuración); evitar estilos divergentes para el mismo patrón.
- Preservar accesibilidad básica (etiquetas, navegación por teclado, foco, contraste) y probar interacciones representativas en navegador, además de compilar TypeScript/Vite.
- Al proponer componentes, indicar su **nombre exacto** y enlazar a la documentación o ejemplo. Distinguir las opciones de configuración soportadas de las personalizaciones que requerirían código adicional.
- La maqueta actual contiene CSS y composiciones previas, especialmente en tablas y scroll. Su presencia **no** constituye una excepción aprobada de manera permanente: se evaluará su sustitución por patrones oficiales al recibir las próximas especificaciones.

## Referencias para elegir componentes

- Catálogo oficial: https://ui.shadcn.com/docs/components
- Table oficial (Base UI): https://ui.shadcn.com/docs/components/base/table
- Data Table (Base UI): https://ui.shadcn.com/docs/components/base/data-table
- Scroll Area (Base UI): https://ui.shadcn.com/docs/components/base/scroll-area
- Bloques y ejemplos: https://ui.shadcn.com/blocks
- Configurador de estilo: https://ui.shadcn.com/create

## Decisión de tablas avanzadas — 2026-10-26

**Shadcn Table (edición Base UI) se adopta como biblioteca preferente** para tablas que requieran selección, filtros, agrupación, edición y panel de detalle, subordinada al criterio de preferir componentes oficiales cuando éstos resuelvan todo el caso sin complejidad adicional.

La [prueba aislada en GitHub Actions](https://github.com/martinebene/lapexMaqueta/actions/runs/40359545445) aprobó instalación, TypeScript/Vite, búsqueda, filtro exacto, agrupación y radio único mediante Playwright. No validó exhaustivamente edición, panel de detalle, todos los filtros combinados ni los flujos completos de Lapex.

**Decisión de integración:** `DataGrid.tsx` sigue vigente hasta una migración controlada que preserve selección única/múltiple, filas no elegibles, filtros simultáneos, búsqueda, agrupaciones, ordenamiento, edición, detalles, acciones, accesibilidad, localización y aspecto Nova. Hacer pruebas Playwright y revisión visual humana antes de sustituirlo. No mantener dos grillas funcionales estables ni publicar una segunda maqueta.

**Riesgo concreto:** el registro del tercero incorporó más de 100 archivos e intentó sobrescribir componentes shadcn existentes en el entorno temporal. Para integrarlo en la rama real, inspeccionar cambios con `--dry-run`/`--diff`, no usar `--overwrite` global sobre componentes existentes sin revisión/autorización específica, y preferir integración selectiva. La decisión de usar la biblioteca no concede por sí misma GO para ejecutar la migración.

**Skills de asistencia:** [shadcn/ui](../.agents/skills/shadcn/SKILL.md) y [Shadcn Table](../.agents/skills/shadcn-table/SKILL.md), copias oficiales versionadas en el repositorio para uso por agentes compatibles o lectura desde ChatGPT Web.

## Estado operativo y mantenimiento

La versión **Maqueta Lapex** es la única maqueta activa. La rama técnica original `prototipo/sidebar-07` se conserva por continuidad histórica; no constituye una variante separada. La publicación está en `/maqueta/` y la URL raíz redirige allí. No generar variantes paralelas sin autorización expresa.

La implementación actual de `src/DataGrid.tsx` es una **composición propia sobre `Table`**, no el paquete de terceros Shadcn Table ni el patrón oficial completo de TanStack Table. Al iterar, evaluar primero reutilizar la implementación documentada más próxima antes de ampliar ese código o sumar CSS particular. No alterar reglas del producto para adecuarlas al prototipo.

La integración de estas pautas en la documentación normativa de Lapex2 sigue pendiente de reconciliación, sin aprobación ni GO automáticos.
