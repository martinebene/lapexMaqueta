import { useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { ArrowDownUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from "@/components/ui/shadcn-table"

export interface GridColumn<T> {
  key: string
  title: string
  value: (record: T) => string | number
  render?: (record: T) => ReactNode
  filter?: boolean
  width?: number
}
export interface GridGrouping<T> {
  key: string
  title: string
  value: (record: T) => string
}
interface Props<T extends { id: string }> {
  label: string
  rows: T[]
  columns: GridColumn<T>[]
  selection?: "single" | "multiple"
  selected?: string | string[]
  onSelect?: (id: string, checked: boolean) => void
  disabled?: (record: T) => boolean
  groups?: string[]
  groupers?: GridGrouping<T>[]
  detail?: (record: T) => ReactNode
  actions?: (record: T) => ReactNode
  searchable?: boolean
}

function selectedState(selected?: string | string[]) {
  const ids = Array.isArray(selected) ? selected : selected ? [selected] : []
  return Object.fromEntries(ids.map(id => [id, true])) as Record<string, true>
}

/**
 * Adaptador de presentación de Lapex sobre Shadcn Table (Base UI/TanStack).
 * Conserva los contratos de selección y edición de las pantallas, mientras
 * delega filas, ordenación, búsqueda, agrupación y expansión a Shadcn Table.
 */
export function ShadcnGrid<T extends { id: string }>(props: Props<T>) {
  const { label, rows, columns, selection, selected, groups = [], groupers = [], searchable = true } = props
  const latest = useRef(props)
  latest.current = props
  const [advancedFilters, setAdvancedFilters] = useState(false)
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [group, setGroup] = useState("")

  // App.tsx construye algunas columnas inline. Solo cambian las definiciones
  // si cambia su estructura; los renderizadores siempre consultan latest.current.
  const signature = columns.map(c => [c.key, c.title, c.filter ? "1" : "0", c.width ?? ""].join(":")).join("|")
  const grouperSignature = groupers.map(g => g.key + ":" + g.title).join("|")
  const defs = useMemo<ST_ColumnDef<T>[]>(() => {
    const fields: ST_ColumnDef<T>[] = columns.map(col => ({
      id: col.key,
      accessorFn: (record: T) => latest.current.columns.find(c => c.key === col.key)?.value(record) ?? "",
      header: col.title,
      Header: ({ column }) => (
        <button
          type="button"
          className="dg-sort"
          aria-label={"Ordenar por " + col.title}
          onClick={event => { event.stopPropagation(); column.toggleSorting() }}
        >
          {col.title}<ArrowDownUp size={13} aria-hidden="true" />
        </button>
      ),
      Cell: ({ row }) => {
        const current = latest.current.columns.find(c => c.key === col.key)
        if (!current) return "—"
        return current.render ? current.render(row.original) : String(current.value(row.original) ?? "—") || "—"
      },
      enableSorting: true,
      enableGrouping: true,
      enableColumnFilter: Boolean(col.filter),
      filterFn: "equalsString",
      size: col.width ? Math.max(90, col.width * 10) : 160,
    }))
    for (const g of groupers) {
      fields.push({
        id: g.key,
        header: g.title,
        accessorFn: (r: T) => latest.current.groupers?.find(x => x.key === g.key)?.value(r) || "Sin asignar",
        enableGrouping: true,
        enableSorting: true,
        enableColumnFilter: false,
        enableHiding: true,
      })
    }
    if (props.actions) fields.push({
      id: "lapex-actions",
      header: "Acciones",
      enableSorting: false,
      enableGrouping: false,
      enableColumnFilter: false,
      Cell: ({ row }) => <div className="dg-actions">{latest.current.actions?.(row.original)}</div>,
      size: 160,
    })
    return fields
    // Structural signature intentionally captures definition changes, not render functions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, grouperSignature, Boolean(props.actions)])

  const currentSelected = selectedState(selected)
  const table = useShadcnTable<T>({
    data: rows,
    columns: defs,
    getRowId: record => record.id,
    enableRowSelection: selection ? row => !latest.current.disabled?.(row.original) : false,
    enableMultiRowSelection: selection !== "single",
    enableSelectAll: false,
    enableSorting: true,
    enableGrouping: groups.length > 0 || groupers.length > 0,
    enableColumnFilters: true,
    columnFilterDisplayMode: "custom",
    enableGlobalFilter: searchable,
    enableFilterMatchHighlighting: false,
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableTableFooter: false,
    enableColumnActions: false,
    enableColumnOrdering: false,
    enableColumnResizing: false,
    enableColumnDragging: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableExpandAll: false,
    enableToolbarInternalActions: false,
    enableEditing: false,
    enableRowActions: false,
    positionExpandColumn: "last",
    initialState: {
      density: "compact",
      showGlobalFilter: false,
      showColumnFilters: false,
      columnVisibility: Object.fromEntries(groupers.map(g => [g.key, false])),
    },
    state: { rowSelection: currentSelected },
    onRowSelectionChange: updater => {
      const previous = selectedState(latest.current.selected)
      const next = typeof updater === "function" ? updater(previous) : updater
      const ids = new Set([...Object.keys(previous), ...Object.keys(next)])
      for (const id of ids) {
        const before = Boolean(previous[id])
        const after = Boolean(next[id])
        if (before !== after) latest.current.onSelect?.(id, after)
      }
    },
    stSelectCheckboxProps: ({ row }) => ({
      "aria-label": "Seleccionar " + String(latest.current.columns[0]?.value(row.original) ?? row.original.id),
    }),
    stExpandButtonProps: ({ row }) => ({
      "aria-label": "Detalle de " + String(latest.current.columns[0]?.value(row.original) ?? row.original.id),
      title: row.getIsExpanded() ? "Ocultar detalle" : "Ver detalle",
    }),
    renderDetailPanel: props.detail ? ({ row }) => latest.current.detail?.(row.original) : undefined,
    stTableBodyRowProps: ({ row, isDetailPanel }) => ({
      className: isDetailPanel ? "dg-expanded" : "dg-record",
      "data-state": currentSelected[row.original?.id] ? "selected" : undefined,
    }),
    localization: {
      language: "es",
      noRecordsToDisplay: "No hay registros",
      toggleSelectRow: "Seleccionar registro",
      expand: "Expandir detalle",
      collapse: "Contraer detalle",
    },
  })

  const filterCols = columns.filter(col => col.filter)
  const visibleFilterCols = filterCols.filter(c =>
    filterCols.length <= 3 || advancedFilters ||
    ["type", "track", "category", "vehicleType"].includes(c.key),
  )
  const availableGroupings = [
    ...groups.map(key => ({ key, title: columns.find(c => c.key === key)?.title ?? key })),
    ...groupers.map(({ key, title }) => ({ key, title })),
  ]
  const filteredCount = table.getFilteredRowModel().flatRows?.filter(r => !r.getIsGrouped()).length ?? rows.length

  return (
    <section className="dg shadcn-grid" aria-label={label}>
      {(searchable || filterCols.length > 0 || availableGroupings.length > 0) && (
        <div className="dg-toolbar">
          {searchable && (
            <label className="dg-search">
              <Search size={14} aria-hidden="true" />
              <Input
                aria-label={"Buscar en " + label}
                placeholder="Buscar"
                value={query}
                onChange={event => { setQuery(event.target.value); table.setGlobalFilter(event.target.value) }}
              />
            </label>
          )}
          {visibleFilterCols.map(col => (
            <label key={col.key} className="dg-filter">
              <span>{col.title}</span>
              <select
                aria-label={"Filtrar " + col.title}
                value={filters[col.key] ?? ""}
                onChange={event => {
                  const value = event.target.value
                  setFilters(old => ({ ...old, [col.key]: value }))
                  table.getColumn(col.key)?.setFilterValue(value || undefined)
                }}
              >
                <option value="">Todos</option>
                {[...new Set(rows.map(row => String(col.value(row))))].filter(Boolean).sort((a, b) => a.localeCompare(b, "es", { numeric: true })).map(value => (
                  <option value={value} key={value}>{value}</option>
                ))}
              </select>
            </label>
          ))}
          {filterCols.length > 3 && (
            <button type="button" className="dg-advanced" onClick={() => setAdvancedFilters(value => !value)}>
              {advancedFilters ? "Menos filtros" : "Filtros avanzados"}
            </button>
          )}
          {availableGroupings.length > 0 && (
            <label className="dg-filter">
              <span>Agrupar por</span>
              <select
                aria-label={"Agrupar " + label}
                value={group}
                onChange={event => {
                  const value = event.target.value
                  setGroup(value)
                  table.setGrouping(value ? [value] : [])
                }}
              >
                <option value="">Sin agrupar</option>
                {availableGroupings.map(({ key, title }) => <option key={key} value={key}>{title}</option>)}
              </select>
            </label>
          )}
        </div>
      )}
      <div className="dg-panel">
        <div className="dg-rows" role="region" aria-label={"Registros de " + label} tabIndex={0}>
          <ShadcnTable table={table} />
        </div>
      </div>
      <div className="dg-status">{filteredCount} de {rows.length} registros</div>
    </section>
  )
}
