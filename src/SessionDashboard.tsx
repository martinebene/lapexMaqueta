import {useState} from "react"
import {Pencil,ArrowUpRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from "@/components/ui/card"
import {ShadcnGrid} from "./ShadcnGrid"
import {ResourceAvatar} from "./ResourceAvatar"
import type {Session,SessionSnapshot,Resource} from "./data"

export type SnapshotKind="pilot"|"track"|"vehicle"|"setup"|"segmentation"
const fields=(kind:SnapshotKind,r:Resource)=>kind==="pilot"?[
 ["Número deportivo",r.number],["Nombre corto",r.shortName],["Nacionalidad",r.nationality],["País",r.country],["Ciudad",r.city],["Experiencia",r.experience],["Estilo de conducción",r.drivingStyle],["Descripción",r.description||r.detail]
]:kind==="track"?[
 ["Tipo de trazado",r.trackType],["País",r.country],["Provincia",r.province],["Ciudad",r.city],["Longitud",r.lengthKm!=null?r.lengthKm+" km":undefined],["Sentido",r.direction],["Descripción",r.description||r.detail]
]:[
 ["Tipo de vehículo",r.vehicleType],["Categoría",r.category],["Fabricante",r.manufacturer],["Modelo",r.model],["Peso de referencia",r.referenceWeight!=null?r.referenceWeight+" kg":undefined],["Tracción",r.drivenWheels],["Potencia",r.enginePower],["Descripción",r.description||r.detail]
]
const names:Record<SnapshotKind,string>={pilot:"Piloto",track:"Circuito",vehicle:"Vehículo",setup:"Setup",segmentation:"Segmentación"}
const label=(v:unknown)=>v===undefined||v===null||v===""?"—":String(v)
function SummaryResource({kind,resource,children,onOpen}:{kind:"pilot"|"track"|"vehicle";resource?:Resource;children?:React.ReactNode;onOpen:(kind:SnapshotKind,id:string)=>void}){
 return <Card className="session-snapshot-card"><CardHeader><CardTitle>{names[kind]}</CardTitle><CardDescription>Instantánea del análisis</CardDescription></CardHeader>{resource&&<div className="snapshot-avatar"><ResourceAvatar kind={kind==="pilot"?"pilots":kind==="track"?"tracks":"vehicles"} resource={resource} size={68}/></div>}<CardContent>
  {resource?<><button type="button" className="snapshot-main-link" onClick={()=>onOpen(kind,resource.id)}>{resource.name}<ArrowUpRight size={15}/></button>
   <dl className="snapshot-fields">{fields(kind,resource).filter(([,v])=>v!==undefined&&v!==null&&v!=="").slice(0,6).map(([k,v])=><div key={String(k)}><dt>{k}</dt><dd>{label(v)}</dd></div>)}</dl>
   {children}</>:<p>Sin datos de contexto guardados.</p>}
 </CardContent></Card>
}
function ModuleMock({id}:{id:string}){
 if(id==="gforce")return <div className="analysis-module-mock"><div className="analysis-metrics"><span>Aceleración lateral máxima <strong>1,42 g</strong></span><span>Aceleración longitudinal <strong>0,88 g</strong></span></div><svg viewBox="0 0 630 185" role="img" aria-label="Distribución sintética de fuerza G"><path d="M0 92H630M315 0V185" stroke="currentColor" opacity=".15"/>{Array.from({length:75},(_,i)=>{const angle=i*2.399,r=18+(i%73);return <circle key={i} cx={315+Math.cos(angle)*r*1.7} cy={92+Math.sin(angle)*r*.75} r="3" fill="#087f88" opacity=".6"/>})}</svg></div>
 if(id==="sectors")return <div className="analysis-module-mock"><p>Parciales del circuito (datos ilustrativos)</p><div className="analysis-metrics"><span>Sector 1 <strong>32,14 s</strong></span><span>Sector 2 <strong>37,20 s</strong></span><span>Sector 3 <strong>33,04 s</strong></span></div></div>
 return <div className="analysis-module-mock"><div className="analysis-metrics"><span>Mejor vuelta <strong>1:24.532</strong></span><span>Última vuelta <strong>1:26.048</strong></span><span>Diferencia <strong>+1.516 s</strong></span></div>
  <svg viewBox="0 0 630 160" role="img" aria-label="Variación ilustrativa de la velocidad"><path d="M0 40H630M0 80H630M0 120H630" stroke="currentColor" opacity=".15"/><path d="M0 123C40 55 62 68 90 89S140 150 174 101 230 41 263 83 300 120 340 74 395 23 430 79 475 143 515 101 570 29 630 50" stroke="#087f88" strokeWidth="3.5" fill="none"/></svg>
 </div>
}
export function SessionDashboard({session,snapshot,modules,onSnapshot,onDataset,onEdit}:{session:Session;snapshot:SessionSnapshot;modules:Resource[];onSnapshot:(kind:SnapshotKind,id:string)=>void;onDataset:(id:string)=>void;onEdit:()=>void}){
 const available=modules.filter(x=>session.modules.includes(x.id))
 const [tab,setTab]=useState(available[0]?.id??"")
 const active=available.find(x=>x.id===tab)??available[0]
 const activate=(index:number)=>setTab(available[(index+available.length)%available.length]?.id??"")
 return <div className="session-overview">
  <div className="session-analysis-actions"><p>Contexto y resultados guardados al crear o actualizar este análisis.</p><Button variant="outline" onClick={onEdit}><Pencil size={15}/>Editar sesión</Button></div>
  <Card><CardHeader><CardTitle>Contexto de análisis</CardTitle><CardDescription>Valores conservados como instantánea: los cambios posteriores en Recursos no los alteran.</CardDescription></CardHeader><CardContent>
   <div className="session-context-snapshots">
    <SummaryResource kind="pilot" resource={snapshot.pilot} onOpen={onSnapshot}/>
    <SummaryResource kind="track" resource={snapshot.track} onOpen={onSnapshot}>
     <div className="snapshot-references"><strong>Segmentaciones elegidas</strong>
      {snapshot.segmentations.length? snapshot.segmentations.map(s=><button key={s.id} onClick={()=>onSnapshot("segmentation",s.id)}>{s.name||"Segmentación sin nombre"} <ArrowUpRight size={13}/></button>):<span>Ninguna (opcional)</span>}
     </div>
    </SummaryResource>
    <SummaryResource kind="vehicle" resource={snapshot.vehicle} onOpen={onSnapshot}>
     <div className="snapshot-references"><strong>Setup elegido</strong>{snapshot.setup?<button onClick={()=>onSnapshot("setup",snapshot.setup!.id)}>{snapshot.setup.name}<ArrowUpRight size={13}/></button>:<span>Sin setup (opcional)</span>}</div>
    </SummaryResource>
   </div>
  </CardContent></Card>
  <Card><CardHeader><CardTitle>Fuentes de datos</CardTitle><CardDescription>Registros utilizados por la sesión, con acceso directo a cada fuente.</CardDescription></CardHeader><CardContent>
    <ShadcnGrid label="Fuentes de la sesión" rows={snapshot.sources} columns={[
      {key:"name",title:"Registro",value:d=>d.name},
      {key:"role",title:"Uso",value:d=>session.targets.includes(d.id)?"Objetivo":"Referencia"},
      {key:"type",title:"Tipo",value:d=>d.type==="run"?"Rodaje":d.type==="weather"?"Meteorología":"Cronometraje"},
      {key:"date",title:"Fecha",value:d=>d.date},
      {key:"device",title:"Dispositivo",value:d=>d.device??"—"}
    ]} searchable={snapshot.sources.length>4} actions={source=><Button size="sm" variant="outline" onClick={()=>onDataset(source.id)}>Abrir fuente <ArrowUpRight size={14}/></Button>} emptyMessage="Esta sesión no tiene fuentes asociadas."/>
  </CardContent></Card>
  <Card className="session-analysis-card"><CardHeader><CardTitle>Análisis</CardTitle><CardDescription>Seleccioná uno de los módulos del análisis. Sus resultados son demostrativos.</CardDescription></CardHeader><CardContent>
   <Card className="session-analysis-inner"><CardContent>
    {available.length?<><div role="tablist" aria-label="Módulos seleccionados" className="analysis-tabs">{available.map((module,i)=><button key={module.id} type="button" role="tab" id={"session-tab-"+module.id} aria-controls="session-module-panel" aria-selected={active?.id===module.id} tabIndex={active?.id===module.id?0:-1} onKeyDown={e=>{if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){e.preventDefault();const index=e.key==="Home"?0:e.key==="End"?available.length-1:i+(e.key==="ArrowRight"?1:-1);activate(index)}}} onClick={()=>setTab(module.id)}>{module.name}</button>)}</div>
     <div id="session-module-panel" className="analysis-tab-panel" role="tabpanel" aria-labelledby={"session-tab-"+active?.id} tabIndex={0}><h3>{active?.name}</h3><p>{active?.detail}</p><ModuleMock id={active?.id??""}/></div>
    </>:<p>No hay módulos seleccionados en esta sesión.</p>}
   </CardContent></Card>
  </CardContent></Card>
 </div>
}
export function SnapshotDetail({kind,id,snapshot,onBack}:{kind:SnapshotKind;id:string;snapshot:SessionSnapshot;onBack:()=>void}){
 const object=kind==="pilot"?snapshot.pilot:kind==="track"?snapshot.track:kind==="vehicle"?snapshot.vehicle:kind==="setup"?snapshot.setup:snapshot.segmentations.find(s=>s.id===id)
 if(!object)return <Card><CardContent><p>Instantánea no disponible.</p><Button onClick={onBack}>Volver al análisis</Button></CardContent></Card>
 const rows=kind==="setup"?Object.entries((snapshot.setup?.parameters??{})).map(([k,v])=>[k,v]):kind==="segmentation"?[["Tipo",object&&"type" in object&&object.type==="analysis"?"Parciales":"Nomenclatura de curvas"],["Fecha",object&&"date" in object?object.date:"—"],["Segmentos",object&&"segmentNames" in object?object.segmentNames?.join(", "):"—"]]:fields(kind,object as Resource)
 return <Card className="snapshot-detail-card"><CardHeader><CardTitle>Instantánea · {names[kind]} · {object.name}</CardTitle><CardDescription>Datos conservados con el análisis. No modifica el recurso actual.</CardDescription></CardHeader><CardContent>
  <dl className="snapshot-fields snapshot-full"><div><dt>Nombre</dt><dd>{object.name}</dd></div>{rows.map(([k,v])=><div key={String(k)}><dt>{k}</dt><dd>{label(v)}</dd></div>)}</dl>
  <Button variant="outline" onClick={onBack}>Volver al análisis</Button>
 </CardContent></Card>
}
