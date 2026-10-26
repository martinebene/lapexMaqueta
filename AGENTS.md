# AGENTS.md — Maqueta Lapex

Instrucciones vigentes para todo el repositorio `martinebene/lapexMaqueta`.

## Autoridad y límites

Leer primero `AGENTS.md` y documentación funcional aprobada de [Lapex2](https://github.com/martinebene/Lapex2), luego [criterios de frontend](docs/CRITERIOS-DISENO-FRONTEND.md). No deducir contratos de negocio de datos sintéticos.

Sólo existe una maqueta vigente: rama `prototipo/sidebar-07`, publicada en https://martinebene.github.io/lapexMaqueta/maqueta/ mediante GitHub Actions. No restaurar ni crear versiones paralelas. Modificaciones de interfaz y publicación deben corresponder a un alcance aprobado por el director.

## Skills de diseño disponibles en el repositorio

- **Toda modificación de UI:** consultar [skill oficial shadcn](.agents/skills/shadcn/SKILL.md) y las referencias relacionadas, comprobar `components.json` (`base-nova`, Base UI, Vite, Tailwind 4, Lucide) y preferir componentes oficiales antes que composición o CSS propios.
- **Toda decisión o modificación sobre grillas:** consultar [skill oficial Shadcn Table](.agents/skills/shadcn-table/SKILL.md) y documentación API. Usar exclusivamente edición Base UI. El spike de [2026-10-26](https://github.com/martinebene/lapexMaqueta/actions/runs/40359545445) verificó filtros, agrupación y radio, no toda la paridad.
- **ChatGPT Web:** leer estas skills mediante GitHub; su presencia en el repositorio no las registra como herramientas nativas de ChatGPT. Agentes de código compatibles sí pueden descubrirlas en `.agents/skills/`. Context7 puede complementar documentación actual cuando esté disponible.

## Decisión sobre DataGrid

Shadcn Table es **preferente para tablas avanzadas**, pero `src/DataGrid.tsx` continúa activo hasta superar una migración completa y la revisión visual, según [criterios](docs/CRITERIOS-DISENO-FRONTEND.md#decisión-de-tablas-avanzadas--2026-10-26). No instalar automáticamente todo el registro ni sobrescribir con `--overwrite` componentes shadcn compartidos: primero consultar `--dry-run` y `--diff`. No crear una segunda maqueta.

## Verificación

Para cambios de código: `pnpm build`, `pnpm test:e2e`, pruebas específicas de selección, filtros, agrupación, edición y detalle, y revisión del preview. No afirmar pruebas visuales no ejecutadas.

## Proveniencia de las skills

- shadcn/ui: `shadcn-ui/ui`, commit `8f04138777c1b6996e709993362a7b0a12888ecf`, ruta `skills/shadcn/`.
- Shadcn Table: `anindosarker/shadcn-table`, commit `1d2b840770035bef6ddd5f7044ae86a0f6167482`, ruta `skills/shadcn-table/`.
- Se conservaron sus licencias MIT. No actualizar estas instantáneas sin revisión del diff upstream.
