import type {Meta,StoryObj} from "@storybook/react-vite"
import {ResourceAvatar,ResourceAvatarPicker} from "@/ResourceAvatar"
import {initialResources} from "@/data"
const meta={title:"Recursos/Avatares vectoriales",component:ResourceAvatar,parameters:{layout:"padded"}} satisfies Meta<typeof ResourceAvatar>
export default meta
type Story=StoryObj<typeof meta>
export const Piloto:Story={args:{kind:"pilots",resource:initialResources.pilots[0],size:115}}
export const Circuito:Story={args:{kind:"tracks",resource:initialResources.tracks[0],size:115}}
export const Vehiculo:Story={args:{kind:"vehicles",resource:initialResources.vehicles[0],size:115}}
export const Selector=()=> <ResourceAvatarPicker kind="pilots" value={initialResources.pilots[0]} onChange={()=>{}}/>
