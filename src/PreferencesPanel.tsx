import {useEffect,useState} from "react"
import {useTranslation} from "react-i18next"
import {RotateCcw,Ruler,SlidersHorizontal,LayoutGrid} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card"
import {NativeSelect} from "@/components/ui/native-select"
import {Switch} from "@/components/ui/switch"

type Options=Record<string,string>
export type UnitKey="speed"|"distance"|"length"|"smallLength"|"mass"|"temperature"|"pressure"|"power"|"torque"|"capacity"|"displacement"|"spring"|"acceleration"
const units:{key:UnitKey;label:string;options:string[];example:string}[]=[
 {key:"speed",label:"Velocidad",options:["km/h","mph","m/s"],example:"100 km/h"},
 {key:"distance",label:"Distancia de recorrido",options:["km","mi"],example:"4,5 km"},
 {key:"length",label:"Distancias cortas",options:["m","ft"],example:"25 m"},
 {key:"smallLength",label:"Dimensiones y reglajes",options:["mm","in"],example:"45 mm"},
 {key:"mass",label:"Masa / peso",options:["kg","lb"],example:"900 kg"},
 {key:"temperature",label:"Temperatura",options:["°C","°F"],example:"22 °C"},
 {key:"pressure",label:"Presión",options:["bar","psi","kPa"],example:"2,1 bar"},
 {key:"power",label:"Potencia",options:["CV","hp","kW"],example:"120 CV"},
 {key:"torque",label:"Torque",options:["N·m","lb·ft"],example:"240 N·m"},
 {key:"capacity",label:"Volumen / capacidad",options:["L","gal (EE. UU.)"],example:"50 L"},
 {key:"displacement",label:"Cilindrada",options:["cm³","in³"],example:"1600 cm³"},
 {key:"spring",label:"Rigidez de resorte",options:["N/mm","lb/in"],example:"80 N/mm"},
 {key:"acceleration",label:"Aceleración",options:["g","m/s²"],example:"1,2 g"}
]
const defaults:Options={theme:"system",language:"system",contrast:"normal",clock:"24",timezone:"system",quick:"yes",...Object.fromEntries(units.map(u=>[u.key,u.options[0]]))}
function load():Options{try{return {...defaults,...JSON.parse(localStorage.getItem("lapex-preferences")||"{}")}}catch{return {...defaults}}}
const preview:Record<UnitKey,Record<string,string>>={
 speed:{"km/h":"100 km/h","mph":"62,14 mph","m/s":"27,78 m/s"},
 distance:{"km":"4,5 km","mi":"2,80 mi"},
 length:{"m":"25 m","ft":"82,02 ft"},
 smallLength:{"mm":"45 mm","in":"1,77 in"},
 mass:{"kg":"900 kg","lb":"1.984,16 lb"},
 temperature:{"°C":"22 °C","°F":"71,6 °F"},
 pressure:{"bar":"2,1 bar","psi":"30,46 psi","kPa":"210 kPa"},
 power:{"CV":"120 CV","hp":"118,36 hp","kW":"88,26 kW"},
 torque:{"N·m":"240 N·m","lb·ft":"177,01 lb·ft"},
 capacity:{"L":"50 L","gal (EE. UU.)":"13,21 gal"},
 displacement:{"cm³":"1600 cm³","in³":"97,64 in³"},
 spring:{"N/mm":"80 N/mm","lb/in":"456,84 lb/in"},
 acceleration:{"g":"1,2 g","m/s²":"11,77 m/s²"}
}
export function displayMeasure(value:number,kind:UnitKey){
 const setting=load()[kind]
 const converted=kind==="speed"?setting==="mph"?value*0.621371:setting==="m/s"?value/3.6:value:
 kind==="distance"&&setting==="mi"?value*0.621371:
 kind==="length"&&setting==="ft"?value*3.28084:
 kind==="smallLength"&&setting==="in"?value/25.4:
 kind==="mass"&&setting==="lb"?value*2.20462:value
 return converted.toLocaleString("es-AR",{maximumFractionDigits:2})+" "+setting
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
 <CardContent><div className="unit-grid">{units.map(u=><label key={u.key} className="unit-field"><span>{u.label}</span><NativeSelect aria-label={u.label} value={settings[u.key]} onChange={e=>change(u.key,e.target.value)}>{u.options.map(x=><option key={x} value={x}>{x}</option>)}</NativeSelect><small>Ejemplo: {preview[u.key][settings[u.key]]||u.example}</small></label>)}</div><p className="unit-note">Régimen: rpm · Ángulos: grados. Las preferencias no modifican la precisión ni las mediciones almacenadas.</p></CardContent></Card>
 <Card><CardHeader><CardTitle><LayoutGrid size={19}/>Personalización</CardTitle><CardDescription>Accesos y opciones propias de tu espacio de trabajo.</CardDescription></CardHeader><CardContent className="pref-rows">
 <label className="pref-row"><span>Mostrar accesos rápidos en Inicio</span><Switch checked={settings.quick==="yes"} onCheckedChange={checked=>change("quick",checked?"yes":"no")}/></label>
 <p className="unit-note">La administración de memoria se incorporará a esta superficie cuando esté disponible el servicio correspondiente.</p>
 </CardContent></Card>
 <Card><CardHeader><CardTitle><RotateCcw size={19}/>Restablecer preferencias</CardTitle><CardDescription>Recuperar las opciones predeterminadas.</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={restore}><RotateCcw size={15}/>Restablecer</Button>{notice&&<p role="status">{notice}</p>}</CardContent></Card>
 </div>
}
