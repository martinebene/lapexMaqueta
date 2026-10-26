import type { Meta, StoryObj } from "@storybook/react-vite"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Controles/Entrada de texto",
  component: Input,
  args: { "aria-label": "Nombre de la sesión", placeholder: "Nombre de la sesión" },
  decorators: [(Story) => <div className="w-[330px] max-w-full"><Story/></div>],
} satisfies Meta<typeof Input>
export default meta
type Story = StoryObj<typeof meta>
export const Vacio: Story = {}
export const ConContenido: Story = { args: { defaultValue: "Ensayo de clasificación" } }
export const Deshabilitado: Story = { args: { disabled: true, defaultValue: "No editable" } }
export const Error: Story = { args: { "aria-invalid": true, defaultValue: "Valor inválido" } }
export const Buscador: Story = { render: () => <InputGroup><InputGroupInput aria-label="Buscar registros" placeholder="Buscar"/><InputGroupAddon align="inline-start"><Search aria-hidden="true"/></InputGroupAddon></InputGroup> }
export const Observaciones: Story = { render: () => <Textarea aria-label="Observaciones" placeholder="Notas sobre la sesión" rows={3}/> }
