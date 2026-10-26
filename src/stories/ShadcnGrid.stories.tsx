import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ShadcnGrid } from "@/ShadcnGrid"

type DemoRecord = { id: string; name: string; track: string; category: string; status: string; available: boolean }
const records: DemoRecord[] = [
  { id:"d1",name:"Rodaje · Tanda 02",track:"Circuito Delta",category:"Turismo",status:"Cumplidos",available:true },
  { id:"d2",name:"Rodaje · Referencia 01",track:"Circuito Delta",category:"Turismo",status:"Cumplidos",available:true },
  { id:"d3",name:"Ensayo previo",track:"",category:"Karting",status:"Incumplidos",available:false },
]
const columns = [
  { key:"name",title:"Nombre",value:(r:DemoRecord)=>r.name,filter:true },
  { key:"track",title:"Circuito",value:(r:DemoRecord)=>r.track || "—",filter:true },
  { key:"category",title:"Categoría",value:(r:DemoRecord)=>r.category,filter:true },
  { key:"status",title:"Requisitos",value:(r:DemoRecord)=>r.status,status:(r:DemoRecord):"success"|"error"=>r.available?"success":"error" },
]
function SelectableGrid({multiple}:{multiple:boolean}) {
  const [selection,setSelection]=useState<string[]>([])
  return <ShadcnGrid label={multiple?"Referencias disponibles":"Objetivos disponibles"}
    rows={records} columns={columns} selection={multiple?"multiple":"single"}
    selected={multiple?selection:(selection[0]??"")}
    onSelect={(id,checked)=>setSelection(old=>checked?(multiple?[...new Set([...old,id])]:[id]):old.filter(x=>x!==id))}
    disabled={r=>!r.available}
    detail={r=><div className="dg-detail"><strong>{r.name}</strong><span>{r.category}</span></div>}/>
}
const meta = {
  title: "Tablas/ShadcnGrid",
  component: ShadcnGrid<DemoRecord>,
  args: { label:"Registros de prueba", rows:records, columns },
  parameters: { layout: "fullscreen" },
  decorators: [(Story: () => React.ReactNode) => <div className="mx-auto w-full max-w-[1150px] p-5"><Story/></div>],
} satisfies Meta<typeof ShadcnGrid<DemoRecord>>
export default meta
type Story = StoryObj<typeof meta>
export const Normal: Story = {}
export const Vacia: Story = { args: { rows:[],emptyMessage:"No hay registros disponibles" } }
export const ConFiltroYAgrupacion: Story = {
  args: { groups:["track","category"], advancedFilterColumns:[{key:"state",title:"Estado",value:(r:DemoRecord)=>r.status}] },
}
export const SeleccionUnica: Story = { render: ()=><SelectableGrid multiple={false}/> }
export const SeleccionMultiple: Story = { render: ()=><SelectableGrid multiple/> }
export const ConDetalleYAcciones: Story = {
  args: {
    detail:(r:DemoRecord)=><div className="dg-detail"><strong>{r.name}</strong><span>Categoría: {r.category}</span></div>,
    actions:(r:DemoRecord)=><Button size="xs" variant="outline" onClick={()=>{void navigator.clipboard?.writeText(r.name)}}>Copiar nombre</Button>,
  },
}
export const Deshabilitada: Story = {
  args: { selection:"single",disabled:(r:DemoRecord)=>!r.available,selected:"d1" },
}

export const ConSwitchDeActivacion: Story = {
  render: () => <ShadcnGrid label="Módulos y estados" rows={records}
    columns={columns}
    leadingControl={r=><Switch aria-label={"Activar "+r.name} disabled={!r.available} defaultChecked={r.id==="d1"}/>}
    detail={r=><p>{r.name} · Estado de ejemplo</p>}/>
}
export const DetalleCompacto: Story = {
  args: {
    selection:"multiple",
    selected:["d1"],
    detail:(r:DemoRecord)=><p className="p-2">Detalle de {r.name}</p>,
    groups:["track"]
  }
}
