
import { useState } from "react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Plus, FolderOpen, Upload, Check, Trash2, Pencil, Share2, ArrowRight, Send, X, Database, Layers3, BookOpen, HardDrive, Settings2, CircleCheck, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { initialDatasets, initialResources, initialSessions, emptyDraft, validDraft, moduleMissing } from "./data"
import { ShadcnGrid } from "./ShadcnGrid"
import type { GridColumn } from "./ShadcnGrid"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar07 } from "./Sidebar07"
import type { Draft, Dataset, Resource, ResourceKind, Session, SourceKind } from "./data"

type Mode="analysis"|"resources"|"data"|"config"
type View="home"|"new"|"session"|"source"|"context"|"module"|"library"|"resourceEdit"|"datasets"|"dataDetail"|"dataEdit"|"import"|"settings"|"account"|"help"
type ContextKey="pilot"|"track"|"vehicle"
type PickItem={id:string;name:string;detail:string}
const ctxKinds:ContextKey[]=["pilot","track","vehicle"]
const ctxToRes:Record<ContextKey,ResourceKind>={pilot:"pilots",track:"tracks",vehicle:"vehicles"}
const names:Record<ContextKey,string>={pilot:"create.pilot",track:"create.track",vehicle:"create.vehicle"}
function uniq(list:string[]){return [...new Set(list)]}
function itemName(id:string,items:Resource[]){return items.find(x=>x.id===id)?.name??"—"}
function formatSessionTimestamp(iso:string){return new Date(iso).toLocaleString("es-AR",{dateStyle:"short",timeStyle:"short"})}
function SectionStatus({title,complete}:{title:string;complete:boolean}){
 return <span className={"session-status-icon"+(complete?" complete":" incomplete")} role="img" aria-label={complete?"Requisitos cumplidos: "+title:"Requisitos pendientes: "+title} title={complete?"Requisitos cumplidos":"Requisitos pendientes"}>
 {complete?<CircleCheck aria-hidden="true"/>:<CircleX aria-hidden="true"/>}
 </span>
}
function SessionCardHeading({title,complete}:{title:string;complete:boolean}){
 return <div className="session-card-title"><SectionStatus title={title} complete={complete}/><CardTitle role="heading" aria-level={2}>{title}</CardTitle></div>
}

export default function App(){
const {t}=useTranslation()
const [view,setView]=useState<View>("home")
const [mode,setMode]=useState<Mode>("analysis")
const [resources,setResources]=useState<Record<ResourceKind,Resource[]>>(initialResources)
const [datasets,setDatasets]=useState<Dataset[]>(initialDatasets)
const [sessions,setSessions]=useState<Session[]>(initialSessions)
const [activeId,setActiveId]=useState<string|null>(null)
const [selectedId,setSelectedId]=useState("s1")
const [draft,setDraft]=useState<Draft>(emptyDraft())
const [creationPreview,setCreationPreview]=useState(()=>new Date().toISOString())
const [sourceKind,setSourceKind]=useState<SourceKind>("run")
const [contextKind,setContextKind]=useState<ContextKey>("pilot")
const [moduleId,setModuleId]=useState("best")
const [kind,setKind]=useState<ResourceKind>("pilots")
const [itemId]=useState<string|null>(null)
const [editName,setEditName]=useState("")
const [editDetail,setEditDetail]=useState("")
const [datasetId,setDatasetId]=useState("")
const [dataDraft,setDataDraft]=useState<Dataset|null>(null)
const [inlineId,setInlineId]=useState<string|null>(null)
const [inlineDraft,setInlineDraft]=useState<Resource>({id:"",name:"",detail:""})
const [moduleSettings,setModuleSettings]=useState<string|null>(null)
const [plan,setPlan]=useState<"Free"|"Pro">("Free")
const [toast,setToast]=useState("")
const [modal,setModal]=useState<"usage"|"membership"|"switch"|"signout"|null>(null)
const [importStep,setImportStep]=useState(1)
const [filename,setFilename]=useState("")
const [fileType,setFileType]=useState("")
const [chatDraft,setChatDraft]=useState("")
const [chats,setChats]=useState<Record<string,{who:"bot"|"user";text:string}[]>>({})
const [lap,setLap]=useState("best")

const active=sessions.find(x=>x.id===activeId)??null
const targetDataset=datasets.find(x=>x.id===datasetId)??null
const draftReady=validDraft(draft,resources,datasets)
const distinctTracks=new Set(datasets.map(d=>d.track).filter(Boolean)).size
const storageUsed=datasets.reduce((s,d)=>s+(d.sizeMB??0),0)
const storageTotal=2048

function show(message:string){setToast(message);window.setTimeout(()=>setToast(""),2800)}
function navigate(target:View,group?:Mode){setView(target);if(group)setMode(group)}
function selectMode(m:Mode){setMode(m);setView(m==="analysis"?(active?"session":"home"):m==="resources"?"library":m==="data"?"datasets":"settings");if(m==="resources")setKind("pilots")}
function beginNew(){setDraft(emptyDraft());setCreationPreview(new Date().toISOString());navigate("new","analysis")}
function openSession(id:string){if(!sessions.some(s=>s.id===id))return;setActiveId(id);setSelectedId(id);navigate("session","analysis")}
function createSession(){if(!validDraft(draft,resources,datasets))return;const id="s"+Date.now();setSessions(old=>[{...draft,id,name:draft.name.trim(),observations:draft.observations.trim(),createdAt:new Date().toISOString()},...old]);setActiveId(id);setSelectedId(id);setModuleId(draft.modules[0]);navigate("session","analysis");show(t("create.created"))}
function setSingle(key:ContextKey,value:string){setDraft(old=>({...old,[key]:value,...(key==="vehicle"?{setup:""}:{})}))}
function toggleMulti(key:"targets"|"references"|"modules",id:string,checked:boolean){
setDraft(old=>{
const next={...old,[key]:checked?(key==="targets"?[id]:uniq([...old[key],id])):old[key].filter(x=>x!==id)};
if(checked&&key==="targets")next.references=old.references.filter(x=>x!==id);
if(checked&&key==="references")next.targets=old.targets.filter(x=>x!==id);
return next;
})
}
function openLibrary(k:ResourceKind){setKind(k);setInlineId(null);setModuleSettings(null);navigate("library","resources")}
function saveResource(){if(!editName.trim())return;setResources(old=>({...old,[kind]:itemId?old[kind].map(x=>x.id===itemId?{...x,name:editName.trim(),detail:editDetail}:x):[...old[kind],{id:"r"+Date.now(),name:editName.trim(),detail:editDetail}]}));navigate("library","resources");show(t("form.saved"))}
function deleteResource(id:string){if(!window.confirm(t("data.deleteConfirm")))return;setResources(old=>({...old,[kind]:old[kind].filter(x=>x.id!==id)}));show(t("data.deleted"))}
function editDataset(id:string){const d=datasets.find(x=>x.id===id);if(!d)return;setDatasetId(id);setDataDraft({...d});navigate("dataEdit","data")}
function saveDataset(){if(!dataDraft?.name.trim())return;setDatasets(old=>old.map(x=>x.id===dataDraft.id?{...dataDraft,name:dataDraft.name.trim()}:x));navigate("dataDetail","data");show(t("form.saved"))}
function removeDataset(id:string){if(sessions.some(s=>s.targets.includes(id)||s.references.includes(id))){show(t("data.linkedDelete"));return}if(!window.confirm(t("data.deleteConfirm")))return;setDatasets(old=>old.filter(x=>x.id!==id));setSessions(old=>old.map(s=>({...s,targets:s.targets.filter(x=>x!==id),references:s.references.filter(x=>x!==id)})));navigate("datasets","data");show(t("data.deleted"))}
function toggleSource(id:string,checked:boolean){
if(!active)return;
setSessions(old=>old.map(s=>{if(s.id!==active.id)return s;
const ref=sourceKind==="reference";const key=ref?"references":"targets";const other=ref?"targets":"references";
return {...s,[key]:checked?(ref?uniq([...s[key],id]):[id]):s[key].filter(x=>x!==id),[other]:checked?s[other].filter(x=>x!==id):s[other]};
}))
}
function sendChat(){if(!chatDraft.trim()||!active)return;const key=active.id+"/"+moduleId;const prompt=chatDraft.trim();setChats(old=>({...old,[key]:[...(old[key]??[]),{who:"user",text:prompt},{who:"bot",text:t("module.botReply",{name:t("module."+moduleId)})}]}));setChatDraft("")}
function profileAction(action:"usage"|"membership"|"switch"|"signout"){setModal(action)}
function beginInline(){setInlineId("__new__");setInlineDraft({id:"__new__",name:"",detail:""})}
function saveInline(){
 if(!inlineDraft.name.trim())return
 const next={...inlineDraft,name:inlineDraft.name.trim()}
 setResources(old=>({...old,[kind]:inlineId==="__new__"?[...old[kind],{...next,id:"r"+Date.now()}]:old[kind].map(x=>x.id===inlineId?{...x,...next,id:x.id,vehicleType:x.vehicleType}:x)}))
 setInlineId(null)
 show(t("form.saved"))
}
function updateObservation(id:string,value:string){setDatasets(old=>old.map(d=>d.id===id?{...d,observation:value}:d))}
function detailDataset(d:Dataset){
 return <div className="dg-detail"><strong>{d.name}</strong><span>Registro: {d.id}</span><span>Tipo: {t("source."+d.type)}</span><span>Inicio: {d.date} {d.time}</span><span>Dispositivo: {d.device??"—"}</span><span>Mejor vuelta: {d.bestLap??"No aplica"}</span><span>Duración: {d.duration??"—"}</span><span>Canales: {d.channels??"No aplica"}</span><span>{d.observation}</span></div>
}
function datasetColumns():GridColumn<Dataset>[] {
 return [
 {key:"name",title:"Nombre",value:d=>d.name},
 {key:"date",title:"Fecha y hora",value:d=>d.date+" "+d.time},
 {key:"track",title:"Circuito",value:d=>itemName(d.track,resources.tracks),filter:true},
 {key:"bestLap",title:"Mejor vuelta",value:d=>d.bestLap??"—"},
 {key:"device",title:"Dispositivo",value:d=>d.device??"—",filter:true},
 {key:"type",title:"Tipo",value:d=>t("source."+d.type),filter:true}
 ]
}
function resourceInfo(r:Resource){
 if(kind==="pilots")return <div className="dg-detail"><strong>{r.name}</strong><span>Nombre corto: {r.shortName??"—"}</span><span>Apodo: {r.nickname??"—"}</span><span>Localidad: {r.city??"—"} · {r.country??"—"}</span><span>Correo: {r.email??"—"}</span><span>Teléfono: {r.phone??"—"}</span><span>Experiencia: {r.experience??"—"}/10</span><span>Velocidad: {r.speed??"—"}/10</span><span>{r.description??r.detail}</span></div>
 if(kind==="vehicles")return <div className="dg-detail"><strong>{r.name}</strong><span>Tipo: {r.vehicleType??"—"}</span><span>Peso referencia: {r.referenceWeight??"—"} kg</span><span>Tracción: {r.drivenWheels??"—"}</span><span>Potencia: {r.enginePower??"—"}</span><span>Setups: {(r.setups??[]).map(s=>s.name).join(", ")||"Sin setups"}</span></div>
 if(kind==="tracks")return <div className="dg-detail"><strong>{r.name}</strong><span>País: {r.country??"—"} · Provincia: {r.province??"—"}</span><span>Longitud: {r.lengthKm??"—"} km</span><span>Conjuntos de segmentación: {r.segments??0}</span>{r.geometry?<svg viewBox="0 0 180 78" role="img" aria-label={"Geometría esquemática de "+r.name} className="track-geometry"><polyline points="12,54 45,12 148,23 12,54" fill="none" stroke="currentColor" strokeWidth="3"/></svg>:<span>Geometría no disponible</span>}</div>
 return <div className="dg-detail"><strong>{r.name}</strong><span>{r.detail}</span><span>Requisitos: {(r.requirements??[]).join("; ")||"Sin requisitos declarados"}</span></div>
}
function editable(r:Resource,k:keyof Resource){
 if(inlineId!==r.id)return String(r[k]??"—")||"—"
 return <Input aria-label={"Editar "+String(k)+" de "+r.name} value={String(inlineDraft[k]??"")} onChange={e=>setInlineDraft(d=>({...d,[k]:e.target.value}))}/>
}
function moduleAvailable(r:Resource){return r.enabled!==false&&moduleMissing(r,draft,datasets).length===0}

function picker(key:string,title:string,hint:string,options:PickItem[],selected:string|string[],multiple:boolean,change:(id:string,checked:boolean)=>void):ReactNode{
const count=Array.isArray(selected)?selected.length:selected?1:0;const required=key!=="references"
return <Card className="picker">
<CardHeader className="picker-head"><div><CardTitle>{title}</CardTitle><CardDescription>{hint}</CardDescription></div><span className={"picker-count"+(count||!required?" complete":"")}>{t("common.selected",{count})} · {t(required?"common.required":"common.optional")}</span></CardHeader>
<div className="picker-shell"><div className="picker-columns"><span>{t("picker.choose")}</span><span>{t("picker.record")}</span><span>{t("picker.detail")}</span></div><div className="picker-list" role="group" aria-label={title} tabIndex={0}>
{options.length?options.map(item=>{const selectedNow=Array.isArray(selected)?selected.includes(item.id):selected===item.id;return <label className={"picker-row"+(selectedNow?" selected":"")} key={item.id}>
<span className="picker-control">{multiple?<Checkbox checked={selectedNow} onCheckedChange={v=>change(item.id,v===true)} aria-label={item.name}/>:<input type="radio" name={key} checked={selectedNow} onChange={()=>change(item.id,true)} aria-label={item.name}/>}</span>
<span className="picker-name" title={item.name}>{item.name}</span><span className="picker-detail" title={item.detail}>{item.detail}</span></label>})
:<p className="muted-blank">{t("library.empty")}</p>}</div></div></Card>
}
function crumbs():{label:string;onClick?:()=>void}[]{
const first={label:t("nav."+mode),onClick:()=>selectMode(mode)}
if(view==="new")return [first,{label:t("nav.new")}]
if(view==="home")return [{label:t("nav.analysis")}]
if(["session","source","context","module"].includes(view)&&active){
const a:{label:string;onClick?:()=>void}[]=[first,{label:active.name,onClick:()=>navigate("session")}];
if(view==="source")a.push({label:t("nav.sources")},{label:t("source."+sourceKind)});
if(view==="context")a.push({label:t("nav.context")},{label:t(names[contextKind])});
if(view==="module")a.push({label:t("nav.modules")},{label:t("module."+moduleId)});
return a;
}
if(["library","resourceEdit"].includes(view)){
return [first,{label:t("nav."+kind),onClick:()=>openLibrary(kind)},...(view==="resourceEdit"?[{label:t(itemId?"common.edit":"common.new")}]:[])]
}
if(["datasets","dataDetail","dataEdit"].includes(view)){
return [first,{label:t("nav.library"),onClick:()=>navigate("datasets","data")},...(view!=="datasets"?[{label:targetDataset?.name??t("meta.notFound")}]:[]),...(view==="dataEdit"?[{label:t("common.edit")}]:[])]
}
return [first,{label:t(view==="import"?"nav.import":view==="account"?"nav.account":view==="help"?"nav.help":"nav.preferences")}]
}
function pageTitle(){
if(view==="new")return t("create.title")
if(view==="home")return t("home.title")
if(view==="session")return active?.name??t("home.title")
if(view==="source")return t("source."+sourceKind)
if(view==="context")return t(names[contextKind])
if(view==="module")return t("module."+moduleId)
if(view==="library")return t("nav."+kind)
if(view==="resourceEdit")return t(itemId?"common.edit":"form.newResource")
if(view==="datasets")return t("nav.library")
if(view==="dataDetail"||view==="dataEdit")return targetDataset?.name??t("meta.notFound")
return t(view==="import"?"nav.import":view==="account"?"nav.account":view==="help"?"nav.help":"nav.preferences")
}
function pageSubtitle(){
if(view==="home")return t("home.subtitle")
if(view==="new")return t("create.subtitle")
if(view==="session")return t("session.subtitle")
if(view==="module")return ""
if(view==="library")return t("library.subtitle")
if(view==="datasets")return t("data.subtitle")
if(view==="import")return t("import.subtitle")
if(view==="help")return t("help.subtitle")
return ""
}
const chatKey=active?.id+"/"+moduleId;
const history=chats[chatKey]??[];
return <SidebarProvider className="lapex-app style-nova sidebar07-layout" defaultOpen>
<AppSidebar07 mode={mode} plan={plan}
  onNewSession={beginNew}
  onOpenSessions={()=>{setActiveId(null);navigate("home","analysis")}}
  onResource={openLibrary}
  onData={key=>{if(key==="import")setImportStep(1);navigate(key,"data")}}
  onConfig={key=>navigate(key,"config")}
  onProfile={profileAction}
/>
<SidebarInset className="workspace">
<div className="sidebar07-breadcrumb-bar"><SidebarTrigger aria-label="Alternar barra lateral"/><span className="sidebar07-breadcrumb-divider" aria-hidden="true"/><nav className="breadcrumbs" aria-label="Breadcrumb">{crumbs().map((c,i)=><span key={i}>{i>0&&<span className="crumb-sep">/</span>}{c.onClick?<button onClick={c.onClick}>{c.label}</button>:<span aria-current="page">{c.label}</span>}</span>)}</nav></div>
<header className="screen-header"><div><h1>{pageTitle()}</h1>{pageSubtitle()&&<p>{pageSubtitle()}</p>}</div>
<div className="page-tools">{view==="new"&&<Button variant="outline" onClick={()=>navigate("home","analysis")}>{t("common.cancel")}</Button>}{view==="library"&&kind!=="modules"&&<Button onClick={beginInline}><Plus size={15}/>{t("common.new")}</Button>}{view==="datasets"&&<Button onClick={()=>{setImportStep(1);navigate("import","data")}}><Upload size={16}/>{t("nav.import")}</Button>}</div></header>

{view==="home"&&<Card className="open-sessions-card">
<CardHeader><CardTitle>{t("nav.saved")}</CardTitle><CardDescription>{t("common.records",{count:sessions.length})} · Seleccioná una sesión y abrila.</CardDescription></CardHeader>
<CardContent><div className="open-session-scroll" role="region" aria-label={t("nav.saved")} tabIndex={0}><Table><TableHeader><TableRow><TableHead>Elegir</TableHead><TableHead>{t("common.name")}</TableHead><TableHead>{t("nav.pilots")}</TableHead><TableHead>{t("nav.tracks")}</TableHead></TableRow></TableHeader><TableBody>{sessions.map(session=><TableRow key={session.id} data-state={selectedId===session.id?"selected":undefined} className="open-session-row" onClick={()=>setSelectedId(session.id)}><TableCell><input aria-label={"Seleccionar "+session.name} type="radio" checked={selectedId===session.id} onChange={()=>setSelectedId(session.id)}/></TableCell><TableCell className="font-semibold">{session.name}</TableCell><TableCell>{itemName(session.pilot,resources.pilots)}</TableCell><TableCell>{itemName(session.track,resources.tracks)}</TableCell></TableRow>)}</TableBody></Table></div>
<div className="open-session-actions"><Button variant="outline" onClick={beginNew}><Plus size={16}/>{t("nav.new")}</Button><Button onClick={()=>openSession(selectedId)} disabled={!sessions.some(s=>s.id===selectedId)}><FolderOpen size={16}/>{t("nav.open")}</Button></div>
</CardContent></Card>}


{view==="new"&&<div className="new-session">
<Card className="session-details-card">
 <CardHeader><SessionCardHeading title="Datos de la sesión" complete={Boolean(draft.name.trim())}/><CardDescription>{t("create.nameHint")}</CardDescription></CardHeader>
 <CardContent><div className="session-fields">
  <div className="session-form-row">
   <label htmlFor="session-name" className="session-field-label">Nombre de la sesión <span aria-hidden="true">*</span></label>
   <div className="session-field-control"><Input id="session-name" aria-label={t("create.name")} required maxLength={80} autoComplete="off" value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} placeholder="Escribí el nombre de la sesión"/></div>
  </div>
  <div className="session-form-row">
   <label htmlFor="session-observations" className="session-field-label">Observaciones</label>
   <div className="session-field-control"><Textarea id="session-observations" aria-label="Observaciones de la sesión" rows={3} maxLength={2000} value={draft.observations} onChange={e=>setDraft(d=>({...d,observations:e.target.value}))} placeholder="Notas y comentarios sobre la sesión (opcional)"/></div>
  </div>
  <div className="session-form-row">
   <span className="session-field-label" id="session-created-label">Fecha y hora de creación</span>
   <div className="session-field-control"><output className="session-timestamp" aria-label="Fecha y hora de creación" aria-labelledby="session-created-label">{formatSessionTimestamp(creationPreview)}</output><small>Se fijará de forma automática al crear la sesión; no es editable.</small></div>
  </div>
 </div></CardContent>
</Card>
<div className="context-list">
 <Card className="session-context-card">
  <CardHeader><SessionCardHeading title={t("create.pilot")} complete={Boolean(draft.pilot)}/></CardHeader>
  <CardContent><ShadcnGrid label="Pilotos disponibles" rows={resources.pilots} selection="single" selected={draft.pilot} onSelect={id=>setSingle("pilot",id)} columns={[{key:"name",title:"Nombre",value:r=>r.name},{key:"number",title:"Número",value:r=>r.number??"—"}]}/></CardContent>
 </Card>
 <Card className="session-context-card vehicle-parent-card">
  <CardHeader><SessionCardHeading title={t("create.vehicle")} complete={Boolean(draft.vehicle&&resources.vehicles.find(r=>r.id===draft.vehicle)?.setups?.some(s=>s.id===draft.setup))}/><CardDescription>Seleccioná un vehículo y después uno de sus setups.</CardDescription></CardHeader>
  <CardContent><div className="vehicle-card-grid">
   <Card className="vehicle-inner-card">
    <CardHeader><CardTitle>Seleccionar vehículo</CardTitle><CardDescription>Filtrá por categoría y tipo de vehículo.</CardDescription></CardHeader>
    <CardContent><ShadcnGrid label="Vehículos disponibles" rows={resources.vehicles} selection="single" selected={draft.vehicle} onSelect={id=>setSingle("vehicle",id)} columns={[{key:"name",title:"Vehículo",value:r=>r.name},{key:"category",title:"Categoría",value:r=>r.category??"—",filter:true},{key:"vehicleType",title:"Tipo",value:r=>r.vehicleType??"—",filter:true}]}/></CardContent>
   </Card>
   <Card className="vehicle-inner-card vehicle-setups-card">
    <CardHeader><CardTitle>Setups del vehículo</CardTitle><CardDescription>{draft.vehicle?"Configuraciones disponibles para "+itemName(draft.vehicle,resources.vehicles):"Elegí primero un vehículo."}</CardDescription></CardHeader>
    <CardContent><label className="session-form-field"><span>Setup del vehículo</span><select aria-label="Setup del vehículo" className="setup-select" disabled={!draft.vehicle||!resources.vehicles.find(r=>r.id===draft.vehicle)?.setups?.length} value={draft.setup} onChange={e=>setDraft(d=>({...d,setup:e.target.value}))}><option value="">Seleccionar setup</option>{resources.vehicles.find(r=>r.id===draft.vehicle)?.setups?.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    {draft.vehicle&&!resources.vehicles.find(r=>r.id===draft.vehicle)?.setups?.length&&<p className="setup-empty" role="status">Este vehículo no tiene setups cargados.</p>}
    {draft.setup&&<p className="setup-selected">Setup seleccionado: <strong>{resources.vehicles.find(r=>r.id===draft.vehicle)?.setups?.find(s=>s.id===draft.setup)?.name}</strong></p>}
    </CardContent>
   </Card>
  </div></CardContent>
 </Card>
 <Card className="session-context-card">
  <CardHeader><SessionCardHeading title={t("create.track")} complete={Boolean(draft.track)}/></CardHeader>
  <CardContent><ShadcnGrid label="Circuitos disponibles" rows={resources.tracks} selection="single" selected={draft.track} onSelect={id=>setSingle("track",id)} columns={[{key:"name",title:"Circuito",value:r=>r.name},{key:"distance",title:"Distancia km",value:r=>r.distanceKm??"—"},{key:"type",title:"Tipo",value:r=>r.trackType??"—",filter:true},{key:"length",title:"Long. km",value:r=>r.lengthKm??"—"}]}/></CardContent>
 </Card>
</div>
{(["targets","references"] as const).map(role=>{
 const title=t(role==="targets"?"create.targets":"create.references")
 const isObjective=role==="targets"
 return <Card className="session-context-card" key={role}>
  <CardHeader>{isObjective?<SessionCardHeading title={title} complete={draft.targets.length<=1&&!draft.targets.some(id=>draft.references.includes(id))}/>:<CardTitle>{title}</CardTitle>}
  <CardDescription>{isObjective?"Un rodaje objetivo como máximo; la selección es opcional. Si no se selecciona ninguno, esta condición también está cumplida.":"Podés elegir varias referencias, incluso sin objetivo."}</CardDescription></CardHeader>
  <CardContent><ShadcnGrid label={isObjective?"Datos objetivos":"Datos de referencia"} rows={datasets.filter(d=>!isObjective||d.type==="run")} selection={isObjective?"single":"multiple"} selected={draft[role]} onSelect={(id,checked)=>toggleMulti(role,id,checked)} disabled={d=>isObjective&&draft.references.includes(d.id)||!isObjective&&draft.targets.includes(d.id)} columns={datasetColumns()} groups={["type","track"]} groupers={[{key:"month",title:"Mes",value:d=>d.date.slice(0,7)},{key:"season",title:"Temporada",value:d=>d.season??""},{key:"category",title:"Categoría",value:d=>d.category??""}]} detail={detailDataset}/></CardContent>
 </Card>
})}
<Card className="session-context-card">
 <CardHeader><SessionCardHeading title={t("create.modules")} complete={draft.modules.length>0&&draft.modules.every(id=>{const r=resources.modules.find(x=>x.id===id);return Boolean(r&&r.enabled!==false&&moduleAvailable(r))})}/><CardDescription>Los módulos no elegibles indican requisitos pendientes.</CardDescription></CardHeader>
 <CardContent><ShadcnGrid label="Módulos de análisis" rows={resources.modules.filter(r=>r.enabled!==false)} selection="multiple" selected={draft.modules} disabled={r=>!moduleAvailable(r)} onSelect={(id,checked)=>toggleMulti("modules",id,checked)} columns={[{key:"name",title:"Módulo",value:r=>r.name},{key:"detail",title:"Descripción",value:r=>r.detail},{key:"status",title:"Requisitos",value:r=>moduleAvailable(r)?"Cumplidos":"Incumplidos"}]} detail={r=><div className="dg-detail"><strong>{r.detail}</strong>{(moduleMissing(r,draft,datasets).length?moduleMissing(r,draft,datasets):r.requirements??[]).map(x=><span key={x}>{x}</span>)}</div>}/></CardContent>
</Card>
<Card className="create-footer"><CardContent><span>{t(draftReady?"create.ready":"create.pending")}</span><Button disabled={!draftReady} onClick={createSession}><Plus size={16}/>{t("create.action")}</Button></CardContent></Card>
</div>}

{view==="session"&&active&&<div className="session-shortcuts">
<div className="session-shortcuts-group"><span>{t("nav.sources")}</span>{(["weather","run","reference","timing"] as SourceKind[]).map(key=><Button key={key} size="sm" variant="outline" onClick={()=>{setSourceKind(key);navigate("source")}}>{t("source."+key)}</Button>)}</div>
<div className="session-shortcuts-group"><span>{t("nav.context")}</span>{(["pilot","track","vehicle"] as ContextKey[]).map(key=><Button key={key} size="sm" variant="outline" onClick={()=>{setContextKind(key);navigate("context")}}>{t(names[key])}</Button>)}</div>
<div className="session-shortcuts-group"><span>{t("nav.modules")}</span>{active.modules.map(key=><Button key={key} size="sm" variant="outline" onClick={()=>{setModuleId(key);navigate("module")}}>{t("module."+key)}</Button>)}</div>
</div>}
{view==="session"&&active&&<div className="session-overview">
<Card><CardHeader><CardTitle>{t("nav.context")}</CardTitle></CardHeader><CardContent><div className="summary-grid">{ctxKinds.map(k=><button className="summary-item" key={k} onClick={()=>{setContextKind(k);navigate("context")}}><small>{t(names[k])}</small><strong>{itemName(active[k],resources[ctxToRes[k]])}</strong></button>)}</div></CardContent></Card>
<Card><CardHeader><CardTitle>{t("nav.sources")}</CardTitle></CardHeader><CardContent><div className="summary-grid"><div className="summary-item"><small>{t("session.targets")}</small><strong>{active.targets.length}</strong></div><div className="summary-item"><small>{t("session.references")}</small><strong>{active.references.length}</strong></div></div></CardContent></Card>
<Card><CardHeader><CardTitle>{t("session.modules")}</CardTitle></CardHeader><CardContent><div className="pill-row">{active.modules.map(id=><Button key={id} variant="outline" size="sm" onClick={()=>{setModuleId(id);navigate("module")}}>{t("module."+id)}<ArrowRight size={14}/></Button>)}</div></CardContent></Card>
</div>}

{view==="source"&&active&&<Card><CardHeader><CardTitle>{t("source."+sourceKind)}</CardTitle><CardDescription>{t("session.subtitle")}</CardDescription></CardHeader><CardContent>{picker("sources",t("source."+sourceKind),t("create.many"),datasets.filter(d=>sourceKind==="reference"?d.type==="run":d.type===sourceKind).map(d=>({id:d.id,name:d.name,detail:d.date+" · "+d.observation})),sourceKind==="reference"?active.references:active.targets,true,(id,v)=>toggleSource(id,v))}</CardContent></Card>}

{view==="context"&&active&&<Card><CardHeader><CardTitle>{t(names[contextKind])}</CardTitle></CardHeader><CardContent><p>{itemName(active[contextKind],resources[ctxToRes[contextKind]])}</p><small>Contexto fijado al crear la sesión.</small></CardContent></Card>}

{view==="module"&&active&&<div className="module-split"><Card className="module-top"><CardHeader><CardTitle>{t("module.demo")} · {t("module."+moduleId)}</CardTitle></CardHeader><CardContent><label className="field-label" htmlFor="lap">{t("module.lap")}</label><select id="lap" value={lap} onChange={e=>setLap(e.target.value)}><option value="best">{t("module.bestLap")}</option><option value="last">{t("module.lastLap")}</option><option value="reference">{t("module.referenceLap")}</option></select>
{moduleId==="sectors"?<div className="sector-grid">{["1","2","3"].map((id,i)=><div className="sector" key={id}><small>Sector {id}</small><strong>{["32,14","37,20","33,04"][i]} s</strong><span>{["+0,22","−0,18","−0,17"][i]} s</span></div>)}</div>:
moduleId==="gforce"?<svg className="module-graph" viewBox="0 0 550 180" role="img" aria-label={t("module.visualHint")}><path d="M0 90H550M275 0V180" stroke="#cbdde3" strokeDasharray="5 5"/>{Array.from({length:55},(_,i)=>{const a=i*2.4,r=18+i%76;return <circle key={i} cx={275+Math.cos(a)*r} cy={90+Math.sin(a)*r*.7} r="2.8" fill="#0b8992" opacity=".75"/>})}</svg>:
<svg className="module-graph" viewBox="0 0 680 180" preserveAspectRatio="none" role="img" aria-label={t("module.visualHint")}><path d="M0 35H680M0 85H680M0 135H680" stroke="#d8e5e9"/><path d="M0 146C40 92 50 50 88 98S132 170 170 121 214 35 252 69 299 157 333 113 375 16 432 61 471 149 516 108 572 30 608 67 640 111 680 50" fill="none" stroke="#0998a1" strokeWidth="3.5"/></svg>}
</CardContent></Card>
<Card className="module-chat"><CardHeader><CardTitle>{t("module.chat")}</CardTitle></CardHeader><div className="chat-messages"><div className="chat-bubble bot">{t("module.botIntro",{name:t("module."+moduleId)})}</div>{history.map((message,i)=><div key={i} className={"chat-bubble "+message.who}>{message.text}</div>)}</div><div className="chat-composer"><textarea aria-label={t("module.ask")} placeholder={t("module.ask")} value={chatDraft} onChange={e=>setChatDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat()}}}/><Button onClick={sendChat} disabled={!chatDraft.trim()}><Send size={16}/>{t("module.send")}</Button></div></Card></div>}


{view==="library"&&<div className="resources-page"><Card><CardHeader><CardTitle>{t("nav."+kind)}</CardTitle><CardDescription>{t("library.subtitle")}</CardDescription></CardHeader><CardContent><ShadcnGrid
label={t("nav."+kind)} rows={inlineId==="__new__"&&kind!=="modules"?[inlineDraft,...resources[kind]]:resources[kind]}
columns={kind==="pilots"?[
 {key:"name",title:"Nombre",value:r=>r.name,render:r=>editable(r,"name")},
 {key:"number",title:"Número",value:r=>r.number??"—",render:r=>editable(r,"number")}
]:kind==="vehicles"?[
 {key:"name",title:"Nombre",value:r=>r.name,render:r=>editable(r,"name")},
 {key:"category",title:"Categoría",value:r=>r.category??"—",render:r=>editable(r,"category")},
 {key:"brand",title:"Marca y modelo",value:r=>(r.manufacturer??"")+" "+(r.model??""),render:r=>inlineId===r.id?<div className="inline-pair">{editable(r,"manufacturer")}{editable(r,"model")}</div>:(r.manufacturer??"")+" "+(r.model??"")},
 {key:"setups",title:"Setups",value:r=>r.setups?.length??0}
]:kind==="tracks"?[
 {key:"name",title:"Nombre",value:r=>r.name,render:r=>editable(r,"name")},
 {key:"country",title:"País",value:r=>r.country??"—",render:r=>editable(r,"country"),filter:true},
 {key:"province",title:"Provincia",value:r=>r.province??"—",render:r=>editable(r,"province"),filter:true},
 {key:"type",title:"Tipo",value:r=>r.trackType??"—",render:r=>editable(r,"trackType")},
 {key:"length",title:"Longitud km",value:r=>r.lengthKm??"—"},
 {key:"segments",title:"Conjuntos",value:r=>r.segments??0}
]:[
 {key:"name",title:"Módulo",value:r=>r.name},
 {key:"enabled",title:"Estado",value:r=>r.enabled!==false?"Activado":"Desactivado"},
 {key:"needs",title:"Dependencias",value:r=>r.requirements?.length??0}
]}
groups={kind==="tracks"?["country","province"]:[]}
detail={resourceInfo}
actions={r=>kind==="modules"?<>
<Button variant="outline" size="sm" onClick={()=>setResources(old=>({...old,modules:old.modules.map(x=>x.id===r.id?{...x,enabled:x.enabled===false}:x)}))}>{r.enabled===false?"Activar":"Desactivar"}</Button>
<Button size="sm" variant="outline" aria-label={"Configurar "+r.name} onClick={()=>setModuleSettings(r.id)}><Settings2 size={14}/></Button>
<a className="dg-doc-link" href="https://github.com/martinebene/Lapex2/blob/main/docs/02-especificacion/dominio/MODULOS-ANALISIS.md" target="_blank" rel="noopener noreferrer" aria-label={"Documentación de "+r.name}><BookOpen size={14}/></a>
</>:inlineId===r.id?<><Button size="sm" onClick={saveInline} disabled={!inlineDraft.name.trim()}>Guardar</Button><Button size="sm" variant="outline" onClick={()=>setInlineId(null)}>Cancelar</Button></>:<>
<Button size="sm" variant="outline" onClick={()=>{setInlineId(r.id);setInlineDraft({...r})}}><Pencil size={14}/>Editar</Button>
<Button size="sm" variant="ghost" aria-label={"Eliminar "+r.name} onClick={()=>deleteResource(r.id)}><Trash2 size={14}/></Button>
</>}
 /></CardContent></Card>
{kind==="modules"&&moduleSettings&&<Card><CardHeader><CardTitle>Configuración general · {itemName(moduleSettings,resources.modules)}</CardTitle></CardHeader><CardContent><p>La única configuración funcional de esta vista es la disponibilidad en la selección de módulos para nuevas sesiones.</p><Button size="sm" variant="outline" onClick={()=>setModuleSettings(null)}>Cerrar</Button></CardContent></Card>}
</div>}

{view==="resourceEdit"&&<Card className="edit-card"><CardHeader><CardTitle>{t(itemId?"common.edit":"form.newResource")}</CardTitle></CardHeader><CardContent><div className="stack-fields"><label>{t("common.name")}<Input value={editName} onChange={e=>setEditName(e.target.value)}/></label><label>{t("form.description")}<Input value={editDetail} onChange={e=>setEditDetail(e.target.value)}/></label><div className="pill-row"><Button variant="outline" onClick={()=>navigate("library")}>{t("common.cancel")}</Button><Button onClick={saveResource} disabled={!editName.trim()}>{t("common.save")}</Button></div></div></CardContent></Card>}


{view==="datasets"&&<div className="data-page">
<div className="stats-grid stats-data">
<Card><CardContent className="metric"><div><small>Registros</small><strong>{datasets.length}</strong></div><Database size={20}/></CardContent></Card>
<Card><CardContent className="metric"><div><small>Circuitos</small><strong>{distinctTracks}</strong></div><Layers3 size={20}/></CardContent></Card>
<Card><CardContent className="source-stat"><strong>Fuentes de datos</strong><div>{(["run","weather","timing"] as const).map(tp=><span key={tp}>{t("source."+tp)}: <b>{datasets.filter(d=>d.type===tp).length}</b></span>)}</div></CardContent></Card>
<Card className="storage-stat"><CardContent><HardDrive size={19}/><strong>Almacenamiento</strong><span>{storageUsed} MB usados / {storageTotal} MB totales (simulado)</span><progress aria-label="Almacenamiento usado" value={storageUsed} max={storageTotal}/></CardContent></Card>
<Card className="docs-stat"><CardContent><BookOpen size={19}/><strong>Documentación</strong><a target="_blank" rel="noopener noreferrer" href="https://github.com/martinebene/Lapex2/blob/main/docs/02-especificacion/dominio/IMPORTACION-DATOS.md">Cómo importar datos</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/martinebene/Lapex2/blob/main/docs/02-especificacion/dominio/MODELO-DATOS.md">Cómo funcionan los registros</a></CardContent></Card>
</div>
<Card><CardHeader><CardTitle>{t("nav.library")}</CardTitle><CardDescription>Filtros avanzados, agrupaciones y observaciones editables.</CardDescription></CardHeader><CardContent>
<ShadcnGrid label="Biblioteca de datos" rows={datasets} columns={[
 {key:"name",title:"Nombre",value:d=>d.name,filter:true},
 {key:"id",title:"ID",value:d=>d.id,filter:true},
 {key:"date",title:"Fecha",value:d=>d.date,filter:true},
 {key:"time",title:"Hora",value:d=>d.time,filter:true},
 {key:"track",title:"Circuito",value:d=>itemName(d.track,resources.tracks),filter:true},
 {key:"type",title:"Tipo de origen",value:d=>t("source."+d.type),filter:true},
 {key:"observation",title:"Observaciones",value:d=>d.observation,filter:true,render:d=><Input aria-label={"Observaciones de "+d.name} defaultValue={d.observation} onBlur={e=>updateObservation(d.id,e.target.value)}/>}
 ]} groups={["track","type"]} groupers={[{key:"month",title:"Mes",value:d=>d.date.slice(0,7)},{key:"season",title:"Temporada",value:d=>d.season??""},{key:"category",title:"Categoría",value:d=>d.category??""}]} detail={detailDataset}
 actions={d=><><Button size="sm" variant="outline" onClick={()=>{setDatasetId(d.id);navigate("dataDetail")}}>Abrir</Button><Button size="sm" variant="outline" onClick={()=>show(t("data.shareDemo"))}><Share2 size={14}/></Button><Button size="sm" variant="ghost" aria-label={"Eliminar "+d.name} onClick={()=>removeDataset(d.id)}><Trash2 size={14}/></Button></>}/>
</CardContent></Card></div>}

{view==="dataDetail"&&targetDataset&&<Card><CardHeader><CardTitle>{targetDataset.name}</CardTitle><div className="action-buttons"><Button onClick={()=>editDataset(targetDataset.id)}><Pencil size={15}/>{t("common.edit")}</Button><Button variant="outline" onClick={()=>show(t("data.shareDemo"))}><Share2 size={15}/>{t("common.share")}</Button></div></CardHeader><CardContent><div className="summary-grid">{([["common.name",targetDataset.name],["common.date",targetDataset.date],["common.time",targetDataset.time],["common.observations",targetDataset.observation],["data.type",t("source."+targetDataset.type)],["data.device",targetDataset.device??"—"],["nav.tracks",itemName(targetDataset.track,resources.tracks)]] as [string,string][]).map(([key,val])=><div key={key} className="summary-item"><small>{t(key)}</small><strong>{val}</strong></div>)}</div></CardContent></Card>}

{view==="dataEdit"&&dataDraft&&<Card className="edit-card"><CardHeader><CardTitle>{t("common.observations")}</CardTitle><CardDescription>Las mediciones y metadatos importados no se modifican aquí.</CardDescription></CardHeader><CardContent><label className="field-label">{t("common.observations")}<Input aria-label={t("common.observations")} value={dataDraft.observation} onChange={e=>setDataDraft(old=>old?{...old,observation:e.target.value}:old)}/></label><div className="pill-row"><Button variant="outline" onClick={()=>navigate("dataDetail")}>{t("common.cancel")}</Button><Button onClick={saveDataset}>{t("common.save")}</Button></div></CardContent></Card>}

{view==="import"&&<Card className="edit-card"><CardHeader><CardTitle>{importStep===1?t("nav.import"):t("import.prep")}</CardTitle><CardDescription>{t(importStep===1?"import.noRead":"import.prepHint")}</CardDescription></CardHeader><CardContent>{importStep===1?<div className="stack-fields"><label>{t("import.file")}<Input type="file" accept=".csv,.txt,.xlsx,.xls,.json,.xrk,.xrz" onChange={e=>setFilename(e.target.files?.[0]?.name??"")}/></label><label>{t("import.type")}<select value={fileType} onChange={e=>setFileType(e.target.value)}><option value="">{t("import.select")}</option>{["CSV","TXT","XLSX","XRK","XRZ","Otro"].map(x=><option key={x}>{x}</option>)}</select></label><Button disabled={!filename||!fileType} onClick={()=>setImportStep(2)}>{t("import.continue")}<ArrowRight size={16}/></Button></div>:<div className="stack-fields"><p>{filename} · {fileType}</p><p>{t("import.prepHint")}</p><Button variant="outline" onClick={()=>setImportStep(1)}>{t("common.back")}</Button></div>}</CardContent></Card>}

{view==="settings"&&<Card className="edit-card"><CardHeader><CardTitle>{t("settings.title")}</CardTitle></CardHeader><CardContent><label className="stack-fields">{t("settings.speed")}<select><option>km/h</option><option>mph</option></select></label></CardContent></Card>}
{view==="account"&&<Card className="edit-card"><CardHeader><CardTitle>{t("nav.account")}</CardTitle></CardHeader><CardContent><p>{t("profile.user")} · {t("profile.plan",{plan})}</p><div className="pill-row"><Button onClick={()=>profileAction("membership")}>{t("profile.membership")}</Button><Button variant="outline" onClick={()=>profileAction("usage")}>{t("profile.usage")}</Button></div></CardContent></Card>}
{view==="help"&&<Card><CardHeader><CardTitle>{t("help.title")}</CardTitle><CardDescription>{t("help.subtitle")}</CardDescription></CardHeader></Card>}
</SidebarInset>
{modal&&<div className="modal-shade" onClick={()=>setModal(null)}><div role="dialog" aria-modal="true" aria-label={t("profile."+modal)} className="modal-body" onClick={e=>e.stopPropagation()}><div className="modal-header"><h2>{t("profile."+modal)}</h2><button onClick={()=>setModal(null)} aria-label={t("common.close")}><X size={19}/></button></div>{modal==="usage"&&<p>{t("data.records")}: {datasets.length} · {t("nav.saved")}: {sessions.length}</p>}{modal==="membership"&&<div className="pill-row"><Button onClick={()=>{setPlan(p=>p==="Free"?"Pro":"Free");setModal(null)}}>{t("profile.plan",{plan})} <Check size={15}/></Button></div>}<Button variant="outline" onClick={()=>setModal(null)}>{t("common.close")}</Button></div></div>}
{toast&&<div className="toast" role="status">{toast}</div>}
</SidebarProvider>
}
