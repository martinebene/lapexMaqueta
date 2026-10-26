import type { Meta, StoryObj } from "@storybook/react-vite"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
const meta = { title: "Indicadores/Alerta", component: Alert, args: { children: null }, parameters: { layout: "centered" } } satisfies Meta<typeof Alert>
export default meta
type Story = StoryObj<typeof meta>
export const Informativa: Story = { render: () => <Alert className="w-[430px] max-w-full"><AlertTitle>Setups disponibles</AlertTitle><AlertDescription>Elegí una configuración para continuar.</AlertDescription></Alert> }
export const Error: Story = { render: () => <Alert variant="destructive" className="w-[430px] max-w-full"><AlertTitle>Requisitos incumplidos</AlertTitle><AlertDescription>Seleccioná un rodaje antes de utilizar el módulo.</AlertDescription></Alert> }
