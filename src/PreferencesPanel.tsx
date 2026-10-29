import {useEffect,useState} from "react"
import {useTranslation} from "react-i18next"
import {RotateCcw,Ruler,SlidersHorizontal,LayoutGrid} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card"
import {NativeSelect} from "@/components/ui/native-select"
import {Switch} from "@/components/ui/switch"

type Options=Record<string,string>
export type UnitKey=
 "speed"|"distance"|"length"|"smallLength"|"mass"|"temperature"|"pressure"|
 "power"|"torque"|"capacity"|"displacement"|"spring"|"acceleration"|
 "angle"|"force"|"frequency"|"time"

// Valores de ejemplo expresados siempre en la unidad inicial de cada magnitud.
// Esta es una simulación visual, no el catálogo de unidades UCUM del backend.
const units:{key:UnitKey;label:string;options:string[];example:number}[]=[
 {key:"speed",label:"Velocidad",options:["km/h","mph","m/s"],example:100},
 {key:"distance",label:"Distancia de recorrido",options:["km","mi"],example:4.5},
 {key:"length",label:"Distancias cortas",options:["m","ft","cm"],example:25},
 {key:"smallLength",label:"Dimensiones y reglajes",options:["mm","in"],example:45},
 {key:"mass",label:"Masa / peso",options:["kg","lb","g"],example:900},
 {key:"temperature",label:"Temperatura",options:["°C","°F","K"],example:22},
 {key:"pressure",label:"Presión",options:["bar","psi","kPa","Pa"],example:2.1},
 {key:"power",label:"Potencia",options:["CV","hp","kW","W"],example:120},
 {key:"torque",label:"Torque",options:["N·m","lb·ft"],example:240},
 {key:"capacity",label:"Volumen / capacidad",options:["L","gal (EE. UU.)","mL"],example:50},
 {key:"displacement",label:"Cilindrada",options:["cm³","in³"],example:1600},
 {key:"spring",label:"Rigidez de resorte",options:["N/mm","lbf/in"],example:80},
 {key:"acceleration",label:"Aceleración",options:["g","m/s²"],example:1.2},
 {key:"angle",label:"Ángulo",options:["°","rad"],example:90},
 {key:"force",label:"Fuerza",options:["N","kN"],example:1250},
 {key:"frequency",label:"Régimen / frecuencia de giro",options:["rpm","Hz"],example:6000},
 {key:"time",label:"Tiempo / duración",options:["s","ms","min","h"],example:3600},
]
const defaults:Options={theme:"system",language:"system",contrast:"normal",clock:"24",timezone:"system",quick:"yes",...Object.fromEntries(units.map(u=>[u.key,u.options[0]]))}
const unitFor=(key:UnitKey,requested:string|undefined):string=>{
 // Mantiene preferencias guardadas antes de corregir la unidad de fuerza.
 const migrated=key==="spring"&&requested==="lb/in"?"lbf/in":requested
 const options=units.find(unit=>unit.key===key)!.options
 return migrated&&options.includes(migrated)?migrated:options[0]
}
function load():Options{
 try {
  const saved=JSON.parse(localStorage.getItem("lapex-preferences")||"{}") as Options
  const value={...defaults,...(saved&&typeof saved==="object"?saved:{})}
  for(const unit of units)value[unit.key]=unitFor(unit.key,value[unit.key])
  return value
 }catch{return {...defaults}}
}

// Todas las entradas se expresan en la primera unidad de la magnitud.
// La conversión es sólo de presentación: nunca cambia el dato de origen.
// hp es potencia mecánica (745,699871582 W), no CV métrico (735,49875 W).
export function convertMeasure(value:number,kind:UnitKey,unit:string):number{
 switch(kind){
  case "speed": return unit==="mph"?value/1.609344:unit==="m/s"?value/3.6:value
  case "distance": return unit==="mi"?value/1.609344:value
  case "length": return unit==="ft"?value/0.3048:unit==="cm"?value*100:value
  case "smallLength": return unit==="in"?value/25.4:value
  case "mass": return unit==="lb"?value/0.45359237:unit==="g"?value*1000:value
  case "temperature": return unit==="°F"?value*9/5+32:unit==="K"?value+273.15:value
  case "pressure": return unit==="psi"?value*100000/6894.757293168:unit==="kPa"?value*100:unit==="Pa"?value*100000:value
  case "power": return unit==="hp"?value*735.49875/745.6998715822702:unit==="kW"?value*0.73549875:unit==="W"?value*735.49875:value
  case "torque": return unit==="lb·ft"?value/1.3558179483314004:value
  case "capacity": return unit==="gal (EE. UU.)"?value/3.785411784:unit==="mL"?value*1000:value
  case "displacement": return unit==="in³"?value/16.387064:value
  case "spring": return unit==="lbf/in"||unit==="lb/in"?value*25.4/4.4482216152605:value
  case "acceleration": return unit==="m/s²"?value*9.80665:value
  case "angle": return unit==="rad"?value*Math.PI/180:value
  case "force": return unit==="kN"?value/1000:value
  case "frequency": return unit==="Hz"?value/60:value
  case "time": return unit==="ms"?value*1000:unit==="min"?value/60:unit==="h"?value/3600:value
 }
}
function formatMeasure(value:number,kind:UnitKey,requested:string|undefined):string{
 const unit=unitFor(kind,requested)
 const converted=convertMeasure(value,kind,unit)
 return converted.toLocaleString("es-AR",{maximumFractionDigits:2})+" "+unit
}
export function displayMeasure(value:number,kind:UnitKey):string{
 return formatMeasure(value,kind,load()[kind])
}
function apply(p:Options){
 document.documentElement.dataset.theme=p.theme==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p.theme
 document.documentElement.dataset.contrast=p.contrast
 document.documentElement.classList.toggle("dark",document.documentElement.dataset.theme==="dark")
}
export function PreferencesPanel(){
 const {i18n}=useTranslation()
 const [settings,setSettings]=useState<Options>(load)
 const [notice,setNotice]=useState("")
 useEffect(()=>{apply(settings);localStorage.setItem("lapex-preferences",JSON.stringify(settings))},[settings])
 function change(key:string,value:string){
  setSettings(old=>({...old,[key]:value}))
  if(key==="language")void i18n.changeLanguage(value==="system"?(navigator.language.startsWith("en")?"en":"es"):value)
 }
 function restore(){if(!window.confirm("¿Restablecer todas las preferencias?"))return;setSettings({...defaults});void i18n.changeLanguage(navigator.language.startsWith("en")?"en":"es");setNotice("Preferencias restablecidas.")}
 function selector(key:string,label:string,opts:{value:string;label:string}[]){
  return <label className="pref-row"><span>{label}</span><NativeSelect aria-label={label} value={settings[key]||opts[0].value} onChange={e=>change(key,e.target.value)}>{opts.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</NativeSelect></label>
 }
 return <div className="settings-stack">
 <Card><CardHeader><CardTitle><SlidersHorizontal size={19}/>Preferencias generales</CardTitle><CardDescription>Personalizá la apariencia, el idioma y el formato de Lapex.</CardDescription></CardHeader><CardContent className="pref-rows">
 {selector("theme","Tema",[{value:"system",label:"Automático"},{value:"light",label:"Claro"},{value:"dark",label:"Oscuro"}])}
 {selector("language","Idioma",[{value:"system",label:"Automático"},{value:"es",label:"Español"},{value:"en",label:"English"}])}
 {selector("contrast","Contraste",[{value:"normal",label:"Normal"},{value:"high",label:"Alto"}])}
 {selector("clock","Formato horario",[{value:"24",label:"24 horas"},{value:"12",label:"12 horas"}])}
 {selector("timezone","Zona horaria",[{value:"system",label:"Del dispositivo"},{value:"America/Argentina/Buenos_Aires",label:"Argentina (ART)"},{value:"UTC",label:"UTC"}])}
 </CardContent></Card>
 <Card><CardHeader><CardTitle><Ruler size={19}/>Unidades de medida</CardTitle><CardDescription>Elegí la unidad para cada magnitud. Los datos originales permanecen en unidades canónicas.</CardDescription></CardHeader>
 <CardContent><div className="unit-grid">{units.map(u=><label key={u.key} className="unit-field"><span>{u.label}</span><NativeSelect aria-label={u.label} value={settings[u.key]} onChange={e=>change(u.key,e.target.value)}>{u.options.map(x=><option key={x} value={x}>{x}</option>)}</NativeSelect><small>Ejemplo: {formatMeasure(u.example,u.key,settings[u.key])}</small></label>)}</div><p className="unit-note">Estas preferencias modifican únicamente la presentación; las mediciones originales no se alteran. Los códigos UCUM definitivos requieren validación técnica.</p></CardContent></Card>
 <Card><CardHeader><CardTitle><LayoutGrid size={19}/>Personalización</CardTitle><CardDescription>Accesos y opciones propias de tu espacio de trabajo.</CardDescription></CardHeader><CardContent className="pref-rows">
 <label className="pref-row"><span>Mostrar accesos rápidos en Inicio</span><Switch checked={settings.quick==="yes"} onCheckedChange={checked=>change("quick",checked?"yes":"no")}/></label>
 <p className="unit-note">La administración de memoria se incorporará a esta superficie cuando esté disponible el servicio correspondiente.</p>
 </CardContent></Card>
 <Card><CardHeader><CardTitle><RotateCcw size={19}/>Restablecer preferencias</CardTitle><CardDescription>Recuperar las opciones predeterminadas.</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={restore}><RotateCcw size={15}/>Restablecer</Button>{notice&&<p role="status">{notice}</p>}</CardContent></Card>
 </div>
}
