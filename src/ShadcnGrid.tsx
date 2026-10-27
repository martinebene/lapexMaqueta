import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
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
  /** Estilo semántico para estados de las celdas, no modifica el filtro. */
  status?: (record: T) => "success" | "error" | undefined
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
  /** Control principal independiente del selector; aparece junto al detalle. */
  leadingControl?: (record: T) => ReactNode
  advancedFilterColumns?: GridGrouping<T>[]
  emptyMessage?: string
  /** Permite igualar altura entre tablas vecinas (vehículo/setup). */
  tableHeight?: string
  searchable?: boolean
  /** Variante para catálogos pequeños: altura natural y columnas compactas. */
  compact?: boolean
}

function missingLabel(key: string, title: string) {
  const labels: Record<string, string> = {
    track: "Sin circuito", month: "Sin mes", season: "Sin temporada",
    category: "Sin categoría", vehicleType: "Sin tipo", type: "Sin tipo",
    country: "Sin país", province: "Sin provincia", device: "Sin dispositivo",
  }
  return labels[key] ?? "Sin " + title.toLocaleLowerCase("es")
}
function normalizedGroupValue(value: unknown, key: string, title: string) {
  const text = value == null ? "" : String(value).trim()
  return !text || text === "—" || text === "-" ? missingLabel(key, title) : text
}
function clickedControl(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(
    'button, a, input, textarea, select, [role="checkbox"], [role="radio"], [role="button"], [contenteditable="true"], [data-no-row-select]'
  ))
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
  // TanStack v9: controlar explícitamente expanded mantiene detalle individual
  // independiente de selección y de los cambios de agrupación.
  const [expanded,setExpanded] = useState<Record<string,boolean>>({})

  // App.tsx construye algunas columnas inline. Solo cambian las definiciones
  // si cambia su estructura; los renderizadores siempre consultan latest.current.
  const signature = columns.map(c => [c.key, c.title, c.filter ? "1" : "0", c.width ?? ""].join(":")).join("|")
  const extraCols = props.advancedFilterColumns ?? []
  const grouperSignature = [...groupers, ...extraCols].map(g => g.key + ":" + g.title).join("|")
  const defs = useMemo<ST_ColumnDef<T>[]>(() => {
    const fields: ST_ColumnDef<T>[] = columns.map(col => ({
      id: col.key,
      accessorFn: (record: T) => {
        const current = latest.current.columns.find(c => c.key === col.key)
        return current ? normalizedGroupValue(current.value(record), col.key, col.title) : ""
      },
      header: col.title,
      Cell: ({ row }) => {
        const current = latest.current.columns.find(c => c.key === col.key)
        if (!current) return "—"
        const rendered = current.render ? current.render(row.original) : String(current.value(row.original) ?? "—") || "—"
        const status = current.status?.(row.original)
        return status ? <span className={"dg-value-status " + (status === "success" ? "dg-value-success" : "dg-value-error")}>{rendered}</span> : rendered
      },
      enableSorting: true,
      enableGrouping: true,
      enableColumnFilter: Boolean(col.filter),
      filterFn: "equalsString",
      size: col.width ? Math.max(56, col.width * 8) :
        props.compact && col.key === "needs" ? 128 :
        props.compact && col.key === "enabled" ? 100 :
        props.compact && col.key === "name" ? 240 :
        Math.max(86, Math.min(155, col.title.length * 7 + 38)),
    }))
    for (const g of [...groupers, ...extraCols.filter(extra => !groupers.some(g => g.key === extra.key))]) {
      fields.push({
        id: g.key,
        header: g.title,
        accessorFn: (r: T) => {
          const def = [...(latest.current.groupers ?? []), ...(latest.current.advancedFilterColumns ?? [])].find(x => x.key === g.key)
          return normalizedGroupValue(def?.value(r), g.key, g.title)
        },
        enableGrouping: true,
        enableSorting: true,
        enableColumnFilter: extraCols.some(x => x.key === g.key),
        filterFn: "equalsString",
        enableHiding: true,
      })
    }
    if (props.leadingControl) fields.unshift({
      id: "lapex-leading-control", header: "Activar", enableSorting: false,
      enableGrouping: false, enableColumnFilter: false,
      Cell: ({ row }) => <div className="dg-inline-toggle">{latest.current.leadingControl?.(row.original)}</div>,
      size: props.compact ? 48 : 60,
    })
    if (props.actions) fields.push({
      id: "lapex-actions",
      header: "Acciones",
      enableSorting: false,
      enableGrouping: false,
      enableColumnFilter: false,
      Cell: ({ row }) => <div className="dg-actions">{latest.current.actions?.(row.original)}</div>,
      size: props.compact ? 226 : 138,
    })
    return fields
    // Structural signature intentionally captures definition changes, not render functions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, grouperSignature, Boolean(props.actions), Boolean(props.leadingControl), props.compact])

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
    groupedColumnMode: "remove",
    enableExpanding: Boolean(group) || Boolean(props.detail),
    enableGlobalFilterRankedResults: false,
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
    positionExpandColumn: "first",
    displayColumnDefOptions: {
      "st-row-expand": { header: "Detalle", size: 52 },
      "st-row-select": { header: "Elegir", size: 46 },
    },
    // Shadcn Table agrega por defecto su propio marco, sombra y padding.
    // Lapex conserva una única superficie y un único scroll en .dg-rows.
    stTableLayoutProps: { className: "overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none" },
    stTableContainerProps: { className: "overflow-visible" },
    initialState: {
      density: "compact",
      showGlobalFilter: false,
      showColumnFilters: false,
      columnVisibility: Object.fromEntries([...groupers, ...extraCols].map(g => [g.key, false])),
    },
    state: { rowSelection: currentSelected, expanded },
    onExpandedChange: updater=>setExpanded(old=>{
      const next=typeof updater==="function"?updater(old):updater
      return next===true?Object.fromEntries(rows.map(r=>[r.id,true])):next
    }),
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
       disabled: !row.getIsGrouped() && !Boolean(latest.current.detail),
       className: !row.getIsGrouped() && !latest.current.detail ? "invisible" : undefined,
      "aria-label": row.getIsGrouped()
        ? (row.getIsExpanded() ? "Contraer grupo " : "Expandir grupo ") + String(row.groupingValue ?? "")
        : "Detalle de " + String(latest.current.columns[0]?.value(row.original) ?? row.original.id),
      title: row.getIsGrouped() ? (row.getIsExpanded() ? "Contraer grupo" : "Expandir grupo") : (row.getIsExpanded() ? "Ocultar detalle" : "Ver detalle"),
    }),
    renderDetailPanel: props.detail ? ({ row }) => row.getIsGrouped() ? null : latest.current.detail?.(row.original) : undefined,
    stTableBodyRowProps: ({ row, isDetailPanel }) => ({
      className: isDetailPanel ? "dg-expanded" : row.getIsGrouped() ? "dg-record dg-group-record" :
        selection && row.getCanSelect() ? "dg-record dg-selectable-row" : "dg-record",
      "data-state": currentSelected[row.original?.id] ? "selected" : undefined,
      tabIndex: selection && !row.getIsGrouped() && row.getCanSelect() ? 0 : undefined,
      "aria-selected": selection && !row.getIsGrouped() ? Boolean(currentSelected[row.original?.id]) : undefined,
      onClick: (event) => {
        if (!selection || row.getIsGrouped() || !row.getCanSelect() || clickedControl(event.target)) return
        const old = Boolean(selectedState(latest.current.selected)[row.original.id])
        if (selection === "multiple" || !old) latest.current.onSelect?.(row.original.id, !old)
      },
      onKeyDown: (event) => {
        if (!selection || row.getIsGrouped() || !row.getCanSelect() || event.target !== event.currentTarget) return
        if (event.key !== " " && event.key !== "Enter") return
        event.preventDefault()
        const old = Boolean(selectedState(latest.current.selected)[row.original.id])
        if (selection === "multiple" || !old) latest.current.onSelect?.(row.original.id, !old)
      },
    }),
    localization: {
      language: "es",
      sortByColumnAsc: "Ordenar por {column}",
      sortByColumnDesc: "Ordenar por {column}",
      sortedByColumnAsc: "Ordenar por {column}",
      sortedByColumnDesc: "Ordenar por {column}",
      noRecordsToDisplay: props.emptyMessage ?? "No hay registros",
      toggleSelectRow: "Seleccionar registro",
      expand: "Expandir detalle",
      collapse: "Contraer detalle",
    },
  })

  // Abrir solamente filas de grupo: expanded=true abriría también todos los
  // detalles individuales, mientras la vista agrupada necesita sólo categorías.
  useEffect(() => {
    if (!group) {
      setExpanded({})
      return
    }
    const grouped = table.getGroupedRowModel().flatRows.filter(row => row.getIsGrouped())
    setExpanded(Object.fromEntries(grouped.map(row => [row.id, true])))
    // El cambio de group provoca un render con el nuevo row model.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])

  const filterCols = columns.filter(col => col.filter)
  const priority = ["track", "type", "category", "vehicleType", "date"]
  const defaultFilterKeys = filterCols.length <= 3
    ? filterCols.map(col => col.key)
    : [
        ...filterCols.filter(col => priority.includes(col.key)).sort((a,b) => priority.indexOf(a.key)-priority.indexOf(b.key)),
        ...filterCols.filter(col => !priority.includes(col.key)),
      ].slice(0,3).map(col => col.key)
  const baseFilterCols = filterCols.filter(col => defaultFilterKeys.includes(col.key))
  const hiddenFilterCols = filterCols.filter(col => !defaultFilterKeys.includes(col.key))
  const advancedCols = [
    ...hiddenFilterCols.map(col => ({key:col.key,title:col.title,value:col.value})),
    ...extraCols,
  ]
  const allFilters = [...baseFilterCols, ...advancedCols]
  const availableGroupings = [
    ...groups.map(key => ({ key, title: columns.find(c => c.key === key)?.title ?? key })),
    ...groupers.map(({ key, title }) => ({ key, title })),
  ]
  const filteredCount = table.getFilteredRowModel().flatRows?.filter(r => !r.getIsGrouped()).length ?? rows.length
  const filterSelect = (col: {key:string;title:string;value:(r:T)=>string|number}) => (
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
        {[...new Set(rows.map(row => normalizedGroupValue(col.value(row), col.key, col.title)))]
          .sort((a,b)=>a.localeCompare(b,"es",{numeric:true})).map(value =>
            <option key={value} value={value}>{value}</option>)}
      </select>
    </label>
  )

  return (
    <section className={"dg shadcn-grid"+(props.compact?" shadcn-grid--compact":"")} aria-label={label}
      style={props.tableHeight ? { "--dg-table-height": props.tableHeight } as CSSProperties : undefined}>
      {(searchable || allFilters.length > 0 || availableGroupings.length > 0) && (
        <div className="dg-toolbar">
          <div className="dg-search-row">
            {searchable && (
              <InputGroup className="dg-search">
                <InputGroupInput aria-label={"Buscar en " + label} placeholder="Buscar"
                  value={query}
                  onChange={event => { setQuery(event.target.value); table.setGlobalFilter(event.target.value) }}/>
                <InputGroupAddon align="inline-start"><Search aria-hidden="true" /></InputGroupAddon>
              </InputGroup>
            )}
            {advancedCols.length > 0 && (
              <Button type="button" variant="outline" size="sm" className="dg-advanced"
                aria-expanded={advancedFilters} onClick={() => setAdvancedFilters(value => !value)}>
                <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
                {advancedFilters ? "Menos filtros" : "Filtros avanzados"}
              </Button>
            )}
          </div>
          {(baseFilterCols.length > 0 || availableGroupings.length > 0) && (
            <div className="dg-filter-row">
              {baseFilterCols.map(filterSelect)}
              {availableGroupings.length > 0 && (
                <label className="dg-filter dg-group-filter">
                  <span>Agrupar por</span>
                  <select aria-label={"Agrupar " + label} value={group}
                    onChange={event => {
                      const value = event.target.value
                      setGroup(value)
                      table.setGrouping(value ? [value] : [])
                    }}>
                    <option value="">Sin agrupar</option>
                    {availableGroupings.map(({key,title})=><option key={key} value={key}>{title}</option>)}
                  </select>
                </label>
              )}
            </div>
          )}
          {advancedFilters && advancedCols.length > 0 && (
            <div className="dg-filter-row dg-filter-row-extra">
              {advancedCols.map(filterSelect)}
            </div>
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
