import { useEffect, useState } from "react"
import { Plus, Trash2, Share2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Resource, ResourceKind, SegmentSet } from "./data"
import { ShadcnGrid } from "./ShadcnGrid"

const vehicleTypes=["Moto de velocidad","Karting","Auto de Fórmula","Auto de Turismo","Vehículo de Rally"]
type Props={kind:Exclude<ResourceKind,"modules">;initial:Resource;editing:boolean;onSave:(resource:Resource)=>void;onCancel:()=>void;onEditSetup?:(id:string|null,current:Resource)=>void;onShare?:(item:string)=>void;dirtyBaseline?:Resource;onDirtyChange?:(dirty:boolean)=>void}
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
export function ResourceForm({kind,initial,editing,onSave,onCancel,onEditSetup,onShare,dirtyBaseline,onDirtyChange}:Props){
 const [value,setValue]=useState<Resource>(initial)
 const [tagsText,setTagsText]=useState((initial.tags??[]).join(", "))
 const [attributesText,setAttributesText]=useState(Object.entries(initial.customAttributes??{}).map(([k,v])=>k+": "+v).join("\n"))
 const [validation,setValidation]=useState("")
 const [selectedSegmentId,setSelectedSegmentId]=useState<string|null>(null)
 const fields=kind==="pilots"?pilotFields:kind==="vehicles"?vehicleFields:trackFields
 const update=(key:string,raw:string,numeric:boolean)=>{
  setValue(old=>({...old,[key]:numeric?(raw===""?undefined:Number(raw)):raw}))
  setValidation("")
 }
 const addSegment=()=>{const id="seg"+Date.now();setValue(old=>({...old,segmentSets:[...(old.segmentSets??[]),{id,name:"Nueva segmentación",type:"analysis" as const,date:new Date().toISOString().slice(0,10),segmentNames:[]}]}));setSelectedSegmentId(id)}
 const editSegment=(id:string,key:keyof SegmentSet,text:string)=>setValue(old=>({...old,segmentSets:old.segmentSets?.map(s=>s.id===id?{...s,[key]:text}:s)}))
 const normalize=()=>({...value,tags:tagsText.split(",").map(x=>x.trim()).filter(Boolean),customAttributes:Object.fromEntries(attributesText.split("\n").map(x=>x.split(":").map(y=>y.trim())).filter(([k,v])=>k&&v))})
 useEffect(()=>{
  if(!onDirtyChange)return
  const original=dirtyBaseline??initial
  const changed=JSON.stringify(normalize())!==JSON.stringify({...original,tags:original.tags??[],customAttributes:original.customAttributes??{}})
  onDirtyChange(changed)
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[value,tagsText,attributesText,dirtyBaseline])
 function submit(){
  if(!value.name.trim())return setValidation("El nombre es obligatorio.")
  if(kind==="vehicles"){
   if(!value.vehicleType||!value.drivenWheels?.trim()||!(Number(value.referenceWeight)>0))return setValidation("Completá el tipo, peso de referencia positivo y tracción.")
  }
  if(kind==="tracks"&&!value.trackType)return setValidation("Elegí el tipo de trazado.")
  if(kind==="pilots"&&(["experience","speed"] as const).some(k=>value[k]!=null&&(!Number.isInteger(value[k])||(value[k] as number)<1||(value[k] as number)>10)))return setValidation("Las valoraciones deben ser números enteros entre 1 y 10.")
  const attrs=Object.fromEntries(attributesText.split("\n").map(t=>t.split(":").map(s=>s.trim())).filter(([k,v])=>k&&v))
  onSave({...value,name:value.name.trim(),tags:tagsText.split(",").map(s=>s.trim()).filter(Boolean),customAttributes:attrs,segments:value.segmentSets?.length??value.segments})
 }
 return <div className="resource-edit-stack"><Card className="resource-form-card">
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
    <div className="resource-form-section"><h3>Atributos personalizados opcionales</h3><Textarea aria-label="Atributos personalizados" rows={3} placeholder="Clave: valor (uno por línea)" value={attributesText} onChange={e=>setAttributesText(e.target.value)}/><small>Los valores físicos deben indicar su unidad.</small></div>
    {validation&&<p className="resource-form-error" role="alert">{validation}</p>}
    <div className="pill-row"><Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button><Button type="submit">Guardar {kind==="pilots"?"piloto":kind==="vehicles"?"vehículo":"circuito"}</Button></div>
   </form>
  </CardContent>
 </Card>
 {kind==="vehicles"&&<Card className="resource-setups-card">
  <CardHeader><CardTitle>Setups del vehículo</CardTitle><CardDescription>Configuraciones independientes de la ficha. Puede haber cero o cientos de setups; la planilla depende del tipo de vehículo.</CardDescription></CardHeader>
  <CardContent>
   {!editing?<p className="setup-form-note">Guardá primero el vehículo para habilitar sus setups.</p>:<>
   <ShadcnGrid label="Setups del vehículo" rows={value.setups??[]}
    columns={[
      {key:"name",title:"Nombre",value:s=>s.name},
      {key:"date",title:"Fecha",value:s=>s.date??"—",filter:true},
      {key:"detail",title:"Descripción",value:s=>s.detail??"—"}
    ]}
    groupers={[{key:"month",title:"Mes",value:s=>s.date?.slice(0,7)??""}]}
    actions={setup=><>
      <Button type="button" size="sm" variant="outline" onClick={()=>onEditSetup?.(setup.id,normalize())}><Pencil size={14}/>Editar</Button>
      <Button type="button" size="sm" variant="ghost" aria-label={"Eliminar setup "+setup.name} onClick={()=>{if(window.confirm("¿Eliminar el setup "+setup.name+"?"))setValue(old=>({...old,setups:old.setups?.filter(s=>s.id!==setup.id)}))}}><Trash2 size={14}/></Button>
      <Button type="button" size="sm" variant="outline" aria-label={"Compartir setup "+setup.name} onClick={()=>onShare?.("setup "+setup.name)}><Share2 size={14}/></Button>
    </>}
    emptyMessage="El vehículo no tiene setups. Podés crear el primero."/>
   <div className="pill-row"><Button type="button" onClick={()=>onEditSetup?.(null,normalize())}><Plus size={15}/>Nuevo setup</Button></div>
   </>}
  </CardContent>
 </Card>}
 {kind==="tracks"&&<Card className="resource-setups-card track-segmentations-card">
  <CardHeader><CardTitle>Segmentaciones del circuito</CardTitle><CardDescription>Conjuntos de parciales o nomenclatura. La geometría y el detalle de segmentos se muestran como prototipo.</CardDescription></CardHeader>
  <CardContent>
   <ShadcnGrid label="Segmentaciones del circuito" rows={value.segmentSets??[]}
    columns={[
      {key:"name",title:"Nombre",value:s=>s.name},
      {key:"type",title:"Tipo",value:s=>s.type==="analysis"?"Parciales":"Nomenclatura de curvas",filter:true},
      {key:"date",title:"Fecha",value:s=>s.date??"—",filter:true}
    ]}
    groupers={[{key:"tipo",title:"Tipo",value:s=>s.type==="analysis"?"Parciales":"Nomenclatura de curvas"},{key:"month",title:"Fecha (mes)",value:s=>s.date?.slice(0,7)??""}]}
    detail={segment=><div className="track-segment-detail">
      <div><strong>{segment.name}</strong><p>Segmentos: {segment.segmentNames?.length??0}</p><p>Nombres: {segment.segmentNames?.join(", ")||"Sin nombres asignados"}</p><small>Representación de geometría provisional</small></div>
      <svg viewBox="0 0 220 125" role="img" aria-label={"Geometría ilustrativa de "+segment.name}><polyline points="24,87 38,36 95,20 184,51 202,94 139,109 67,100 24,87" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><circle cx="24" cy="87" r="5" fill="currentColor"/><circle cx="139" cy="109" r="5" fill="currentColor"/></svg>
    </div>}
    actions={segment=><>
     <Button type="button" size="sm" variant="outline" onClick={()=>setSelectedSegmentId(segment.id)}><Pencil size={14}/>Editar</Button>
     <Button type="button" size="sm" variant="ghost" aria-label={"Eliminar segmentación "+segment.name} onClick={()=>{if(window.confirm("¿Eliminar la segmentación "+segment.name+"?")){setValue(old=>({...old,segmentSets:old.segmentSets?.filter(x=>x.id!==segment.id)}));if(selectedSegmentId===segment.id)setSelectedSegmentId(null)}}}><Trash2 size={14}/></Button>
     <Button type="button" size="sm" variant="outline" aria-label={"Compartir segmentación "+segment.name} onClick={()=>onShare?.("segmentación "+segment.name)}><Share2 size={14}/></Button>
    </>}
    emptyMessage="No hay segmentaciones asociadas a este circuito."/>
   {selectedSegmentId&&value.segmentSets?.some(s=>s.id===selectedSegmentId)&&(()=>{const segment=value.segmentSets?.find(s=>s.id===selectedSegmentId);if(!segment)return null;return <div className="segment-edit-panel"><h3>Editar segmentación</h3>
     <label>Nombre <Input aria-label="Nombre de la segmentación" value={segment.name} onChange={e=>editSegment(segment.id,"name",e.target.value)}/></label>
     <label>Tipo <select aria-label="Tipo de segmentación" value={segment.type} onChange={e=>editSegment(segment.id,"type",e.target.value)}><option value="analysis">Parciales</option><option value="nomenclature">Nomenclatura de curvas</option></select></label>
     <label>Fecha <Input type="date" aria-label="Fecha de segmentación" value={segment.date??""} onChange={e=>editSegment(segment.id,"date",e.target.value)}/></label>
     <label>Nombres de segmentos (separados por coma) <Input aria-label="Nombres de segmentos" value={(segment.segmentNames??[]).join(", ")} onChange={e=>setValue(old=>({...old,segmentSets:old.segmentSets?.map(s=>s.id===segment.id?{...s,segmentNames:e.target.value.split(",").map(n=>n.trim()).filter(Boolean)}:s)}))}/></label>
     <Button type="button" variant="outline" onClick={()=>setSelectedSegmentId(null)}>Cerrar edición</Button>
   </div>})()}
   <div className="pill-row"><Button type="button" onClick={addSegment}><Plus size={15}/>Nueva segmentación</Button></div>
  </CardContent>
 </Card>}
 </div>
}
