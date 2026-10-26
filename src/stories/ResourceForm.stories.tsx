import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResourceForm } from "@/ResourceForm"
import type { Resource, ResourceKind } from "@/data"
const pilot:Resource={id:"p1",name:"Piloto Demo A",detail:"Ensayos",number:"21",country:"Argentina",city:"Puerto Madryn",experience:7,speed:8}
const vehicle:Resource={id:"v1",name:"GT-04",detail:"Auto de ensayos",vehicleType:"Auto de Turismo",category:"Turismo Pista",referenceWeight:900,drivenWheels:"Delantera",setups:[{id:"su1",name:"Base pista",date:"2026-10-11"}]}
const track:Resource={id:"t1",name:"Circuito Delta",detail:"",trackType:"Cerrado",lengthKm:3.75,segmentSets:[{id:"sega",name:"Parciales carrera",type:"analysis"},{id:"segn",name:"Curvas",type:"nomenclature"}]}
function Demo({kind,initial,editing}:{kind:Exclude<ResourceKind,"modules">;initial:Resource;editing:boolean}){
 const [saved,setSaved]=useState<Resource|null>(null)
 return <div style={{maxWidth:900,margin:"auto"}}><ResourceForm key={kind+(editing?"edit":"new")} kind={kind} initial={initial} editing={editing} onSave={setSaved} onCancel={()=>setSaved(null)}/>{saved&&<p role="status">Registro de demostración guardado: {saved.name}</p>}</div>
}
const meta={title:"Formularios/Recursos",component:ResourceForm,args:{kind:"pilots",initial:pilot,editing:true,onSave:()=>{},onCancel:()=>{}},parameters:{layout:"fullscreen"}} satisfies Meta<typeof ResourceForm>
export default meta
type Story=StoryObj<typeof meta>
export const PilotoEditar:Story={render:()=> <Demo kind="pilots" initial={pilot} editing/>}
export const PilotoNuevo:Story={render:()=> <Demo kind="pilots" initial={{id:"",name:"",detail:""}} editing={false}/>}
export const VehiculoEditar:Story={render:()=> <Demo kind="vehicles" initial={vehicle} editing/>}
export const VehiculoNuevo:Story={render:()=> <Demo kind="vehicles" initial={{id:"",name:"",detail:"",vehicleType:"",setups:[]}} editing={false}/>}
export const CircuitoEditar:Story={render:()=> <Demo kind="tracks" initial={track} editing/>}
export const CircuitoNuevo:Story={render:()=> <Demo kind="tracks" initial={{id:"",name:"",detail:"",trackType:"Cerrado",segmentSets:[]}} editing={false}/>}
