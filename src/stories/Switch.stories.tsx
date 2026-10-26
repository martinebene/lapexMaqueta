import type { Meta, StoryObj } from "@storybook/react-vite"
import { Switch } from "@/components/ui/switch"

const meta = { title: "Controles/Switch", component: Switch, parameters: { layout: "centered" } } satisfies Meta<typeof Switch>
export default meta
type Story = StoryObj<typeof meta>
export const Apagado: Story = { args: { "aria-label": "Activar módulo", defaultChecked: false } }
export const Encendido: Story = { args: { "aria-label": "Activar módulo", defaultChecked: true } }
export const Deshabilitado: Story = { args: { "aria-label": "Activar módulo", disabled: true, defaultChecked: true } }
export const Compacto: Story = { args: { "aria-label": "Activar módulo", size: "sm", defaultChecked: true } }

export const RequisitosIncumplidos: Story = {
 args: { "aria-label":"Módulo bloqueado por requisitos", checked:false, disabled:true }
}
export const DisponibleDesactivado: Story = {
 args: { "aria-label":"Módulo disponible desactivado", defaultChecked:false }
}
export const DisponibleActivado: Story = {
 args: { "aria-label":"Módulo disponible activado", defaultChecked:true }
}
