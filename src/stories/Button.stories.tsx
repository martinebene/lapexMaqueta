import type { Meta, StoryObj } from "@storybook/react-vite"
import { LoaderCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Controles/Boton",
  component: Button,
  parameters: { layout: "centered" },
  args: { children: "Guardar" },
  argTypes: {
    variant: { control: "select", options: ["default","outline","secondary","ghost","destructive","link"] },
    size: { control: "select", options: ["xs","sm","default","lg","icon","icon-xs","icon-sm","icon-lg"] },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>
export const Primario: Story = { args: { children: "Guardar cambios", variant: "default" } }
export const Secundario: Story = { args: { children: "Cancelar", variant: "outline" } }
export const Destructivo: Story = { args: { children: "Eliminar", variant: "destructive" } }
export const Deshabilitado: Story = { args: { children: "No disponible", disabled: true } }
export const Pequeno: Story = { args: { children: "Aplicar", size: "xs" } }
export const Grande: Story = { args: { children: "Crear sesión", size: "lg" } }
export const ConIcono: Story = { args: { children: <><Plus data-icon="inline-start"/> Nuevo registro</> } }
export const Cargando: Story = { args: { children: <><LoaderCircle className="animate-spin"/> Guardando...</>, disabled: true } }
