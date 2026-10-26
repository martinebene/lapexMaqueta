import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Resource, ResourceKind, Setup, SegmentSet } from "./data"

const vehicleTypes=["Moto de velocidad","Karting","Auto de Fórmula","Auto de Turismo","Vehículo de Rally"]
type Props={kind:Exclude<ResourceKind,"modules">;initial:Resource;editing:boolean;onSave:(resource:Resource)=>void;onCancel:()=>void}
type StrKey="name"|"detail"|"number"|"shortName"|"nickname"|"nationality"|"city"|"province"|"country"|"birthDate"|"photo"|"email"|"phone"|"description"|"drivingStyle"|"manufacturer"|"model"|"enginePower"|"category"|"vehicleType"|"drivenWheels"|"location"|"direction"|"trackType"
type NumericKey="experience"|"speed"|"referenceWeight"|"handicapBallastWeight"|"dragCoefficient"|"lengthKm"|"distanceKm"
type FormField={key:StrKey|NumericKey;label:string;required?:boolean;type?:"date"|"email"|"number"|"url"|"text"|"textarea"|"select";options?:string[];note?:string}
const pilotFields:FormField[]=[
 {key:"name",label:"Nombre",required:true},{key:"number",label:"Número deportivo"},{key:"shortName",label:"Nombre corto"},{key:"nickname",label:"Apodo"},
 {key:"nationality",label:"Nacionalidad"},{key:"country",label:"País"},{key:"city",label:"Localidad"},{key:"birthDate",label:"Fecha de nacimiento",type:"date"},
 {key:"photo",label:"Fotografía (URL)",type:"url"},{key:"email",label:"Correo electrónico",type:"email"},{key:"phone",label:"Teléfono"},
 {key:"experience",label:"Nivel de experiencia (1–10)",type:"number"},{key:"speed",label:"Nivel de velocidad (1–10)",type:"number"},
 {key:"description",label:"Descripción",type:"textarea"},{key:"drivingStyle",label:"Estilo de conducción",type:"textarea"}
]
const vehicleFields:FormField[]=[
 {key:"name",label:"Nombre",required:true},{key:"vehicleType",label:"Tipo de vehículo",type:"select",required:true,options:vehicleTypes,note:"El tipo queda fijo después de crear el vehículo."},
 {key:"category",label:"Categoría deportiva"},{key:"number",label:"Número deportivo"},{key:"manufacturer",label:"Fabricante"},{key:"model",label:"Modelo"},
 {key:"referenceWeight",label:"Peso de referencia (kg)",type:"number",required:true,note:"En orden de rodaje, sin hándicap."},
 {key:"handicapBallastWeight",label:"Lastre de hándicap (kg)",type:"number"},
 {key:"drivenWheels",label:"Ruedas motrices / tracción",required:true},
 {key:"dragCoefficient",label:"Coeficiente aerodinámico Cx",type:"number"},{key:"enginePower",label:"Potencia del motor (valor con unidad)"},
 {key:"description",label:"Descripción",type:"textarea"}
]
const trackFields:FormField[]=[
 {key:"name",label:"Nombre",required:true},{key:"trackType",label:"Trazado",type:"select",required:true,options:["Cerrado","Abierto"]},
 {key:"direction",label:"Sentido de recorrido"},
 {key:"country",label:"País"},{key:"province",label:"Provincia / jurisdicción"},{key:"city",label:"Localidad"},
 {key:"location",label:"Ubicación / referencia geográfica"},
 {key:"lengthKm",label:"Longitud declarada (km)",type:"number"},
 {key:"description",label:"Descripción",type:"textarea"}
]
export function ResourceForm({kind,initial,editing,onSave,onCancel}:Props){
 const [value,setValue]=useState<Resource>(initial)
 const [tagsText,setTagsText]=useState((initial.tags??[]).join(", "))
 const [attributesText,setAttributesText]=useState(Object.entries(initial.customAttributes??{}).map(([k,v])=>k+": "+v).join("\n"))
 const [validation,setValidation]=useState("")
 const fields=kind==="pilots"?pilotFields:kind==="vehicles"?vehicleFields:trackFields
 const update=(key:string,raw:string,numeric:boolean)=>{
  setValue(old=>({...old,[key]:numeric?(raw===""?undefined:Number(raw)):raw}))
  setValidation("")
 }
 const addSetup=()=>setValue(old=>({...old,setups:[...(old.setups??[]),{id:"su"+Date.now(),name:"",date:""}]}))
 const editSetup=(id:string,key:keyof Setup,text:string)=>setValue(old=>({...old,setups:old.setups?.map(s=>s.id===id?{...s,[key]:text}:s)}))
 const addSegment=()=>setValue(old=>({...old,segmentSets:[...(old.segmentSets??[]),{id:"seg"+Date.now(),name:"",type:"analysis" as const}]}))
 const editSegment=(id:string,key:keyof SegmentSet,text:string)=>setValue(old=>({...old,segmentSets:old.segmentSets?.map(s=>s.id===id?{...s,[key]:text}:s)}))
 function submit(){
  if(!value.name.trim())return setValidation("El nombre es obligatorio.")
  if(kind==="vehicles"){
   if(!value.vehicleType||!value.drivenWheels?.trim()||!(Number(value.referenceWeight)>0))return setValidation("Completá el tipo, peso de referencia positivo y tracción.")
   if(!(value.setups??[]).length||value.setups?.some(s=>!s.name.trim()))return setValidation("El vehículo debe tener al menos un setup con nombre.")
  }
  if(kind==="tracks"&&!value.trackType)return setValidation("Elegí el tipo de trazado.")
  if(kind==="pilots"&&(["experience","speed"] as const).some(k=>value[k]!=null&&(!Number.isInteger(value[k])||(value[k] as number)<1||(value[k] as number)>10)))return setValidation("Las valoraciones deben ser números enteros entre 1 y 10.")
  const attrs=Object.fromEntries(attributesText.split("\n").map(t=>t.split(":").map(s=>s.trim())).filter(([k,v])=>k&&v))
  onSave({...value,name:value.name.trim(),tags:tagsText.split(",").map(s=>s.trim()).filter(Boolean),customAttributes:attrs,segments:value.segmentSets?.length??value.segments})
 }
 return <Card className="resource-form-card">
  <CardHeader><CardTitle>{editing?"Editar":"Nuevo"} · {kind==="pilots"?"Piloto":kind==="vehicles"?"Vehículo":"Circuito"}</CardTitle><CardDescription>Los campos con * son obligatorios. Los demás son opcionales, según la especificación del producto.</CardDescription></CardHeader>
  <CardContent>
   <form noValidate className="resource-form" onSubmit={e=>{e.preventDefault();submit()}}>
    <div className="resource-form-fields">
     {fields.map(f=>{
      const key=f.key as keyof Resource
      const raw=value[key]
      const str=raw==null?"":String(raw)
      const numeric=f.type==="number"
      return <label className="resource-form-field" key={f.key}><span>{f.label}{f.required?" *":""}</span>
       <div>{f.type==="textarea"?<Textarea aria-label={f.label} value={str} onChange={e=>update(f.key,e.target.value,false)}/>:
        f.type==="select"?<select aria-label={f.label} value={str} required={f.required} disabled={editing&&f.key==="vehicleType"} onChange={e=>update(f.key,e.target.value,false)}><option value="">Seleccionar</option>{f.options?.map(x=><option key={x} value={x}>{x}</option>)}</select>:
        <Input aria-label={f.label} type={f.type??"text"} required={f.required} value={str}
         min={f.key==="experience"||f.key==="speed"?"1":numeric?"0":undefined}
         max={f.key==="experience"||f.key==="speed"?"10":undefined}
         step={numeric?"any":undefined}
         disabled={editing&&f.key==="vehicleType"} onChange={e=>update(f.key,e.target.value,numeric)}/>}
        {f.note&&<small>{f.note}</small>}</div>
      </label>
     })}
     {kind==="vehicles"&&<div className="resource-form-field"><span>Peso total calculado</span><output className="session-timestamp">{value.referenceWeight==null?"—":Number(value.referenceWeight)+Number(value.handicapBallastWeight??0)} kg</output></div>}
    </div>
    {kind==="pilots"&&<div className="resource-form-section"><h3>Etiquetas</h3><Input aria-label="Etiquetas del piloto" placeholder="Separadas por coma" value={tagsText} onChange={e=>setTagsText(e.target.value)}/></div>}
    {kind==="vehicles"&&<div className="resource-form-section">
     <h3>Setups del vehículo</h3><p>Debe existir al menos un preset. Cada uno tiene nombre obligatorio; la fecha es descriptiva en esta maqueta.</p>
     {(value.setups??[]).map(s=><div className="resource-form-collection" key={s.id}><Input aria-label={"Nombre del setup "+s.id} placeholder="Nombre del setup" required value={s.name} onChange={e=>editSetup(s.id,"name",e.target.value)}/><Input aria-label={"Fecha del setup "+s.id} type="date" value={s.date??""} onChange={e=>editSetup(s.id,"date",e.target.value)}/><Button type="button" variant="ghost" aria-label={"Quitar setup "+s.name} onClick={()=>setValue(old=>({...old,setups:old.setups?.filter(x=>x.id!==s.id)}))}><Trash2 size={14}/></Button></div>)}
     <Button type="button" variant="outline" onClick={addSetup}><Plus size={14}/> Agregar setup</Button>
    </div>}
    {kind==="tracks"&&<div className="resource-form-section">
     <h3>Conjuntos de segmentación</h3><p>Son opcionales. Análisis de parciales y nomenclatura de curvas tienen identidad propia. La edición de geometría y cortes corresponde al creador GPS de un futuro hito.</p>
     {(value.segmentSets??[]).map(s=><div className="resource-form-collection" key={s.id}><Input aria-label={"Nombre del conjunto "+s.id} placeholder="Nombre opcional" value={s.name} onChange={e=>editSegment(s.id,"name",e.target.value)}/><select aria-label={"Tipo del conjunto "+s.id} value={s.type} onChange={e=>editSegment(s.id,"type",e.target.value)}><option value="analysis">Parciales</option><option value="nomenclature">Nomenclatura de curvas</option></select><Button type="button" variant="ghost" aria-label={"Quitar conjunto "+s.id} onClick={()=>setValue(old=>({...old,segmentSets:old.segmentSets?.filter(x=>x.id!==s.id)}))}><Trash2 size={14}/></Button></div>)}
     <Button type="button" variant="outline" onClick={addSegment}><Plus size={14}/> Agregar conjunto</Button>
     <p>Geometría GPS: {value.geometry?.length?"Registrada (edición geográfica no disponible en maqueta)":"Sin geometría registrada"}</p>
    </div>}
    <div className="resource-form-section"><h3>Atributos personalizados opcionales</h3><Textarea aria-label="Atributos personalizados" rows={3} placeholder="Clave: valor (uno por línea)" value={attributesText} onChange={e=>setAttributesText(e.target.value)}/><small>Los valores físicos deben indicar su unidad.</small></div>
    {validation&&<p className="resource-form-error" role="alert">{validation}</p>}
    <div className="pill-row"><Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button><Button type="submit">Guardar {kind==="pilots"?"piloto":kind==="vehicles"?"vehículo":"circuito"}</Button></div>
   </form>
  </CardContent>
 </Card>
}
