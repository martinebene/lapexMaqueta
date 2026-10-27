import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SetupForm } from "@/SetupForm"
import { vehicleTypes } from "@/setupTemplates"
import type { Setup } from "@/data"

function Demo({vehicleType}:{vehicleType:string}) {
 const [setup,setSetup]=useState<Setup>({id:"",name:"",parameters:{}})
 const [saved,setSaved]=useState(false)
 return <div className="mx-auto max-w-[1100px] p-5">
  <SetupForm vehicleName="Vehículo de prueba" vehicleType={vehicleType} setup={setup}
   onChange={next=>{setSetup(next);setSaved(false)}}
   onSave={next=>{setSetup({...next,id:"setup-story"});setSaved(true)}}
   onCancel={()=>setSetup({id:"",name:"",parameters:{}})}/>
  {saved&&<p role="status">Setup guardado: {setup.name}</p>}
 </div>
}
const meta={title:"Formularios/Planillas de setups",component:SetupForm,
 args:{vehicleName:"Vehículo de prueba",vehicleType:"Auto de Turismo",setup:{id:"",name:"",parameters:{}},onChange:()=>{},onSave:()=>{},onCancel:()=>{}},
 parameters:{layout:"fullscreen"}} satisfies Meta<typeof SetupForm>
export default meta
type Story=StoryObj<typeof meta>
export const Moto:Story={render:()=><Demo vehicleType={vehicleTypes[0]}/>} // Moto de velocidad
export const Karting:Story={render:()=><Demo vehicleType={vehicleTypes[1]}/>} // Karting
export const Formula:Story={render:()=><Demo vehicleType={vehicleTypes[2]}/>} // Auto de Fórmula
export const Turismo:Story={render:()=><Demo vehicleType={vehicleTypes[3]}/>} // Auto de Turismo
export const Rally:Story={render:()=><Demo vehicleType={vehicleTypes[4]}/>} // Vehículo de Rally
