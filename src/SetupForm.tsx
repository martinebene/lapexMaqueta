import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { fieldNames, setupTemplates } from "./setupTemplates"
import type { Setup } from "./data"

interface Props {
  vehicleName:string
  vehicleType:string
  setup:Setup
  onChange:(next:Setup)=>void
  onSave:(next:Setup)=>void
  onCancel:()=>void
}
const positions={
  general:[""],
  axes:["Delantero","Trasero"],
  wheels:["DI","DD","TI","TD"],
} as const

export function SetupForm({vehicleName,vehicleType,setup,onChange,onSave,onCancel}:Props){
  const template=setupTemplates[vehicleType]??[]
  const setField=(field:keyof Setup,value:string)=>onChange({...setup,[field]:value})
  const setParameter=(key:string,value:string)=>onChange({
    ...setup,parameters:{...setup.parameters,[key]:value},
  })
  return <Card className="setup-form-card">
    <CardHeader>
      <CardTitle>{setup.id?"Editar setup":"Nuevo setup"} · {vehicleName}</CardTitle>
      <CardDescription>Planilla de {vehicleType}. Campos exploratorios, pendientes de aprobación definitiva. Todos los reglajes son opcionales: sin completar no equivale a cero.</CardDescription>
    </CardHeader>
    <CardContent>
      <form className="setup-form" onSubmit={event=>{
        event.preventDefault()
        if(!setup.name.trim())return
        const parameters=Object.fromEntries(Object.entries(setup.parameters??{}).filter(([,v])=>v.trim()).map(([k,v])=>[k,v.trim()]))
        onSave({...setup,name:setup.name.trim(),parameters})
      }}>
        <div className="resource-form-fields">
          <label className="resource-form-field"><span>Nombre del setup *</span>
            <Input aria-label="Nombre del setup" required value={setup.name} onChange={event=>setField("name",event.target.value)}/>
          </label>
          <label className="resource-form-field"><span>Fecha descriptiva (opcional)</span>
            <Input aria-label="Fecha del setup" type="date" value={setup.date??""} onChange={event=>setField("date",event.target.value)}/>
          </label>
        </div>
        <label className="resource-form-field"><span>Descripción técnica</span>
          <Textarea aria-label="Descripción del setup" value={setup.detail??""} onChange={event=>setField("detail",event.target.value)}/>
        </label>
        <p className="setup-form-note">Las magnitudes físicas deben informarse con unidad explícita cuando corresponda (por ejemplo, 12 mm, 1,8 bar, 85 N/mm). No se precarga ningún cero.</p>
        {template.map((section,sectionIndex)=><details key={section.title} className="setup-category" >
          <summary><span>{sectionIndex+1}. {section.title}</span><span className="setup-field-count">Parámetros opcionales</span></summary>
          <div className="setup-field-grid">
            {(["general","axes","wheels"] as const).flatMap(scope=>
              positions[scope].flatMap(position=>
                fieldNames(section[scope]).map((title,index)=>{
                  const id=[sectionIndex,scope,position,index].filter(v=>v!=="").join(":")
                  const caption=position?title+" · "+position:title
                  return <label key={id} className="resource-form-field">
                    <span>{caption}</span>
                    <Input aria-label={caption+" · "+section.title}
                      placeholder="Sin informar" value={setup.parameters?.[id]??""}
                      onChange={event=>setParameter(id,event.target.value)}/>
                  </label>
                })
              )
            )}
          </div>
        </details>)}
        <div className="pill-row">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={!setup.name.trim()}>Guardar setup</Button>
        </div>
      </form>
    </CardContent>
  </Card>
}
