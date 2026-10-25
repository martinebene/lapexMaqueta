
import {useMemo,useState} from "react"
import type {ReactNode} from "react"
import {ArrowDownUp,ChevronDown,ChevronRight,Search} from "lucide-react"
import {Table,TableHeader,TableBody,TableRow,TableHead,TableCell} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
export interface GridColumn<T>{key:string;title:string;value:(r:T)=>string|number;render?:(r:T)=>ReactNode;filter?:boolean;width?:number}
export interface GridGrouping<T>{key:string;title:string;value:(r:T)=>string}
interface Props<T extends {id:string}>{label:string;rows:T[];columns:GridColumn<T>[];selection?:"single"|"multiple";selected?:string|string[];onSelect?:(id:string,checked:boolean)=>void;disabled?:(r:T)=>boolean;groups?:string[];groupers?:GridGrouping<T>[];detail?:(r:T)=>ReactNode;actions?:(r:T)=>ReactNode;searchable?:boolean}
export function DataGrid<T extends {id:string}>({label,rows,columns,selection,selected,onSelect,disabled,groups=[],groupers=[],detail,actions,searchable=true}:Props<T>){
const [query,setQuery]=useState("")
const [filters,setFilters]=useState<Record<string,string>>({})
const [group,setGroup]=useState("")
const [sorting,setSorting]=useState({key:"",desc:false})
const [expanded,setExpanded]=useState<string[]>([])
const [advancedFilters,setAdvancedFilters]=useState(false)
const filterCols=columns.filter(c=>c.filter)
const visible=useMemo(()=>{
const q=query.toLowerCase().trim()
const sorted=rows.filter(r=>(!q||columns.some(c=>String(c.value(r)).toLowerCase().includes(q)))&&filterCols.every(c=>!filters[c.key]||String(c.value(r))===filters[c.key]))
if(sorting.key){const col=columns.find(c=>c.key===sorting.key);if(col)sorted.sort((a,b)=>{const x=col.value(a),y=col.value(b);const n=typeof x==="number"&&typeof y==="number"?x-y:String(x).localeCompare(String(y),"es",{numeric:true});return sorting.desc?-n:n})}
return sorted
},[rows,columns,query,filters,sorting])
const grouped=useMemo(()=>{
if(!group)return [["",visible] as [string,T[]]]
const col=columns.find(c=>c.key===group)
const extra=groupers.find(g=>g.key===group)
const m=new Map<string,T[]>()
visible.forEach(r=>{const val=String(col?.value(r)??extra?.value(r)??"")||"Sin asignar";m.set(val,[...(m.get(val)??[]),r])})
return [...m.entries()].sort((a,b)=>a[0].localeCompare(b[0],"es",{numeric:true}))
},[visible,columns,group,groupers])
const span=columns.length+Number(!!selection)+Number(!!actions)+Number(!!detail)
const widths=<colgroup>{selection&&<col style={{width:34}}/>}{columns.map(c=><col key={c.key} style={c.width?{width:String(c.width)+"%"}:undefined}/>)}{actions&&<col style={{width:150}}/>}{detail&&<col style={{width:42}}/>}</colgroup>
const selectedNow=(id:string)=>Array.isArray(selected)?selected.includes(id):selected===id
return <section className="dg" aria-label={label}>
{(searchable||filterCols.length>0||groups.length>0||groupers.length>0)&&<div className="dg-toolbar">
{searchable&&<label className="dg-search"><Search size={14}/><Input aria-label={"Buscar en "+label} placeholder="Buscar" value={query} onChange={e=>setQuery(e.target.value)}/></label>}
{filterCols.filter(c=>filterCols.length<=3||advancedFilters||c.key==="type"||c.key==="track"||c.key==="category"||c.key==="vehicleType").map(c=><label key={c.key} className="dg-filter"><span>{c.title}</span><select aria-label={"Filtrar "+c.title} value={filters[c.key]??""} onChange={e=>setFilters(f=>({...f,[c.key]:e.target.value}))}><option value="">Todos</option>{[...new Set(rows.map(r=>String(c.value(r))))].filter(Boolean).sort().map(v=><option key={v}>{v}</option>)}</select></label>)}
{filterCols.length>3&&<button type="button" className="dg-advanced" onClick={()=>setAdvancedFilters(x=>!x)}>{advancedFilters?"Menos filtros":"Filtros avanzados"}</button>}
{(groups.length>0||groupers.length>0)&&<label className="dg-filter"><span>Agrupar por</span><select aria-label={"Agrupar "+label} value={group} onChange={e=>setGroup(e.target.value)}><option value="">Sin agrupar</option>{groups.map(k=><option key={k} value={k}>{columns.find(c=>c.key===k)?.title??k}</option>)}{groupers.map(g=><option key={g.key} value={g.key}>{g.title}</option>)}</select></label>}
</div>}
<div className="dg-panel"><div className="dg-head"><Table>{widths}<TableHeader><TableRow>{selection&&<TableHead aria-label="Selección"/>}{columns.map(c=><TableHead key={c.key}><button type="button" className="dg-sort" aria-label={"Ordenar por "+c.title} onClick={()=>setSorting(s=>({key:c.key,desc:s.key===c.key?!s.desc:false}))}>{c.title}<ArrowDownUp size={13}/></button></TableHead>)}{actions&&<TableHead>Acciones</TableHead>}{detail&&<TableHead aria-label="Detalle"/>}</TableRow></TableHeader></Table></div>
<div className="dg-rows" role="region" aria-label={"Registros de "+label} tabIndex={0}><Table>{widths}<TableBody>
{grouped.map(([g,list])=>[
...(group?[<TableRow key={"group-"+g} className="dg-group"><TableCell colSpan={span}>{g} ({list.length})</TableCell></TableRow>]:[]),
...list.flatMap(r=>{
const open=expanded.includes(r.id)
const row=[
<TableRow key={r.id} className="dg-record" data-state={selectedNow(r.id)?"selected":undefined}>
{selection&&<TableCell><input type={selection==="single"?"radio":"checkbox"} name={selection==="single"?"pick-"+label:undefined} aria-label={"Seleccionar "+String(columns[0]?.value(r)??r.id)} checked={selectedNow(r.id)} disabled={disabled?.(r)} onChange={e=>onSelect?.(r.id,e.currentTarget.checked)}/></TableCell>}
{columns.map(c=><TableCell key={c.key}>{c.render?c.render(r):String(c.value(r)??"—")||"—"}</TableCell>)}
{actions&&<TableCell><div className="dg-actions">{actions(r)}</div></TableCell>}
{detail&&<TableCell><button type="button" aria-label={"Detalle de "+String(columns[0]?.value(r)??r.id)} aria-expanded={open} onClick={()=>setExpanded(v=>open?v.filter(x=>x!==r.id):[...v,r.id])}>{open?<ChevronDown size={16}/>:<ChevronRight size={16}/>}</button></TableCell>}
</TableRow>]
if(detail&&open)row.push(<TableRow key={r.id+"-details"} className="dg-expanded"><TableCell colSpan={span}>{detail(r)}</TableCell></TableRow>)
return row
})
])}
{!visible.length&&<TableRow><TableCell colSpan={span}>No hay registros</TableCell></TableRow>}
</TableBody></Table></div></div>
<div className="dg-status">{visible.length} de {rows.length} registros</div>
</section>
}
