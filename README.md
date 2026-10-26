# Lapex — maqueta interactiva (Sidebar 07)

**Única variante vigente** aprobada para iteración visual y funcional. No es el código de producción ni implica GO de los hitos de Lapex2.

- **Vista previa canónica:** https://martinebene.github.io/lapexMaqueta/sidebar-07/
- **Entrada alternativa:** https://martinebene.github.io/lapexMaqueta/ (redirecciona a la vista previa)
- **Fuente activa:** rama `prototipo/sidebar-07`.
- **Publicación:** GitHub Actions `.github/workflows/sidebar-07.yml` compila, prueba y publica exclusivamente `/sidebar-07/` en `main`.
- **Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui (Base UI, estilo Nova), Lucide y react-i18next.
- **Tests:** `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm test:e2e`.

## Reglas y fuentes

Seguir [CRITERIOS-DISENO-FRONTEND.md](docs/CRITERIOS-DISENO-FRONTEND.md): preferir (1) componentes oficiales sin modificar; (2) composición de oficiales; (3) tema Nova y variables globales; (4) personalización propia solo por necesidad funcional justificada, documentada y probada.

**Referencias concretas aprobadas para explorar:**
- shadcn/ui: https://ui.shadcn.com/blocks#login-03 y https://ui.shadcn.com/blocks/sidebar#sidebar-07
- Shadcn Table: https://www.shadcn-table.com/docs/examples/editing-crud-inline-row
- https://www.shadcn-table.com/docs/examples/custom-filter-ui
- https://www.shadcn-table.com/docs/examples/customized-grouping
- https://www.shadcn-table.com/docs/examples/detail-panel

Shadcn Table es una implementación de terceros: evaluar adopción y compatibilidad antes de reconstruir manualmente ejemplos. Las tablas actuales usan `src/DataGrid.tsx` (implementación compositiva propia); eso no autoriza ampliar código propio sin analizar alternativas.

**Documentación normativa del producto:** https://github.com/martinebene/Lapex2, comenzando por `AGENTS.md`, especificaciones y decisiones vigentes. La maqueta emplea datos sintéticos; no sustituye requisitos aprobados ni constituye autorización de implementación. Las definiciones aún abiertas para H2 figuran en P-09 y D-066.

## Conservación de una única variante

La HTML inicial y React Nova se retiraron de la publicación activa y de los flujos de trabajo. El historial de Git conserva los commits anteriores sin mantener una segunda aplicación visible.
