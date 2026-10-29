import {useState} from "react"
import type {Meta,StoryObj} from "@storybook/react-vite"
import {ResourceAvatar,ResourceAvatarPicker} from "@/ResourceAvatar"
import {initialResources} from "@/data"
import type {Resource, ResourceKind} from "@/data"
const meta={title:"Recursos/Galería de imágenes",component:ResourceAvatar,parameters:{layout:"padded"}} satisfies Meta<typeof ResourceAvatar>
export default meta
type Story=StoryObj<typeof meta>
export const PilotoPredeterminado:Story={args:{kind:"pilots",resource:initialResources.pilots[0],size:115}}
export const CircuitoPredeterminado:Story={args:{kind:"tracks",resource:initialResources.tracks[0],size:115}}
export const VehiculoPredeterminado:Story={args:{kind:"vehicles",resource:initialResources.vehicles[0],size:115}}
export const PilotoPredisenado:Story={args:{kind:"pilots",resource:{...initialResources.pilots[0],avatar:"pilot-001"},size:115}}
export const CircuitoPredisenado:Story={args:{kind:"tracks",resource:{...initialResources.tracks[0],avatar:"circuit-011"},size:115}}
export const VehiculoPredisenado:Story={args:{kind:"vehicles",resource:{...initialResources.vehicles[0],avatar:"touring-017"},size:115}}
function InteractiveSelector({kind}:{kind:Exclude<ResourceKind,"modules">}){
 const initial=kind==="pilots"?initialResources.pilots[0]:kind==="tracks"?initialResources.tracks[0]:initialResources.vehicles[0]
 const [value,setValue]=useState<Resource>(initial)
 return <div style={{maxWidth:700}}><ResourceAvatarPicker kind={kind} value={value} onChange={setValue}/></div>
}
export const SelectorPiloto=()=> <InteractiveSelector kind="pilots"/>
export const SelectorCircuito=()=> <InteractiveSelector kind="tracks"/>
export const SelectorVehiculo=()=> <InteractiveSelector kind="vehicles"/>
