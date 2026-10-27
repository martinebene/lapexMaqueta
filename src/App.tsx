
import { useState } from "react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Plus, FolderOpen, Upload, Check, Trash2, Pencil, Share2, ArrowRight, Send, X, Database, Layers3, BookOpen, HardDrive, Settings2, CircleCheck, CircleX, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ResourceForm } from "./ResourceForm"
import { SetupForm } from "./SetupForm"
import { SeriesView } from "./SeriesView"
import { seriesOf, DURATION } from "./seriesMock"
import { initialDatasets, initialResources, initialSessions, emptyDraft, validDraft, moduleMissing } from "./data"
import { ShadcnGrid } from "./ShadcnGrid"
import type { GridColumn } from "./ShadcnGrid"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar07 } from "./Sidebar07"
import type { Draft, Dataset, Resource, ResourceKind, Session, SourceKind, Setup } from "./data"

type Mode="analysis"|"resources"|"data"|"config"|"help"
type View="home"|"new"|"session"|"source"|"context"|"module"|"library"|"resourceEdit"|"setupEdit"|"moduleConfig"|"moduleDoc"|"datasets"|"dataDetail"|"dataEdit"|"series"|"import"|"settings"|"account"|"documentation"|"faq"|"version"
type ContextKey="pilot"|"track"|"vehicle"
type PickItem={id:string;name:string;detail:string}
const ctxKinds:ContextKey[]=["pilot","track","vehicle"]
const ctxToRes:Record<ContextKey,ResourceKind>={pilot:"pilots",track:"tracks",vehicle:"vehicles"}
const names:Record<ContextKey,string>={pilot:"create.pilot",track:"create.track",vehicle:"create.vehicle"}
function uniq(list:string[]){return [...new Set(list)]}
function itemName(id:string,items:Resource[]){return items.find(x=>x.id===id)?.name??"—"}
function formatSessionTimestamp(iso:string){return new Date(iso).toLocaleString("es-AR",{dateStyle:"short",timeStyle:"short"})}
const compiledAt=import.meta.env.VITE_DEPLOYED_AT??""
const buildLabel=compiledAt?"Versión: "+new Date(compiledAt).toLocaleString("es-AR",{timeZone:"America/Argentina/Buenos_Aires",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:false})+" ART":"Versión de desarrollo"
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
const [itemId,setItemId]=useState<string|null>(null)
const [resourceDraft,setResourceDraft]=useState<Resource>({id:"",name:"",detail:""})
const [resourceOriginal,setResourceOriginal]=useState<Resource|null>(null)
const [resourceDirty,setResourceDirty]=useState(false)
const [setupDraft,setSetupDraft]=useState<Setup>({id:"",name:"",parameters:{}})
const [setupOriginal,setSetupOriginal]=useState<Setup>({id:"",name:"",parameters:{}})
const [setupId,setSetupId]=useState<string|null>(null)
const [datasetId,setDatasetId]=useState("")
 const [seriesId,setSeriesId]=useState("")
 const [removedSeries,setRemovedSeries]=useState<Record<string,string[]>>({})
 const [docSection,setDocSection]=useState<"import"|"records">("import")
const [dataDraft,setDataDraft]=useState<Dataset|null>(null)
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
function hasChanges(){
 if(view==="resourceEdit")return resourceDirty
 if(view==="new")return JSON.stringify(draft)!==JSON.stringify(emptyDraft())
 if(view==="setupEdit")return JSON.stringify(setupDraft)!==JSON.stringify(setupOriginal)
 if(view==="dataEdit")return dataDraft!==null&&JSON.stringify(dataDraft)!==JSON.stringify(targetDataset)
 return false
}
function canLeave(){return !hasChanges()||window.confirm("Hay cambios sin guardar. ¿Querés descartarlos y salir?")}
function navigate(target:View,group?:Mode,skipGuard=false){
 if(target!==view&&!skipGuard&&!canLeave())return
 setView(target);if(group)setMode(group)
}
function selectMode(m:Mode){
 if(!canLeave())return
 setMode(m);setView(m==="analysis"?(active?"session":"home"):m==="resources"?"library":m==="data"?"datasets":m==="help"?"documentation":"settings")
 if(m==="resources")setKind("pilots")
}
function beginNew(){setDraft(emptyDraft());setCreationPreview(new Date().toISOString());navigate("new","analysis")}
function openSession(id:string){if(!sessions.some(s=>s.id===id))return;setActiveId(id);setSelectedId(id);navigate("session","analysis")}
function createSession(){if(!validDraft(draft,resources,datasets))return;const id="s"+Date.now();setSessions(old=>[{...draft,id,name:draft.name.trim(),observations:draft.observations.trim(),createdAt:new Date().toISOString()},...old]);setActiveId(id);setSelectedId(id);setModuleId(draft.modules[0]);setView("session");setMode("analysis");show(t("create.created"))}
function setSingle(key:ContextKey,value:string){setDraft(old=>({...old,[key]:value,...(key==="vehicle"?{setup:""}:key==="track"?{segmentSetIds:[]}:{})}))}
function toggleMulti(key:"targets"|"references"|"modules",id:string,checked:boolean){
setDraft(old=>{
const next={...old,[key]:checked?(key==="targets"?[id]:uniq([...old[key],id])):old[key].filter(x=>x!==id)};
if(checked&&key==="targets")next.references=old.references.filter(x=>x!==id);
if(checked&&key==="references")next.targets=old.targets.filter(x=>x!==id);
return next;
})
}
function openLibrary(k:ResourceKind){if(!canLeave())return;setKind(k);setModuleSettings(null);navigate("library","resources",true)}
function beginResource(id:string|null=null,forcedKind?:ResourceKind){
  const currentKind=forcedKind??kind
 const original=id?resources[currentKind].find(r=>r.id===id):null
 const base=original?{...original}:{id:"",name:"",detail:"",...(currentKind==="tracks"?{trackType:"",segmentSets:[]}:currentKind==="vehicles"?{setups:[],vehicleType:""}:{})}
 setKind(currentKind);setItemId(id);setResourceOriginal(base);setResourceDraft(base);setResourceDirty(false)
 navigate("resourceEdit","resources")
}
function saveResource(resource:Resource){
 setResources(old=>({...old,[kind]:itemId?old[kind].map(x=>x.id===itemId?{...resource,id:x.id,vehicleType:kind==="vehicles"?x.vehicleType:resource.vehicleType}:x):[...old[kind],{...resource,id:"r"+Date.now()}]}))
 setItemId(null);setResourceOriginal(null);setResourceDirty(false);setView("library");setMode("resources");show(t("form.saved"))
}
function beginSetup(id:string|null,current:Resource){
 if(!itemId)return
 const original=id?current.setups?.find(x=>x.id===id):null
 const base:Setup=original?{...original,parameters:{...original.parameters}}:{id:"",name:"",date:"",detail:"",parameters:{}}
 setResourceDraft(current);setSetupId(id);setSetupDraft(base);setSetupOriginal(base)
 setView("setupEdit")
}
function saveSetup(next:Setup){
 if(!itemId)return
 const saved={...next,id:setupId??"su"+Date.now()}
 const replace=(items:Setup[])=>(setupId?items.map(x=>x.id===setupId?saved:x):[...items,saved])
 setResources(old=>({...old,vehicles:old.vehicles.map(v=>v.id===itemId?{...v,setups:replace(v.setups??[])}:v)}))
 setResourceDraft(old=>({...old,setups:replace(old.setups??[])}))
 setResourceOriginal(old=>old?{...old,setups:replace(old.setups??[])}:old)
 setSetupOriginal(saved);setView("resourceEdit");show("Setup guardado en la maqueta")
}
function goBack(){
 if(view==="setupEdit")return navigate("resourceEdit","resources")
 if(view==="resourceEdit")return openLibrary(kind)
 if(view==="dataEdit")return navigate("dataDetail","data")
 if(view==="dataDetail")return navigate("datasets","data")
  if(view==="series")return navigate("dataDetail","data")
 if(view==="new")return navigate("home","analysis")
 if(["source","context","module"].includes(view))return navigate("session","analysis")
 if(["moduleConfig","moduleDoc"].includes(view))return openLibrary("modules")
}
function deleteResource(id:string){if(!window.confirm(t("data.deleteConfirm")))return;setResources(old=>({...old,[kind]:old[kind].filter(x=>x.id!==id)}));show(t("data.deleted"))}
function openDocumentation(section:"import"|"records"="import"){setDocSection(section);navigate("documentation","help")}
 function openSeries(id:string){setSeriesId(id);navigate("series","data")}
 function removeSeries(id:string){if(!targetDataset||!window.confirm("¿Eliminar esta serie de prueba?"))return;setRemovedSeries(old=>({...old,[targetDataset.id]:[...(old[targetDataset.id]??[]),id]}));show("Serie eliminada (simulación).")}
 function editDataset(id:string){const d=datasets.find(x=>x.id===id);if(!d)return;setDatasetId(id);setDataDraft({...d});navigate("dataEdit","data")}
function saveDataset(){if(!dataDraft?.name.trim())return;setDatasets(old=>old.map(x=>x.id===dataDraft.id?{...dataDraft,name:dataDraft.name.trim()}:x));setView("dataDetail");setMode("data");show(t("form.saved"))}
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
if(["moduleConfig","moduleDoc"].includes(view)){
 return [first,{label:t("nav.modules"),onClick:()=>openLibrary("modules")},{label:itemName(moduleSettings??"",resources.modules)},{label:view==="moduleDoc"?"Documentación":"Configuración"}]
}
if(["library","resourceEdit","setupEdit"].includes(view)){
return [first,{label:t("nav."+kind),onClick:()=>openLibrary(kind)},
 ...(view!=="library"?[{label:itemId?itemName(itemId,resources[kind]):t("common.new"),onClick:view==="setupEdit"?()=>navigate("resourceEdit","resources"):undefined}]:[]),
 ...(view==="setupEdit"?[{label:"Setups"},{label:setupId?"Editar":"Nuevo"}]:[])]
}
if(["datasets","dataDetail","dataEdit","series"].includes(view)){
return [first,{label:t("nav.library"),onClick:()=>navigate("datasets","data")},...(view!=="datasets"?[{label:targetDataset?.name??t("meta.notFound")}]:[]),...(view==="dataEdit"?[{label:t("common.edit")}]:[]),...(view==="series"?[{label:targetDataset?seriesOf(targetDataset).find(s=>s.id===seriesId)?.name??"Serie":"Serie"}]:[])]
}
return view==="documentation"||view==="faq"||view==="version"?[first,{label:view==="documentation"?"Documentación":view==="faq"?"FAQ":"Versión"}]:[first,{label:t(view==="import"?"nav.import":view==="account"?"nav.account":"nav.preferences")}]
}
function pageTitle(){
if(view==="new")return t("create.title")
if(view==="home")return t("home.title")
if(view==="session")return active?.name??t("home.title")
if(view==="source")return t("source."+sourceKind)
if(view==="context")return t(names[contextKind])
if(view==="module")return t("module."+moduleId)
if(view==="library")return t("nav."+kind)
if(view==="resourceEdit")return (itemId?"Editar ":"Nuevo ")+(kind==="pilots"?"piloto":kind==="vehicles"?"vehículo":"circuito")
if(view==="setupEdit")return (setupId?"Editar ":"Nuevo ")+"setup · "+resourceDraft.name
 if(view==="moduleConfig")return "Configuración · "+itemName(moduleSettings??"",resources.modules)
 if(view==="moduleDoc")return "Documentación · "+itemName(moduleSettings??"",resources.modules)
if(view==="datasets")return t("nav.library")
if(view==="dataDetail"||view==="dataEdit")return targetDataset?.name??t("meta.notFound")
 if(view==="series")return "Serie · "+(targetDataset?seriesOf(targetDataset).find(s=>s.id===seriesId)?.name??"—":"—")
 if(view==="documentation")return "Documentación"
 if(view==="faq")return "Preguntas frecuentes"
 if(view==="version")return "Versión de Lapex"
return t(view==="import"?"nav.import":view==="account"?"nav.account":"nav.preferences")
}
function pageSubtitle(){
if(view==="home")return t("home.subtitle")
if(view==="new")return t("create.subtitle")
if(view==="session")return t("session.subtitle")
if(view==="module")return ""
if(view==="library")return t("library.subtitle")
if(view==="datasets")return t("data.subtitle")
if(view==="import")return t("import.subtitle")
if(view==="documentation")return "Guía de uso de la aplicación · contenido preliminar"
 if(view==="faq")return "Preguntas frecuentes · contenido preliminar"
return ""
}
const chatKey=active?.id+"/"+moduleId;
const history=chats[chatKey]??[];
return <SidebarProvider className="lapex-app style-nova sidebar07-layout" defaultOpen>
<AppSidebar07 mode={mode} plan={plan} buildTime={buildLabel}
  onNewSession={beginNew}
  onOpenSessions={()=>{setActiveId(null);navigate("home","analysis")}}
  onResource={openLibrary}
  onData={key=>{if(key==="import")setImportStep(1);navigate(key,"data")}}
  onConfig={key=>navigate(key,"config")}
   onHelp={key=>key==="documentation"?openDocumentation():navigate(key,"help")}
  onProfile={profileAction}
/>
<SidebarInset className="workspace">
<div className="sidebar07-breadcrumb-bar"><SidebarTrigger aria-label="Alternar barra lateral"/><span className="sidebar07-breadcrumb-divider" aria-hidden="true"/>{(["new","source","context","module","resourceEdit","setupEdit","moduleConfig","moduleDoc","dataDetail","dataEdit","series"].includes(view))&&<Button className="breadcrumb-back" type="button" variant="ghost" size="sm" onClick={goBack}><ArrowLeft size={15}/>Volver</Button>}<nav className="breadcrumbs" aria-label="Breadcrumb">{crumbs().map((c,i)=><span key={i}>{i>0&&<span className="crumb-sep">/</span>}{c.onClick?<button onClick={c.onClick}>{c.label}</button>:<span aria-current="page">{c.label}</span>}</span>)}</nav></div>
<header className="screen-header"><div><h1>{pageTitle()}</h1>{pageSubtitle()&&<p>{pageSubtitle()}</p>}</div>
<div className="page-tools">{view==="new"&&<Button variant="outline" onClick={()=>navigate("home","analysis")}>{t("common.cancel")}</Button>}{view==="library"&&kind!=="modules"&&<Button onClick={()=>beginResource()}><Plus size={15}/>{t("common.new")}</Button>}{view==="datasets"&&<Button onClick={()=>{setImportStep(1);navigate("import","data")}}><Upload size={16}/>{t("nav.import")}</Button>}</div></header>

{view==="home"&&<Card className="open-sessions-card">
<CardHeader><CardTitle>{t("nav.saved")}</CardTitle><CardDescription>{t("common.records",{count:sessions.length})} · Seleccioná una sesión y abrila.</CardDescription></CardHeader>
<CardContent><ShadcnGrid label="Sesiones guardadas" rows={sessions}
 selection="single" selected={selectedId} onSelect={id=>setSelectedId(id)}
 columns={[
 {key:"name",title:"Nombre",value:s=>s.name,filter:true},
 {key:"pilot",title:"Piloto",value:s=>itemName(s.pilot,resources.pilots),filter:true},
 {key:"vehicle",title:"Vehículo",value:s=>itemName(s.vehicle,resources.vehicles),filter:true},
 {key:"track",title:"Circuito",value:s=>itemName(s.track,resources.tracks),filter:true},
 {key:"createdAt",title:"Fecha de creación",value:s=>s.createdAt?formatSessionTimestamp(s.createdAt):"Sin fecha"}
 ]}
 groups={["pilot","vehicle","track"]}
 advancedFilterColumns={[{key:"objective",title:"Datos objetivos",value:s=>s.targets.length?"Con objetivo":"Sin objetivo"},{key:"moduleCount",title:"Cantidad de módulos",value:s=>String(s.modules.length)}]}/>
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
    <CardContent><ShadcnGrid label="Vehículos disponibles" tableHeight="264px" rows={resources.vehicles} selection="single" selected={draft.vehicle} onSelect={id=>setSingle("vehicle",id)} columns={[{key:"name",title:"Vehículo",value:r=>r.name},{key:"category",title:"Categoría",value:r=>r.category??"—",filter:true},{key:"vehicleType",title:"Tipo",value:r=>r.vehicleType??"—",filter:true}]}/></CardContent>
   </Card>
   <Card className="vehicle-inner-card vehicle-setups-card">
    <CardHeader><CardTitle>Seleccionar setup del vehículo</CardTitle><CardDescription>{draft.vehicle?"Configuraciones disponibles para "+itemName(draft.vehicle,resources.vehicles):"Elegí primero un vehículo."}</CardDescription></CardHeader>
    <CardContent>
      <ShadcnGrid label="Setups del vehículo" tableHeight="264px"
        rows={resources.vehicles.find(r=>r.id===draft.vehicle)?.setups??[]}
        selection="single" selected={draft.setup}
        onSelect={id=>setDraft(d=>({...d,setup:id}))}
        emptyMessage={draft.vehicle?"No hay registros":"Elegí primero un vehículo."}
        columns={[{key:"name",title:"Nombre",value:s=>s.name},{key:"date",title:"Fecha",value:s=>s.date??"—"}]}/>
      {draft.vehicle&&!resources.vehicles.find(r=>r.id===draft.vehicle)?.setups?.length&&<p className="setup-empty" role="status">Este vehículo no tiene setups cargados.</p>}
    </CardContent>
   </Card>
  </div></CardContent>
 </Card>
 <Card className="session-context-card">
  <CardHeader><SessionCardHeading title={t("create.track")} complete={Boolean(draft.track)}/><CardDescription>El circuito es obligatorio; las segmentaciones son opcionales.</CardDescription></CardHeader>
  <CardContent><div className="vehicle-card-grid track-card-grid">
   <Card className="vehicle-inner-card">
    <CardHeader><CardTitle>Seleccionar circuito</CardTitle><CardDescription>Un circuito por sesión</CardDescription></CardHeader>
    <CardContent><ShadcnGrid label="Circuitos disponibles" tableHeight="264px" rows={resources.tracks} selection="single" selected={draft.track} onSelect={id=>setSingle("track",id)} columns={[{key:"name",title:"Circuito",value:r=>r.name},{key:"type",title:"Trazado",value:r=>r.trackType??"—",filter:true},{key:"length",title:"Long. km",value:r=>r.lengthKm??"—"}]}/></CardContent>
   </Card>
   <Card className="vehicle-inner-card">
    <CardHeader><CardTitle>Conjuntos de segmentación</CardTitle><CardDescription>{draft.track?"Opcional: uno o varios conjuntos":"Elegí primero un circuito"}</CardDescription></CardHeader>
    <CardContent><ShadcnGrid label="Segmentaciones del circuito" tableHeight="264px" rows={resources.tracks.find(r=>r.id===draft.track)?.segmentSets??[]} selection="multiple" selected={draft.segmentSetIds??[]} onSelect={(id,checked)=>setDraft(d=>({...d,segmentSetIds:checked?uniq([...d.segmentSetIds,id]):d.segmentSetIds.filter(x=>x!==id)}))} emptyMessage={draft.track?"Este circuito no tiene conjuntos cargados":"Elegí primero un circuito."} columns={[{key:"name",title:"Nombre",value:x=>x.name||"Sin nombre"},{key:"type",title:"Tipo",value:x=>x.type==="analysis"?"Parciales":"Nomenclatura de curvas"}]}/></CardContent>
   </Card>
  </div></CardContent>
 </Card>
</div>
{(["targets","references"] as const).map(role=>{
 const title=t(role==="targets"?"create.targets":"create.references")
 const isObjective=role==="targets"
 return <Card className="session-context-card" key={role}>
  <CardHeader>{isObjective?<SessionCardHeading title={title} complete={draft.targets.length<=1&&!draft.targets.some(id=>draft.references.includes(id))}/>:<CardTitle>{title}</CardTitle>}
  <CardDescription>{isObjective?"Un rodaje objetivo como máximo; la selección es opcional. Si no se selecciona ninguno, esta condición también está cumplida.":"Podés elegir varias referencias, incluso sin objetivo."}</CardDescription></CardHeader>
  <CardContent><ShadcnGrid label={isObjective?"Datos objetivos":"Datos de referencia"} rows={datasets.filter(d=>!isObjective||d.type==="run")} selection={isObjective?"single":"multiple"} selected={draft[role]} onSelect={(id,checked)=>toggleMulti(role,id,checked)} disabled={d=>isObjective&&draft.references.includes(d.id)||!isObjective&&draft.targets.includes(d.id)} columns={datasetColumns()} groups={["type","track"]} groupers={[{key:"month",title:"Mes",value:d=>d.date?.slice(0,7)??""},{key:"season",title:"Temporada",value:d=>d.season??""},{key:"category",title:"Categoría",value:d=>d.category??""}]} advancedFilterColumns={[{key:"month",title:"Mes",value:d=>d.date?.slice(0,7)??""},{key:"season",title:"Temporada",value:d=>d.season??""},{key:"category",title:"Categoría",value:d=>d.category??""}]} detail={detailDataset}/></CardContent>
 </Card>
})}
<Card className="session-context-card">
 <CardHeader><SessionCardHeading title={t("create.modules")} complete={draft.modules.length>0&&draft.modules.every(id=>{const r=resources.modules.find(x=>x.id===id);return Boolean(r&&r.enabled!==false&&moduleAvailable(r))})}/><CardDescription>Activá los módulos habilitados. Los que incumplen requisitos permanecen desactivados.</CardDescription></CardHeader>
 <CardContent><ShadcnGrid label="Módulos de análisis" rows={resources.modules.filter(r=>r.enabled!==false)}
 leadingControl={r=><Switch aria-label={"Activar módulo "+r.name} checked={draft.modules.includes(r.id)&&moduleAvailable(r)} disabled={!moduleAvailable(r)} onCheckedChange={checked=>toggleMulti("modules",r.id,checked)}/>}
 columns={[{key:"name",title:"Módulo",value:r=>r.name},{key:"detail",title:"Descripción",value:r=>r.detail},{key:"status",title:"Requisitos",value:r=>moduleAvailable(r)?"Cumplidos":"Incumplidos",status:r=>moduleAvailable(r)?"success":"error"}]}
 detail={r=><div className="dg-detail"><strong>{r.detail}</strong>{(moduleMissing(r,draft,datasets).length?moduleMissing(r,draft,datasets):r.requirements??[]).map(x=><span key={x}>{x}</span>)}</div>}/></CardContent>
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


{view==="library"&&<div className="resources-page"><Card>
<CardHeader><CardTitle>{t("nav."+kind)}</CardTitle><CardDescription>{t("library.subtitle")}</CardDescription></CardHeader>
<CardContent><ShadcnGrid label={t("nav."+kind)} rows={resources[kind]}
 columns={kind==="pilots"?[
 {key:"name",title:"Nombre",value:r=>r.name},
 {key:"number",title:"Número",value:r=>r.number??"—"}
 ]:kind==="vehicles"?[
 {key:"name",title:"Nombre",value:r=>r.name},
 {key:"category",title:"Categoría",value:r=>r.category??"—",filter:true},
 {key:"brand",title:"Marca y modelo",value:r=>(r.manufacturer??"")+" "+(r.model??"")},
 {key:"setups",title:"Setups",value:r=>r.setups?.length??0}
 ]:kind==="tracks"?[
 {key:"name",title:"Nombre",value:r=>r.name},
 {key:"country",title:"País",value:r=>r.country??"—",filter:true},
 {key:"province",title:"Provincia",value:r=>r.province??"—",filter:true},
 {key:"type",title:"Tipo",value:r=>r.trackType??"—"},
 {key:"length",title:"Longitud km",value:r=>r.lengthKm??"—"},
 {key:"segments",title:"Conjuntos",value:r=>r.segmentSets?.length??r.segments??0}
 ]:[
 {key:"name",title:"Módulo",value:r=>r.name,width:30},
 {key:"enabled",title:"Estado",value:r=>r.enabled!==false?"Activado":"Desactivado",status:r=>r.enabled!==false?"success":"error",width:12},
 {key:"needs",title:"Dependencias",value:r=>r.requirements?.length??0,width:16}
 ]}
 searchable={kind!=="modules"} compact={kind==="modules"}
 groups={kind==="tracks"?["country","province"]:[]}
 detail={resourceInfo}
 leadingControl={kind==="modules"?(r=><Switch aria-label={"Habilitar módulo "+r.name} checked={r.enabled!==false} onCheckedChange={checked=>setResources(old=>({...old,modules:old.modules.map(x=>x.id===r.id?{...x,enabled:checked}:x)}))}/>):undefined}
 actions={r=>kind==="modules"?<>
  <Button size="sm" variant="outline" aria-label={"Configurar "+r.name} onClick={()=>{setModuleSettings(r.id);navigate("moduleConfig","resources")}}><Settings2 size={14}/>Configurar</Button>
  <Button size="sm" variant="outline" aria-label={"Documentación de "+r.name} onClick={()=>{setModuleSettings(r.id);navigate("moduleDoc","resources")}}><BookOpen size={14}/>Documentación</Button>
 </>:<>
  <Button size="sm" variant="outline" onClick={()=>beginResource(r.id)}><Pencil size={14}/>Editar</Button>
  <Button size="sm" variant="ghost" aria-label={"Eliminar "+r.name} onClick={()=>deleteResource(r.id)}><Trash2 size={14}/></Button>
 </>}/>
</CardContent></Card></div>}

{view==="resourceEdit"&&kind!=="modules"&&<ResourceForm key={kind+":"+(itemId??"new")} kind={kind} initial={resourceDraft} editing={Boolean(itemId)} dirtyBaseline={resourceOriginal??resourceDraft} onDirtyChange={setResourceDirty} onEditSetup={beginSetup} onShare={what=>show("Compartir "+what+": disponible próximamente (maqueta).")} onSave={saveResource} onCancel={()=>navigate("library","resources")}/>}
{view==="setupEdit"&&itemId&&<SetupForm vehicleName={resourceDraft.name} vehicleType={resourceDraft.vehicleType??""}
  setup={setupDraft} onChange={setSetupDraft} onSave={saveSetup} onCancel={()=>navigate("resourceEdit","resources")}/>}

{["moduleConfig","moduleDoc"].includes(view)&&moduleSettings&&(()=>{const module=resources.modules.find(x=>x.id===moduleSettings);if(!module)return null;return <Card className="edit-card module-full-width">
 <CardHeader><CardTitle>{view==="moduleDoc"?"Documentación":"Configurar módulo"} · {module.name}</CardTitle><CardDescription>{module.detail}</CardDescription></CardHeader>
 <CardContent><div className="stack-fields">
  {view==="moduleDoc"?<>
    <h3>Descripción y requisitos</h3><p>{module.detail}</p>
    <p>{(module.requirements??[]).join("; ")||"No hay requisitos declarados en la maqueta."}</p>
    <p>Los módulos son código integrado de Lapex. Esta página representa la documentación propia del módulo; sus contratos completos se desarrollan en los hitos correspondientes.</p>
    <a href="https://github.com/martinebene/Lapex2/blob/main/docs/02-especificacion/dominio/MODULOS-ANALISIS.md" target="_blank" rel="noopener noreferrer">Consultar especificación oficial <BookOpen size={14}/></a>
  </>:<>
    <label className="module-config-row">Disponibilidad para nuevas sesiones <Switch aria-label={"Habilitar módulo "+module.name} checked={module.enabled!==false} onCheckedChange={checked=>setResources(old=>({...old,modules:old.modules.map(x=>x.id===module.id?{...x,enabled:checked}:x)}))}/></label>
    <p>Desactivar el módulo solamente lo retira de las nuevas selecciones; no afecta sesiones existentes.</p>
  </>}
  <Button variant="outline" onClick={()=>openLibrary("modules")}>Volver a módulos</Button>
 </div></CardContent></Card>})()}

{view==="datasets"&&<div className="data-page">
<div className="stats-grid stats-data">
<Card><CardContent className="metric"><div><small>Registros</small><strong>{datasets.length}</strong></div><Database size={20}/></CardContent></Card>
<Card><CardContent className="metric"><div><small>Circuitos</small><strong>{distinctTracks}</strong></div><Layers3 size={20}/></CardContent></Card>
<Card><CardContent className="source-stat"><strong>Fuentes de datos</strong><div>{(["run","weather","timing"] as const).map(tp=><span key={tp}>{t("source."+tp)}: <b>{datasets.filter(d=>d.type===tp).length}</b></span>)}</div></CardContent></Card>
<Card className="storage-stat"><CardContent><HardDrive size={19}/><strong>Almacenamiento</strong><span>{storageUsed} MB usados / {storageTotal} MB totales (simulado)</span><progress aria-label="Almacenamiento usado" value={storageUsed} max={storageTotal}/></CardContent></Card>
<Card className="docs-stat"><CardContent><BookOpen size={19}/><strong>Documentación</strong><button type="button" className="docs-link" onClick={()=>openDocumentation("import")}>Cómo importar datos</button><button type="button" className="docs-link" onClick={()=>openDocumentation("records")}>Cómo funcionan los registros</button></CardContent></Card>
</div>
<Card><CardHeader><CardTitle>{t("nav.library")}</CardTitle><CardDescription>Filtros avanzados y agrupaciones; las observaciones se editan dentro de cada registro.</CardDescription></CardHeader><CardContent>
<ShadcnGrid label="Biblioteca de datos" rows={datasets} columns={[
 {key:"name",title:"Nombre",value:d=>d.name,filter:true},
 {key:"id",title:"ID",value:d=>d.id,filter:true},
 {key:"date",title:"Fecha",value:d=>d.date,filter:true},
 {key:"time",title:"Hora",value:d=>d.time,filter:true},
 {key:"track",title:"Circuito",value:d=>itemName(d.track,resources.tracks),filter:true},
 {key:"type",title:"Tipo de origen",value:d=>t("source."+d.type),filter:true},
 {key:"observation",title:"Observaciones",value:d=>d.observation,filter:true}
 ]} groups={["track","type"]} groupers={[{key:"month",title:"Mes",value:d=>d.date?.slice(0,7)??""},{key:"season",title:"Temporada",value:d=>d.season??""},{key:"category",title:"Categoría",value:d=>d.category??""}]} advancedFilterColumns={[{key:"month",title:"Mes",value:d=>d.date?.slice(0,7)??""},{key:"season",title:"Temporada",value:d=>d.season??""},{key:"category",title:"Categoría",value:d=>d.category??""}]} detail={detailDataset}
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
