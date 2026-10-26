import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const meta = {
  title: "Contenedores/Tarjeta",
  component: Card,
  parameters: { layout: "centered" },
  args: { children: null, style: { width: 370, maxWidth: "100%" } },
  render: (args) => <Card {...args}><CardHeader><CardTitle>Datos de la sesión</CardTitle><CardDescription>Resumen y acciones del contexto.</CardDescription></CardHeader><CardContent><p>Sesión de ensayo · Circuito Delta</p></CardContent><CardFooter><Button size="sm">Abrir sesión</Button></CardFooter></Card>,
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>
export const Normal: Story = {}
export const Compacta: Story = { args: { size: "sm" } }
export const Vacia: Story = { render: (args) => <Card {...args}><CardHeader><CardTitle>Sin registros</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Todavía no hay contenido disponible.</p></CardContent></Card> }
export const Cargando: Story = { render: (args) => <Card {...args}><CardHeader><Skeleton className="h-5 w-40"/><Skeleton className="h-3 w-48"/></CardHeader><CardContent><Skeleton className="h-16 w-full"/></CardContent></Card> }
