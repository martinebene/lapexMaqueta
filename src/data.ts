
export type ResourceKind="pilots"|"tracks"|"vehicles"|"modules"
export type SourceKind="weather"|"run"|"reference"|"timing"
export type DatasetType="weather"|"run"|"timing"
export type Setup={id:string;name:string;date?:string;detail?:string}
export type SegmentSet={id:string;name:string;type:"analysis"|"nomenclature";detail?:string}
export interface Resource {
 id:string;name:string;detail:string;number?:string;shortName?:string;nickname?:string;nationality?:string;birthDate?:string;photo?:string;drivingStyle?:string;tags?:string[];customAttributes?:Record<string,string>;country?:string;province?:string;city?:string;email?:string;phone?:string;experience?:number;speed?:number;description?:string
 category?:string;vehicleType?:string;manufacturer?:string;model?:string;referenceWeight?:number;drivenWheels?:string;enginePower?:string;dragCoefficient?:number;handicapBallastWeight?:number;setups?:Setup[]
 trackType?:string;lengthKm?:number;distanceKm?:number;segments?:number;segmentSets?:SegmentSet[];geometry?:[number,number][];location?:string;direction?:string;visibility?:"public"|"private"
 enabled?:boolean;requirements?:string[];docsUrl?:string
}
export interface Dataset {id:string;name:string;date:string;time:string;observation:string;track:string;type:DatasetType;device?:string;bestLap?:string;duration?:string;season?:string;category?:string;sizeMB?:number;channels?:number}
export interface Session {id:string;name:string;observations?:string;createdAt?:string;pilot:string;track:string;vehicle:string;setup:string;segmentSetIds?:string[];targets:string[];references:string[];modules:string[]}
export interface Draft {name:string;observations:string;pilot:string;track:string;vehicle:string;setup:string;segmentSetIds:string[];targets:string[];references:string[];modules:string[]}
export const emptyDraft=():Draft=>({name:"",observations:"",pilot:"",track:"",vehicle:"",setup:"",segmentSetIds:[],targets:[],references:[],modules:[]})
export const initialResources:Record<ResourceKind,Resource[]>={
 pilots:[
  {id:"p1",name:"Piloto Demo A",detail:"Ensayos de turismo",number:"21",shortName:"P. Demo A",country:"Argentina",city:"Puerto Madryn",experience:7,speed:8,description:"Piloto de ensayos"},
  {id:"p2",name:"Piloto Demo B",detail:"Competición",number:"14",country:"Argentina",city:"Trelew",experience:6,speed:7},
  {id:"p3",name:"Piloto Demo C",detail:"Karting",number:"07",country:"Argentina",city:"Rawson",experience:4,speed:6}
 ],
 tracks:[
  {id:"t1",name:"Circuito Delta",detail:"3,75 km",country:"Argentina",province:"Chubut",trackType:"Cerrado",lengthKm:3.75,distanceKm:60,segments:2,segmentSets:[{id:"seg-t1-a",name:"Parciales carrera",type:"analysis"},{id:"seg-t1-n",name:"Nombres de curvas",type:"nomenclature"}],geometry:[[-65.31,-43.25],[-65.30,-43.245],[-65.295,-43.253],[-65.31,-43.25]]},
  {id:"t2",name:"Circuito Costero",detail:"4,20 km",country:"Argentina",province:"Chubut",trackType:"Cerrado",lengthKm:4.2,distanceKm:120,segments:1,segmentSets:[{id:"seg-t2-a",name:"Sectores de pista",type:"analysis"}]},
  {id:"t3",name:"Circuito Sierra",detail:"5,10 km",country:"Argentina",province:"Córdoba",trackType:"Cerrado",lengthKm:5.1,segments:0,segmentSets:[]}
 ],
 vehicles:[
  {id:"v1",name:"GT-04",detail:"Tracción delantera",category:"Turismo Pista",vehicleType:"Auto de Turismo",manufacturer:"Volkswagen",model:"Gol",referenceWeight:900,drivenWheels:"Delantera",enginePower:"125 CV",setups:[{id:"su1",date:"2026-10-11",name:"Base pista"},{id:"su2",date:"2026-10-17",name:"Clasificación"}]},
  {id:"v2",name:"TP-02",detail:"Configuración alternativa",category:"Turismo Nacional",vehicleType:"Auto de Turismo",manufacturer:"Toyota",model:"Etios",referenceWeight:930,drivenWheels:"Delantera",setups:[{id:"su3",date:"2026-10-13",name:"Ensayo"},{id:"su4",date:"2026-10-18",name:"Carrera"}]},
  {id:"v3",name:"K-11",detail:"Karting",category:"Sudam",vehicleType:"Karting",manufacturer:"Tony Kart",model:"Racer",referenceWeight:170,drivenWheels:"Trasera",setups:[{id:"su5",date:"2026-10-09",name:"Base"}]},
  {id:"v4",name:"M-08",detail:"Moto de ensayo sin configuraciones",category:"Superbike",vehicleType:"Moto de velocidad",manufacturer:"Yamaha",model:"R6",setups:[]}
 ],
 modules:[
  {id:"best",name:"Mejor vuelta",detail:"Identifica y compara los mejores registros de vuelta",requirements:["Rodaje con vueltas y medición temporal"],enabled:true},
  {id:"gforce",name:"Fuerza G",detail:"Inspección de aceleración longitudinal y lateral",requirements:["Rodaje con canal de aceleración"],enabled:true},
  {id:"sectors",name:"Análisis de parciales",detail:"Comparación de segmentos de circuito",requirements:["Rodaje con segmentaciones y circuito asociado"],enabled:true}
 ]
}
export const initialDatasets:Dataset[]=[
 {id:"d1",name:"Rodaje · Tanda 02",date:"2026-10-19",time:"14:32",observation:"Ensayo de clasificación",track:"t1",type:"run",device:"AiM Solo 2 DL",bestLap:"1:24.532",duration:"24 min",season:"2026",category:"Turismo Pista",sizeMB:31,channels:18},
 {id:"d2",name:"Rodaje · Referencia 01",date:"2026-10-19",time:"13:06",observation:"Comparativa de reglajes",track:"t1",type:"run",device:"AiM MXG",bestLap:"1:25.041",duration:"18 min",season:"2026",category:"Turismo Pista",sizeMB:23,channels:22},
 {id:"d3",name:"Estación meteorológica",date:"2026-10-19",time:"12:40",observation:"Pista seca y viento leve",track:"t1",type:"weather",device:"Estación de pista",season:"2026",sizeMB:2},
 {id:"d4",name:"Cronometraje · Fecha 5",date:"2026-10-18",time:"16:17",observation:"Planilla de tiempos",track:"t2",type:"timing",device:"Planilla oficial",season:"2026",sizeMB:1},
 {id:"d5",name:"Rodaje · Tanda 01",date:"2026-10-18",time:"10:24",observation:"Configuración inicial",track:"t2",type:"run",device:"AiM Solo 2 DL",bestLap:"1:28.108",season:"2026",sizeMB:29,channels:19},
 {id:"d6",name:"Referencia · Ensayo previo",date:"2026-10-17",time:"15:18",observation:"Sesión comparativa",track:"",type:"run",device:"AiM MXG",bestLap:"1:25.710",season:"2026",sizeMB:26,channels:15}
]
export const initialSessions:Session[]=[
 {id:"s1",name:"Ensayo de puesta a punto",pilot:"p1",track:"t1",vehicle:"v1",setup:"su1",targets:["d1"],references:["d2"],modules:["best","gforce","sectors"]},
 {id:"s2",name:"Comparativa de configuración",pilot:"p2",track:"t2",vehicle:"v2",setup:"su3",targets:["d5"],references:[],modules:["best","sectors"]},
 {id:"s3",name:"Clasificación · Fecha 5",pilot:"p1",track:"t1",vehicle:"v1",setup:"su2",targets:["d1"],references:[],modules:["best"]},
 {id:"s4",name:"Pruebas de frenada",pilot:"p2",track:"t2",vehicle:"v2",setup:"su4",targets:["d5"],references:[],modules:["gforce"]},
 {id:"s5",name:"Comparación de trazadas",pilot:"p1",track:"t1",vehicle:"v1",setup:"su1",targets:["d1"],references:["d2"],modules:["best","sectors"]},
 {id:"s6",name:"Ensayo de suspensiones",pilot:"p1",track:"t1",vehicle:"v1",setup:"su1",targets:[],references:["d6"],modules:["gforce"]}
]
export function moduleMissing(module:Resource,d:Draft,datasets:Dataset[]){
 const used=datasets.filter(x=>[...d.targets,...d.references].includes(x.id))
 if(!used.some(x=>x.type==="run"))return module.requirements??["Se requiere un rodaje"]
 if(module.id==="sectors"&&!d.track)return ["Seleccionar un circuito"]
 if(module.id==="sectors"&&!d.segmentSetIds?.some(id=>id && true))return ["Seleccionar un conjunto de segmentación de parciales"]
 return []
}
export function validDraft(d:Draft,resources:Record<ResourceKind,Resource[]>,datasets:Dataset[]){
 const found=(kind:ResourceKind,id:string)=>resources[kind].some(r=>r.id===id)
 const vehicle=resources.vehicles.find(r=>r.id===d.vehicle)
 return Boolean(d.name.trim()&&found("pilots",d.pilot)&&found("tracks",d.track)&&vehicle
 &&vehicle.setups?.some(s=>s.id===d.setup)&&d.targets.length<=1&&d.modules.length>0
 &&d.targets.every(id=>datasets.some(x=>x.id===id&&x.type==="run")&&!d.references.includes(id))
 &&d.references.every(id=>datasets.some(x=>x.id===id))
 &&d.modules.every(id=>{const m=resources.modules.find(x=>x.id===id);return m&&m.enabled!==false&&moduleMissing(m,d,datasets).length===0}))
}
