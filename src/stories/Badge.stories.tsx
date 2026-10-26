import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@/components/ui/badge"
const meta = { title: "Indicadores/Badge", component: Badge, args: { children: "Disponible" }, parameters: { layout: "centered" } } satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>
export const Principal: Story = { args: { variant: "default" } }
export const Secundario: Story = { args: { variant: "secondary" } }
export const Contorno: Story = { args: { variant: "outline" } }
export const Error: Story = { args: { variant: "destructive", children: "Incumplidos" } }
export const Favorito: Story = { args: { variant: "secondary", children: "Favorito" } }
