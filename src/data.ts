
export type ResourceKind = "pilots" | "tracks" | "vehicles" | "modules"
export type SourceKind = "weather" | "run" | "reference" | "timing"
export interface Resource { id:string; name:string; detail:string }
export interface Dataset { id:string; name:string; date:string; time:string; observation:string; pilot:string; track:string; type:SourceKind }
export interface Session { id:string; name:string; pilot:string; track:string; vehicle:string; targets:string[]; references:string[]; modules:string[] }
export interface Draft { name:string;pilot:string;track:string;vehicle:string;targets:string[];references:string[];modules:string[] }
export const emptyDraft=():Draft=>({name:"",pilot:"",track:"",vehicle:"",targets:[],references:[],modules:[]})
export const moduleDefinitions=[{id:"best",name:"Mejor vuelta",detail:"Velocidad y mejor vuelta"},{id:"gforce",name:"Fuerza G",detail:"Aceleración longitudinal y lateral"},{id:"sectors",name:"Análisis de parciales",detail:"Comparación por sectores"}]
export const initialResources:Record<ResourceKind,Resource[]>={
pilots:[{id:"p1",name:"Piloto Demo A",detail:"Turismo Pista"},{id:"p2",name:"Piloto Demo B",detail:"Perfil de ensayos"}],
tracks:[{id:"t1",name:"Circuito Delta",detail:"3,75 km"},{id:"t2",name:"Circuito Costero",detail:"4,20 km"}],
vehicles:[{id:"v1",name:"GT-04",detail:"Tracción delantera"},{id:"v2",name:"TP-02",detail:"Configuración alternativa"}],
modules:moduleDefinitions.map(x=>({...x}))
}
export const initialDatasets:Dataset[]=[
{id:"d1",name:"Rodaje · Tanda 02",date:"2026-10-19",time:"14:32",observation:"Ensayo de clasificación",pilot:"p1",track:"t1",type:"run"},
{id:"d2",name:"Rodaje · Referencia 01",date:"2026-10-19",time:"13:06",observation:"Comparativa de reglajes",pilot:"p1",track:"t1",type:"reference"},
{id:"d3",name:"Estación meteorológica",date:"2026-10-19",time:"12:40",observation:"Pista seca y viento leve",pilot:"",track:"t1",type:"weather"},
{id:"d4",name:"Cronometraje · Fecha 5",date:"2026-10-18",time:"16:17",observation:"Resultados ficticios",pilot:"p2",track:"t2",type:"timing"},
{id:"d5",name:"Rodaje · Tanda 01",date:"2026-10-18",time:"10:24",observation:"Configuración inicial",pilot:"p2",track:"t2",type:"run"},
{id:"d6",name:"Referencia · Ensayo previo",date:"2026-10-17",time:"15:18",observation:"Sesión comparativa",pilot:"p1",track:"t1",type:"reference"}
]
export const initialSessions:Session[]=[
{id:"s1",name:"Ensayo de puesta a punto",pilot:"p1",track:"t1",vehicle:"v1",targets:["d1"],references:["d2"],modules:["best","gforce","sectors"]},
{id:"s2",name:"Comparativa de configuración",pilot:"p2",track:"t2",vehicle:"v2",targets:["d5"],references:[],modules:["best","sectors"]},
{id:"s3",name:"Clasificación · Fecha 5",pilot:"p1",track:"t1",vehicle:"v1",targets:["d1"],references:[],modules:["best"]},
{id:"s4",name:"Pruebas de frenada",pilot:"p2",track:"t2",vehicle:"v2",targets:["d5"],references:[],modules:["gforce"]},
{id:"s5",name:"Comparación de trazadas",pilot:"p1",track:"t1",vehicle:"v1",targets:["d1"],references:["d2"],modules:["best","sectors"]},
{id:"s6",name:"Ensayo de suspensiones",pilot:"p1",track:"t1",vehicle:"v1",targets:[],references:[],modules:["gforce"]}
]
export function validDraft(d:Draft,resources:Record<ResourceKind,Resource[]>,datasets:Dataset[]){
const ids=(kind:ResourceKind)=>resources[kind].some(r=>r.id===d[kind==='pilots'?'pilot':kind==='tracks'?'track':'vehicle'])
return !!(d.name.trim()&&ids("pilots")&&ids("tracks")&&ids("vehicles")&&d.targets.length>0&&d.modules.length>0
&&d.targets.every(id=>datasets.some(x=>x.id===id)&&!d.references.includes(id))
&&d.references.every(id=>datasets.some(x=>x.id===id))
&&d.modules.every(id=>resources.modules.some(m=>m.id===id)))
}
