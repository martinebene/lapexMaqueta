
import { useMemo, useState } from "react"
import type { ChangeEvent, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Plus, FolderOpen, Upload, Check, Trash2, Pencil, Share2, ArrowRight, Search, BarChart3, Send, X, Database, Layers3, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { initialDatasets, initialResources, initialSessions, emptyDraft, validDraft } from "./data"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar07 } from "./Sidebar07"
import type { Draft, Dataset, Resource, ResourceKind, Session, SourceKind } from "./data"

type Mode="analysis"|"resources"|"data"|"config"
type View="home"|"new"|"session"|"source"|"context"|"module"|"library"|"resourceEdit"|"datasets"|"dataDetail"|"dataEdit"|"import"|"settings"|"account"|"help"
type ContextKey="pilot"|"track"|"vehicle"
type PickItem={id:string;name:string;detail:string}
const sources:SourceKind[]=["weather","run","reference","timing"]
const ctxKinds:ContextKey[]=["pilot","track","vehicle"]
const ctxToRes:Record<ContextKey,ResourceKind>={pilot:"pilots",track:"tracks",vehicle:"vehicles"}
const names:Record<ContextKey,string>={pilot:"create.pilot",track:"create.track",vehicle:"create.vehicle"}
function uniq(list:string[]){return [...new Set(list)]}
function itemName(id:string,items:Resource[]){return items.find(x=>x.id===id)?.name??"—"}

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
const [sourceKind,setSourceKind]=useState<SourceKind>("run")
const [contextKind,setContextKind]=useState<ContextKey>("pilot")
const [moduleId,setModuleId]=useState("best")
const [kind,setKind]=useState<ResourceKind>("pilots")
const [itemId,setItemId]=useState<string|null>(null)
const [editName,setEditName]=useState("")
const [editDetail,setEditDetail]=useState("")
const [datasetId,setDatasetId]=useState("")
const [dataDraft,setDataDraft]=useState<Dataset|null>(null)
const [filter,setFilter]=useState({query:"",type:"",pilot:"",track:""})
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
const visibleData=useMemo(()=>datasets.filter(d=>(!filter.type||d.type===filter.type)&&(!filter.pilot||d.pilot===filter.pilot)&&(!filter.track||d.track===filter.track)&&(!filter.query||[d.name,d.observation].join(" ").toLowerCase().includes(filter.query.toLowerCase()))),[datasets,filter])
const distinct=(field:"track"|"pilot")=>new Set(visibleData.map(d=>d[field]).filter(Boolean)).size
const average=visibleData.length/new Set(visibleData.map(d=>d.date)).size || 0

function show(message:string){setToast(message);window.setTimeout(()=>setToast(""),2800)}
function navigate(target:View,group?:Mode){setView(target);if(group)setMode(group)}
function selectMode(m:Mode){setMode(m);setView(m==="analysis"?(active?"session":"home"):m==="resources"?"library":m==="data"?"datasets":"settings");if(m==="resources")setKind("pilots")}
function beginNew(){setDraft(emptyDraft());navigate("new","analysis")}
function openSession(id:string){if(!sessions.some(s=>s.id===id))return;setActiveId(id);setSelectedId(id);navigate("session","analysis")}
function createSession(){if(!validDraft(draft,resources,datasets))return;const id="s"+Date.now();setSessions(old=>[{...draft,id,name:draft.name.trim()},...old]);setActiveId(id);setSelectedId(id);setModuleId(draft.modules[0]);navigate("session","analysis");show(t("create.created"))}
function setSingle(key:ContextKey,value:string){setDraft(old=>({...old,[key]:value}))}
function toggleMulti(key:"targets"|"references"|"modules",id:string,checked:boolean){
setDraft(old=>{
const next={...old,[key]:checked?uniq([...old[key],id]):old[key].filter(x=>x!==id)};
if(checked&&key==="targets")next.references=old.references.filter(x=>x!==id);
if(checked&&key==="references")next.targets=old.targets.filter(x=>x!==id);
return next;
})
}
function openLibrary(k:ResourceKind){setKind(k);navigate("library","resources")}
function editResource(id:string|null){const item=resources[kind].find(x=>x.id===id);setItemId(id);setEditName(item?.name??"");setEditDetail(item?.detail??"");navigate("resourceEdit","resources")}
function saveResource(){if(!editName.trim())return;setResources(old=>({...old,[kind]:itemId?old[kind].map(x=>x.id===itemId?{...x,name:editName.trim(),detail:editDetail}:x):[...old[kind],{id:"r"+Date.now(),name:editName.trim(),detail:editDetail}]}));navigate("library","resources");show(t("form.saved"))}
function deleteResource(id:string){if(!window.confirm(t("data.deleteConfirm")))return;setResources(old=>({...old,[kind]:old[kind].filter(x=>x.id!==id)}));show(t("data.deleted"))}
function editDataset(id:string){const d=datasets.find(x=>x.id===id);if(!d)return;setDatasetId(id);setDataDraft({...d});navigate("dataEdit","data")}
function saveDataset(){if(!dataDraft?.name.trim())return;setDatasets(old=>old.map(x=>x.id===dataDraft.id?{...dataDraft,name:dataDraft.name.trim()}:x));navigate("dataDetail","data");show(t("form.saved"))}
function removeDataset(id:string){if(!window.confirm(t("data.deleteConfirm")))return;setDatasets(old=>old.filter(x=>x.id!==id));setSessions(old=>old.map(s=>({...s,targets:s.targets.filter(x=>x!==id),references:s.references.filter(x=>x!==id)})));navigate("datasets","data");show(t("data.deleted"))}
function toggleSource(id:string,checked:boolean){
if(!active)return;
setSessions(old=>old.map(s=>{if(s.id!==active.id)return s;
const ref=sourceKind==="reference";const key=ref?"references":"targets";const other=ref?"targets":"references";
return {...s,[key]:checked?uniq([...s[key],id]):s[key].filter(x=>x!==id),[other]:checked?s[other].filter(x=>x!==id):s[other]};
}))
}
function updateContext(value:string){if(!active)return;setSessions(old=>old.map(s=>s.id===active.id?{...s,[contextKind]:value}:s));show(t("form.saved"))}
function sendChat(){if(!chatDraft.trim()||!active)return;const key=active.id+"/"+moduleId;const prompt=chatDraft.trim();setChats(old=>({...old,[key]:[...(old[key]??[]),{who:"user",text:prompt},{who:"bot",text:t("module.botReply",{name:t("module."+moduleId)})}]}));setChatDraft("")}
function profileAction(action:"usage"|"membership"|"switch"|"signout"){setModal(action)}
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
<div className="sidebar07-toolbar"><SidebarTrigger aria-label="Alternar barra lateral"/></div>


<header className="screen-header"><div><nav className="breadcrumbs" aria-label="Breadcrumb">{crumbs().map((c,i)=><span key={i}>{i>0&&<span className="crumb-sep">/</span>}{c.onClick?<button onClick={c.onClick}>{c.label}</button>:<span aria-current="page">{c.label}</span>}</span>)}</nav><h1>{pageTitle()}</h1>{pageSubtitle()&&<p>{pageSubtitle()}</p>}</div>
<div className="page-tools">{view==="new"&&<Button variant="outline" onClick={()=>navigate("home","analysis")}>{t("common.cancel")}</Button>}{view==="library"&&<Button onClick={()=>editResource(null)}><Plus size={15}/>{t("common.new")}</Button>}{view==="datasets"&&<Button onClick={()=>{setImportStep(1);navigate("import","data")}}><Upload size={16}/>{t("nav.import")}</Button>}</div></header>

{view==="home"&&<Card className="open-sessions-card">
<CardHeader><CardTitle>{t("nav.saved")}</CardTitle><CardDescription>{t("common.records",{count:sessions.length})} · Seleccioná una sesión y abrila.</CardDescription></CardHeader>
<CardContent><div className="open-session-scroll" role="region" aria-label={t("nav.saved")} tabIndex={0}><Table><TableHeader><TableRow><TableHead>Elegir</TableHead><TableHead>{t("common.name")}</TableHead><TableHead>{t("nav.pilots")}</TableHead><TableHead>{t("nav.tracks")}</TableHead></TableRow></TableHeader><TableBody>{sessions.map(session=><TableRow key={session.id} data-state={selectedId===session.id?"selected":undefined} className="open-session-row" onClick={()=>setSelectedId(session.id)}><TableCell><input aria-label={"Seleccionar "+session.name} type="radio" checked={selectedId===session.id} onChange={()=>setSelectedId(session.id)}/></TableCell><TableCell className="font-semibold">{session.name}</TableCell><TableCell>{itemName(session.pilot,resources.pilots)}</TableCell><TableCell>{itemName(session.track,resources.tracks)}</TableCell></TableRow>)}</TableBody></Table></div>
<div className="open-session-actions"><Button variant="outline" onClick={beginNew}><Plus size={16}/>{t("nav.new")}</Button><Button onClick={()=>openSession(selectedId)} disabled={!sessions.some(s=>s.id===selectedId)}><FolderOpen size={16}/>{t("nav.open")}</Button></div>
</CardContent></Card>}

{view==="new"&&<div className="new-session">
<Card><CardHeader><CardTitle>{t("create.name")}</CardTitle><CardDescription>{t("create.nameHint")}</CardDescription></CardHeader><CardContent><Input aria-label={t("create.name")} required maxLength={80} autoComplete="off" value={draft.name} onChange={(e:ChangeEvent<HTMLInputElement>)=>setDraft(d=>({...d,name:e.target.value}))} placeholder={t("create.name")}/></CardContent></Card>
{picker("pilot",t("create.pilot"),t("create.one"),resources.pilots,draft.pilot,false,(id)=>setSingle("pilot",id))}
{picker("track",t("create.track"),t("create.one"),resources.tracks,draft.track,false,(id)=>setSingle("track",id))}
{picker("vehicle",t("create.vehicle"),t("create.one"),resources.vehicles,draft.vehicle,false,(id)=>setSingle("vehicle",id))}
{picker("targets",t("create.targets"),t("create.many"),datasets.map(d=>({id:d.id,name:d.name,detail:t("source."+d.type)+" · "+d.date})),draft.targets,true,(id,v)=>toggleMulti("targets",id,v))}
{picker("references",t("create.references"),t("create.optionalMany"),datasets.map(d=>({id:d.id,name:d.name,detail:t("source."+d.type)+" · "+d.date})),draft.references,true,(id,v)=>toggleMulti("references",id,v))}
{picker("modules",t("create.modules"),t("create.many"),resources.modules.map(m=>({id:m.id,name:t("module."+m.id),detail:m.detail})),draft.modules,true,(id,v)=>toggleMulti("modules",id,v))}
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

{view==="source"&&active&&<Card><CardHeader><CardTitle>{t("source."+sourceKind)}</CardTitle><CardDescription>{t("session.subtitle")}</CardDescription></CardHeader><CardContent>{picker("sources",t("source."+sourceKind),t("create.many"),datasets.filter(d=>d.type===sourceKind).map(d=>({id:d.id,name:d.name,detail:d.date+" · "+d.observation})),sourceKind==="reference"?active.references:active.targets,true,(id,v)=>toggleSource(id,v))}</CardContent></Card>}

{view==="context"&&active&&picker("context",t(names[contextKind]),t("create.one"),resources[ctxToRes[contextKind]],active[contextKind],false,(id)=>updateContext(id))}

{view==="module"&&active&&<div className="module-split"><Card className="module-top"><CardHeader><CardTitle>{t("module.demo")} · {t("module."+moduleId)}</CardTitle></CardHeader><CardContent><label className="field-label" htmlFor="lap">{t("module.lap")}</label><select id="lap" value={lap} onChange={e=>setLap(e.target.value)}><option value="best">{t("module.bestLap")}</option><option value="last">{t("module.lastLap")}</option><option value="reference">{t("module.referenceLap")}</option></select>
{moduleId==="sectors"?<div className="sector-grid">{["1","2","3"].map((id,i)=><div className="sector" key={id}><small>Sector {id}</small><strong>{["32,14","37,20","33,04"][i]} s</strong><span>{["+0,22","−0,18","−0,17"][i]} s</span></div>)}</div>:
moduleId==="gforce"?<svg className="module-graph" viewBox="0 0 550 180" role="img" aria-label={t("module.visualHint")}><path d="M0 90H550M275 0V180" stroke="#cbdde3" strokeDasharray="5 5"/>{Array.from({length:55},(_,i)=>{const a=i*2.4,r=18+i%76;return <circle key={i} cx={275+Math.cos(a)*r} cy={90+Math.sin(a)*r*.7} r="2.8" fill="#0b8992" opacity=".75"/>})}</svg>:
<svg className="module-graph" viewBox="0 0 680 180" preserveAspectRatio="none" role="img" aria-label={t("module.visualHint")}><path d="M0 35H680M0 85H680M0 135H680" stroke="#d8e5e9"/><path d="M0 146C40 92 50 50 88 98S132 170 170 121 214 35 252 69 299 157 333 113 375 16 432 61 471 149 516 108 572 30 608 67 640 111 680 50" fill="none" stroke="#0998a1" strokeWidth="3.5"/></svg>}
</CardContent></Card>
<Card className="module-chat"><CardHeader><CardTitle>{t("module.chat")}</CardTitle></CardHeader><div className="chat-messages"><div className="chat-bubble bot">{t("module.botIntro",{name:t("module."+moduleId)})}</div>{history.map((message,i)=><div key={i} className={"chat-bubble "+message.who}>{message.text}</div>)}</div><div className="chat-composer"><textarea aria-label={t("module.ask")} placeholder={t("module.ask")} value={chatDraft} onChange={e=>setChatDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat()}}}/><Button onClick={sendChat} disabled={!chatDraft.trim()}><Send size={16}/>{t("module.send")}</Button></div></Card></div>}

{view==="library"&&<Card><CardHeader><CardTitle>{t("nav."+kind)}</CardTitle><CardDescription>{t("library.subtitle")}</CardDescription></CardHeader><CardContent><div className="resource-scroll" role="region" aria-label={t("nav."+kind)} tabIndex={0}><Table><TableHeader><TableRow><TableHead>{t("common.name")}</TableHead><TableHead>{t("common.detail")}</TableHead><TableHead>{t("common.actions")}</TableHead></TableRow></TableHeader><TableBody>{resources[kind].map(item=><TableRow key={item.id}><TableCell className="font-semibold">{item.name}</TableCell><TableCell>{item.detail}</TableCell><TableCell><div className="action-buttons"><Button size="sm" variant="outline" onClick={()=>editResource(item.id)}><Pencil size={14}/>{t("common.edit")}</Button><Button size="sm" variant="ghost" onClick={()=>deleteResource(item.id)} aria-label={t("common.delete")}><Trash2 size={15}/></Button></div></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>}

{view==="resourceEdit"&&<Card className="edit-card"><CardHeader><CardTitle>{t(itemId?"common.edit":"form.newResource")}</CardTitle></CardHeader><CardContent><div className="stack-fields"><label>{t("common.name")}<Input value={editName} onChange={e=>setEditName(e.target.value)}/></label><label>{t("form.description")}<Input value={editDetail} onChange={e=>setEditDetail(e.target.value)}/></label><div className="pill-row"><Button variant="outline" onClick={()=>navigate("library")}>{t("common.cancel")}</Button><Button onClick={saveResource} disabled={!editName.trim()}>{t("common.save")}</Button></div></div></CardContent></Card>}

{view==="datasets"&&<div className="data-page">
<div className="stats-grid">{([{k:"data.records",v:visibleData.length,icon:Database},{k:"data.tracks",v:distinct("track"),icon:Layers3},{k:"data.pilots",v:distinct("pilot"),icon:UserRound},{k:"data.perday",v:average.toFixed(1).replace(".",","),icon:BarChart3}]).map(metric=><Card key={metric.k}><CardContent className="metric"><div><small>{t(metric.k)}</small><strong>{metric.v}</strong></div><metric.icon size={20}/></CardContent></Card>)}</div>
<Card><CardHeader><CardTitle>{t("data.filters")}</CardTitle></CardHeader><CardContent><div className="filters"><div><label>{t("common.search")}</label><div className="search-wrap"><Search size={15}/><Input aria-label={t("common.search")} value={filter.query} onChange={e=>setFilter(f=>({...f,query:e.target.value}))}/></div></div><div><label>{t("data.type")}</label><select value={filter.type} onChange={e=>setFilter(f=>({...f,type:e.target.value}))}><option value="">{t("common.all")}</option>{sources.map(x=><option key={x} value={x}>{t("source."+x)}</option>)}</select></div><div><label>{t("nav.pilots")}</label><select value={filter.pilot} onChange={e=>setFilter(f=>({...f,pilot:e.target.value}))}><option value="">{t("common.all")}</option>{resources.pilots.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></div><div><label>{t("nav.tracks")}</label><select value={filter.track} onChange={e=>setFilter(f=>({...f,track:e.target.value}))}><option value="">{t("common.all")}</option>{resources.tracks.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></div></div></CardContent></Card>
<Card className="records-card"><CardHeader><CardTitle>{t("nav.library")}</CardTitle><CardDescription>{t("data.matches",{count:visibleData.length,total:datasets.length})}</CardDescription></CardHeader><CardContent><div className="records-scroll" role="region" aria-label={t("nav.library")} tabIndex={0}><Table><TableHeader><TableRow><TableHead>{t("common.name")}</TableHead><TableHead>{t("common.date")}</TableHead><TableHead>{t("common.time")}</TableHead><TableHead>{t("common.observations")}</TableHead><TableHead>{t("common.actions")}</TableHead></TableRow></TableHeader><TableBody>{visibleData.map(d=><TableRow key={d.id}><TableCell className="font-semibold">{d.name}</TableCell><TableCell>{d.date}</TableCell><TableCell>{d.time}</TableCell><TableCell>{d.observation}</TableCell><TableCell><div className="action-buttons"><Button size="sm" variant="outline" onClick={()=>{setDatasetId(d.id);navigate("dataDetail")}}>{t("common.view")}</Button><Button size="sm" variant="outline" onClick={()=>editDataset(d.id)}>{t("common.edit")}</Button><Button size="sm" variant="outline" onClick={()=>show(t("data.shareDemo"))}><Share2 size={14}/>{t("common.share")}</Button><Button size="sm" variant="ghost" onClick={()=>removeDataset(d.id)} aria-label={t("common.delete")}><Trash2 size={15}/></Button></div></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card></div>}

{view==="dataDetail"&&targetDataset&&<Card><CardHeader><CardTitle>{targetDataset.name}</CardTitle><div className="action-buttons"><Button onClick={()=>editDataset(targetDataset.id)}><Pencil size={15}/>{t("common.edit")}</Button><Button variant="outline" onClick={()=>show(t("data.shareDemo"))}><Share2 size={15}/>{t("common.share")}</Button></div></CardHeader><CardContent><div className="summary-grid">{([["common.name",targetDataset.name],["common.date",targetDataset.date],["common.time",targetDataset.time],["common.observations",targetDataset.observation],["data.type",t("source."+targetDataset.type)],["nav.pilots",itemName(targetDataset.pilot,resources.pilots)],["nav.tracks",itemName(targetDataset.track,resources.tracks)]] as [string,string][]).map(([key,val])=><div key={key} className="summary-item"><small>{t(key)}</small><strong>{val}</strong></div>)}</div></CardContent></Card>}

{view==="dataEdit"&&dataDraft&&<Card className="edit-card"><CardHeader><CardTitle>{t("common.edit")}</CardTitle></CardHeader><CardContent><div className="stack-fields">
{(["name","date","time","observation"] as const).map(k=><label key={k}>{t(k==="observation"?"common.observations":"common."+k)}<Input type={k==="date"?"date":k==="time"?"time":"text"} value={dataDraft[k]} onChange={e=>setDataDraft(old=>old?{...old,[k]:e.target.value}:old)}/></label>)}
<label>{t("data.type")}<select value={dataDraft.type} onChange={e=>setDataDraft(old=>old?{...old,type:e.target.value as SourceKind}:old)}>{sources.map(x=><option key={x} value={x}>{t("source."+x)}</option>)}</select></label>
<div className="pill-row"><Button variant="outline" onClick={()=>navigate("dataDetail")}>{t("common.cancel")}</Button><Button onClick={saveDataset}>{t("common.save")}</Button></div></div></CardContent></Card>}

{view==="import"&&<Card className="edit-card"><CardHeader><CardTitle>{importStep===1?t("nav.import"):t("import.prep")}</CardTitle><CardDescription>{t(importStep===1?"import.noRead":"import.prepHint")}</CardDescription></CardHeader><CardContent>{importStep===1?<div className="stack-fields"><label>{t("import.file")}<Input type="file" accept=".csv,.txt,.xlsx,.xls,.json,.xrk,.xrz" onChange={e=>setFilename(e.target.files?.[0]?.name??"")}/></label><label>{t("import.type")}<select value={fileType} onChange={e=>setFileType(e.target.value)}><option value="">{t("import.select")}</option>{["CSV","TXT","XLSX","XRK","XRZ","Otro"].map(x=><option key={x}>{x}</option>)}</select></label><Button disabled={!filename||!fileType} onClick={()=>setImportStep(2)}>{t("import.continue")}<ArrowRight size={16}/></Button></div>:<div className="stack-fields"><p>{filename} · {fileType}</p><p>{t("import.prepHint")}</p><Button variant="outline" onClick={()=>setImportStep(1)}>{t("common.back")}</Button></div>}</CardContent></Card>}

{view==="settings"&&<Card className="edit-card"><CardHeader><CardTitle>{t("settings.title")}</CardTitle></CardHeader><CardContent><label className="stack-fields">{t("settings.speed")}<select><option>km/h</option><option>mph</option></select></label></CardContent></Card>}
{view==="account"&&<Card className="edit-card"><CardHeader><CardTitle>{t("nav.account")}</CardTitle></CardHeader><CardContent><p>{t("profile.user")} · {t("profile.plan",{plan})}</p><div className="pill-row"><Button onClick={()=>profileAction("membership")}>{t("profile.membership")}</Button><Button variant="outline" onClick={()=>profileAction("usage")}>{t("profile.usage")}</Button></div></CardContent></Card>}
{view==="help"&&<Card><CardHeader><CardTitle>{t("help.title")}</CardTitle><CardDescription>{t("help.subtitle")}</CardDescription></CardHeader></Card>}
</SidebarInset>
{modal&&<div className="modal-shade" onClick={()=>setModal(null)}><div role="dialog" aria-modal="true" aria-label={t("profile."+modal)} className="modal-body" onClick={e=>e.stopPropagation()}><div className="modal-header"><h2>{t("profile."+modal)}</h2><button onClick={()=>setModal(null)} aria-label={t("common.close")}><X size={19}/></button></div>{modal==="usage"&&<p>{t("data.records")}: {datasets.length} · {t("nav.saved")}: {sessions.length}</p>}{modal==="membership"&&<div className="pill-row"><Button onClick={()=>{setPlan(p=>p==="Free"?"Pro":"Free");setModal(null)}}>{t("profile.plan",{plan})} <Check size={15}/></Button></div>}<Button variant="outline" onClick={()=>setModal(null)}>{t("common.close")}</Button></div></div>}
{toast&&<div className="toast" role="status">{toast}</div>}
</SidebarProvider>
}
