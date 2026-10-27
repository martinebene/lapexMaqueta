import type {Meta,StoryObj} from "@storybook/react-vite"
import {HomeLanding} from "@/HomeLanding"
const meta={title:"Navegación/Inicio",component:HomeLanding,args:{onSessions:()=>{},onLibrary:()=>{},onHelp:()=>{}},parameters:{layout:"fullscreen"}} satisfies Meta<typeof HomeLanding>
export default meta
type Story=StoryObj<typeof meta>
export const Portada:Story={}
