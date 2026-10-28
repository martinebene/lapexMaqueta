import { useRef,useState } from "react"
import { ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Resource,ResourceKind } from "./data"

const palette=["#118b98","#d66d49","#725caa","#348c71","#d59e3b","#5473bc","#aa5466","#4b8db1"]
const skin=["#e8b993","#ab7655","#ecc8a4","#8d563e","#c28b68","#684733"]
export const avatarOptions={pilots:["piloto-1","piloto-2","piloto-3","piloto-4","piloto-5","piloto-6"],tracks:["trazado-1","trazado-2","trazado-3","trazado-4","trazado-5"],vehicles:["turismo-1","formula-1","karting-1","turismo-2","formula-2","karting-2","rally-1","moto-1"]} as const
type AvatarKind=Exclude<ResourceKind,"modules">
const fallback=(kind:ResourceKind,resource?:Resource)=>kind==="pilots"?"piloto-1":kind==="tracks"?"trazado-1":resource?.vehicleType==="Moto de velocidad"?"moto-1":resource?.vehicleType==="Karting"?"karting-1":resource?.vehicleType==="Auto de Fórmula"?"formula-1":resource?.vehicleType==="Vehículo de Rally"?"rally-1":"turismo-1"
const traces=["M17 66 29 21 59 16 80 32 69 74 43 83Z","M21 21 75 21 62 42 77 72 31 76 18 49Z","M48 13 76 32 72 60 41 81 17 65 27 35Z","M14 47 40 16 76 22 83 63 58 78 29 67Z","M25 24 69 17 83 43 67 77 25 78 15 50Z"]
export function ResourceAvatar({kind,resource,size=76}:{kind:ResourceKind;resource?:Resource;size?:number}){
 const key=resource?.avatar||fallback(kind,resource)
 const index=Math.max(0,Number(key.match(/\d+$/)?.[0]||"1")-1)
 const color=palette[(index+(key.startsWith("rally")?2:0))%palette.length]
 const line={stroke:"#273e49",strokeWidth:2.4,strokeLinejoin:"round" as const}
 if(resource?.photo)return <img className="resource-avatar" src={resource.photo} alt={"Imagen de "+(resource.name||"recurso")} width={size} height={size}/>
 return <svg className="resource-avatar" viewBox="0 0 96 96" width={size} height={size} role="img" aria-label={"Avatar ilustrado de "+(resource?.name||kind)}>
 <rect width="96" height="96" rx="15" fill="#e8f1f2"/>
 {kind==="pilots"?<>
  <path d="M9 94Q14 58 36 54H59Q83 58 87 94Z" fill={color} {...line}/>
  <path d="M42 56 33 71 49 77 63 71 54 56" fill="#f4f7f8" {...line}/>
  <path d="M35 28Q33 10 48 10Q67 10 63 29V45Q57 59 49 60Q39 59 35 45Z" fill={skin[index%skin.length]} {...line}/>
  <path d={index%2?"M32 41Q20 7 44 7Q71 1 69 43L61 52 60 25 36 25 37 52Z":"M33 34Q25 7 47 7Q72 8 65 34L59 25H39Z"} fill={["#50382e","#32292d","#bb7a3a","#4b2929","#d5a354","#322d2b"][index%6]}/>
  <path d="M41 39h3M53 39h3M44 49q5 3 9 0" stroke="#654638" strokeWidth="1.7" fill="none"/>
  <circle cx="72" cy="75" r="18" fill="#f5f5f5" {...line}/><path d="M55 76Q72 58 89 77M72 57V93M59 82H85" stroke={color} strokeWidth="3" fill="none"/>
 </>:kind==="tracks"?<>
  <path d={traces[index%5]} fill="none" stroke="#b8cbd0" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round"/>
  <path d={traces[index%5]} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 5"/>
  <circle cx="29" cy="21" r="4" fill="#273e49"/>
 </>:<>
  <ellipse cx="48" cy="79" rx="37" ry="6" fill="#b5c9d0"/>
  {key.startsWith("karting")?<><path d="M22 61 33 48H68L80 61 73 72H23Z" fill={color} {...line}/><path d="M41 46V34H56V46" fill="none" {...line}/><circle cx="48" cy="39" r="8" fill="#e3b18d" {...line}/></>:
   key.startsWith("moto")?<><path d="M22 67 44 44 66 47 77 67" stroke={color} strokeWidth="8" fill="none"/><path d="M36 54 45 35 56 44 65 58" fill="none" {...line}/></>:
   key.startsWith("formula")?<><path d="M14 60 34 52 46 33H57L64 52 83 60 78 69H18Z" fill={color} {...line}/><path d="M15 56H81" stroke="#f7f7f7" strokeWidth="4"/></>:
   <><path d={key==="turismo-2"?"M11 62 18 49 37 46 44 31H64L73 44 84 49 87 62V69H11Z":key.startsWith("rally")?"M11 62 18 47 37 41 43 27H65L77 43 85 53 87 68H11Z":"M13 62 22 44 36 42 44 28H65L76 43 84 58V69H13Z"} fill={color} {...line}/><path d={key==="turismo-2"?"M41 46 49 35H61L69 46Z":"M41 43 49 33H62L69 43Z"} fill="#d9ecee" {...line}/>{key.startsWith("rally")&&<path d="M32 53H62M42 60H58" stroke="#f6f7f7" strokeWidth="4"/>}</>}
  <circle cx="28" cy="70" r="9" fill="#253a44"/><circle cx="69" cy="70" r="9" fill="#253a44"/><circle cx="28" cy="70" r="4" fill="#a3bac1"/><circle cx="69" cy="70" r="4" fill="#a3bac1"/>
 </>}
 </svg>
}
export function ResourceAvatarPicker({kind,value,onChange}:{kind:AvatarKind;value:Resource;onChange:(value:Resource)=>void}){
 const input=useRef<HTMLInputElement>(null)
 const [error,setError]=useState("")
 const preset=(avatar:string)=>{onChange({...value,avatar,photo:undefined});setError("")}
 function load(file?:File){
  if(!file)return
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>2000000){setError("Admitimos PNG, JPG o WebP de hasta 2 MB.");return}
  const reader=new FileReader()
  reader.onload=()=>{if(typeof reader.result==="string"){onChange({...value,photo:reader.result,avatar:undefined});setError("")}}
  reader.onerror=()=>setError("No se pudo cargar la imagen.")
  reader.readAsDataURL(file)
 }
 return <section className="avatar-picker" aria-label="Imagen representativa">
  <div className="avatar-picker-head"><ResourceAvatar kind={kind} resource={value} size={96}/><div><strong>Imagen del recurso</strong><p>Elegí una ilustración o subí una imagen propia.</p><div className="pill-row"><Button type="button" variant="outline" size="sm" onClick={()=>input.current?.click()}><ImagePlus size={15}/>Subir imagen</Button><Button type="button" variant="ghost" size="sm" onClick={()=>preset(fallback(kind,value))}>Predeterminada</Button></div></div></div>
  <input ref={input} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Subir imagen propia" onChange={e=>load(e.target.files?.[0])}/>
  {error&&<p className="resource-form-error" role="alert">{error}</p>}
  <div className="avatar-preset-grid" role="group" aria-label="Biblioteca de ilustraciones">{avatarOptions[kind].map(key=><button key={key} type="button" aria-label={"Elegir "+key} aria-pressed={!value.photo&&(value.avatar||fallback(kind,value))===key} onClick={()=>preset(key)}><ResourceAvatar kind={kind} resource={{...value,avatar:key,photo:undefined}} size={59}/></button>)}</div>
 </section>
}