import {useMemo,useState} from "react"
import {Button} from "@/components/ui/button"
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from "@/components/ui/card"
import {Table,TableHead,TableHeader,TableBody,TableRow,TableCell} from "@/components/ui/table"
import type {Dataset} from "./data"
import {seriesOf,groupsOf,samplesOf} from "./seriesMock"
import type {Sample} from "./seriesMock"
const SIZE=50
const clock=(t:number)=>String(Math.floor(t/60)).padStart(2,"0")+":"+String((t%60).toFixed(2)).padStart(5,"0")
function Plot({items,unit}:{items:Sample[];unit:string}){
 const values=items.map(x=>x.value),min=values.length?Math.min(...values):0,max=values.length?Math.max(...values):1
 const gap=Math.max(.01,max-min),lo=min-.07*gap,hi=max+.07*gap
 const start=items[0]?.time??0,end=items[items.length-1]?.time??1
 const subset=items.filter((_,i)=>i%Math.max(1,Math.ceil(items.length/350))===0)
 const points=subset.map(p=>[66+(p.time-start)/Math.max(.001,end-start)*844,258-(p.value-lo)/(hi-lo)*217].join(",")).join(" ")
 return <div className="series-plot-container"><svg className="series-plot" viewBox="0 0 950 320" role="img" aria-label={"Gráfico de magnitud "+unit+" frente al tiempo"}>
  {[0,1,2,3,4].map(i=><g key={i}><line x1="66" x2="910" y1={41+i*54.25} y2={41+i*54.25} stroke="currentColor" opacity=".12"/><text x="58" y={45+i*54.25} fontSize="12" textAnchor="end" fill="currentColor">{(hi-(hi-lo)*i/4).toFixed(1)}</text></g>)}
  <line x1="66" y1="41" x2="66" y2="258" stroke="currentColor"/><line x1="66" y1="258" x2="910" y2="258" stroke="currentColor"/>
  <polyline fill="none" stroke="#087f88" strokeWidth="2.5" points={points}/>
  <text x="24" y="150" transform="rotate(-90 24 150)" fontSize="13" textAnchor="middle" fill="currentColor">Magnitud ({unit})</text>
  <text x="488" y="311" fontSize="13" textAnchor="middle" fill="currentColor">Tiempo (min:s)</text>
  <text x="66" y="282" fontSize="11" textAnchor="middle" fill="currentColor">{clock(start)}</text><text x="910" y="282" fontSize="11" textAnchor="middle" fill="currentColor">{clock(end)}</text>
 </svg></div>
}
export function SeriesView({dataset,seriesId,onBack}:{dataset:Dataset;seriesId:string;onBack:()=>void}){
 const series=seriesOf(dataset).find(x=>x.id===seriesId)
 const [groupId,setGroupId]=useState(""),[segmentId,setSegmentId]=useState(""),[page,setPage]=useState(0)
 const groups=useMemo(()=>groupsOf(dataset),[dataset.id,dataset.type])
 const group=groups.find(x=>x.id===groupId),segment=group?.segments.find(x=>x.id===segmentId)
 const all=useMemo(()=>series?samplesOf(dataset.id,series):[],[dataset.id,series?.id])
 const filtered=useMemo(()=>segment?all.filter(p=>p.time>=segment.start&&p.time<segment.end):all,[all,segment])
 const pages=Math.max(1,Math.ceil(filtered.length/SIZE))
 if(!series)return <Card><CardContent>Serie no encontrada. <Button onClick={onBack}>Volver</Button></CardContent></Card>
 return <div className="series-view-stack">
  <Card><CardHeader><CardTitle>Segmentaciones y segmentos</CardTitle><CardDescription>Conjuntos compartidos por los canales del rodaje; el segmento elegido filtra gráfico y tabla.</CardDescription></CardHeader><CardContent>
   <div className="series-filter-columns">
    <section aria-label="Segmentaciones disponibles"><h3>Segmentaciones disponibles</h3><div className="series-choice-list" role="group" aria-label="Seleccionar segmentación">
     <button type="button" className={!groupId?"selected":""} aria-pressed={!groupId} onClick={()=>{setGroupId("");setSegmentId("");setPage(0)}}>Ninguna</button>
     {groups.map(x=><button type="button" key={x.id} className={groupId===x.id?"selected":""} aria-pressed={groupId===x.id} onClick={()=>{setGroupId(x.id);setSegmentId("");setPage(0)}}>{x.name}<small>{x.segments.length} segmentos</small></button>)}
    </div></section>
    <section aria-label="Segmentos disponibles"><h3>Segmentos</h3><div className="series-choice-list" role="group" aria-label="Seleccionar segmento">{group?<><button type="button" className={!segmentId?"selected":""} aria-pressed={!segmentId} onClick={()=>{setSegmentId("");setPage(0)}}>Serie completa</button>
     {group.segments.map(x=><button type="button" key={x.id} className={segmentId===x.id?"selected":""} aria-pressed={segmentId===x.id} onClick={()=>{setSegmentId(x.id);setPage(0)}}>{x.name}<small>{clock(x.start)} – {clock(x.end)}</small></button>)}</>:<p>Seleccioná una segmentación para ver sus segmentos.</p>}</div></section>
   </div><p className="series-filter-status" role="status">Filtro aplicado: {segment?group?.name+" / "+segment.name:"Serie completa"} · {filtered.length.toLocaleString("es-AR")} registros</p>
  </CardContent></Card>
  <Card><CardHeader><CardTitle>Gráfico · {series.name}</CardTitle><CardDescription>Magnitud ({series.unit}) en vertical, tiempo en horizontal.</CardDescription></CardHeader><CardContent><Plot items={filtered} unit={series.unit}/></CardContent></Card>
  <Card><CardHeader><CardTitle>Tabla de muestras · {series.name}</CardTitle><CardDescription>Datos simulados de {series.hz} Hz correspondientes al intervalo del gráfico.</CardDescription></CardHeader><CardContent>
   <div className="series-sample-scroll"><Table><TableHeader><TableRow><TableHead>Registro</TableHead><TableHead>Tiempo (s)</TableHead><TableHead>{series.name} ({series.unit})</TableHead></TableRow></TableHeader><TableBody>
   {filtered.slice(page*SIZE,(page+1)*SIZE).map(p=><TableRow key={p.id}><TableCell>{Number(p.id)+1}</TableCell><TableCell>{p.time.toFixed(3)}</TableCell><TableCell>{p.value.toFixed(3)}</TableCell></TableRow>)}
   </TableBody></Table></div><div className="series-pagination"><span>Página {page+1} de {pages} · {filtered.length.toLocaleString("es-AR")} registros</span><Button size="sm" variant="outline" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Anterior</Button><Button size="sm" variant="outline" disabled={page>=pages-1} onClick={()=>setPage(p=>p+1)}>Siguiente</Button></div>
  </CardContent></Card><Button variant="outline" onClick={onBack}>Volver al rodaje</Button>
 </div>
}
