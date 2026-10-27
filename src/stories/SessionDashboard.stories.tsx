import type {Meta,StoryObj} from "@storybook/react-vite"
import {SessionDashboard,SnapshotDetail} from "@/SessionDashboard"
import {initialResources,initialDatasets,initialSessions,captureSnapshot} from "@/data"
const session=initialSessions[0]
const snapshot=captureSnapshot(session,initialResources,initialDatasets)
const meta={title:"Análisis/Resumen de sesión",component:SessionDashboard,args:{session,snapshot,modules:initialResources.modules,onSnapshot:()=>{},onDataset:()=>{},onEdit:()=>{}},parameters:{layout:"fullscreen"}} satisfies Meta<typeof SessionDashboard>
export default meta
type Story=StoryObj<typeof meta>
export const ConModulos:Story={}
export const SinSetup:Story={args:{session:{...session,setup:""},snapshot:{...snapshot,setup:undefined}}}
export const SinFuentes:Story={args:{session:{...session,targets:[],references:[]},snapshot:{...snapshot,sources:[]}}}
export const DetalleHistorico=()=> <SnapshotDetail kind="vehicle" id={snapshot.vehicle?.id??""} snapshot={snapshot} onBack={()=>{}}/>
