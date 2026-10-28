import type {Meta,StoryObj} from "@storybook/react-vite"
import {AccountPanel} from "@/AccountPanel"
import {initialDatasets,initialSessions} from "@/data"
const meta={title:"Configuración/Mi cuenta",component:AccountPanel,args:{plan:"Free",datasets:initialDatasets,sessions:initialSessions,storageUsed:112,storageTotal:2048,onMembership:()=>{}},parameters:{layout:"padded"}} satisfies Meta<typeof AccountPanel>
export default meta
type Story=StoryObj<typeof meta>
export const Free:Story={}
export const Pro:Story={args:{plan:"Pro"}}
