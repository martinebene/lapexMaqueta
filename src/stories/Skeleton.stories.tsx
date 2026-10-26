import type { Meta, StoryObj } from "@storybook/react-vite"
import { Skeleton } from "@/components/ui/skeleton"
const meta = { title: "Indicadores/Skeleton", component: Skeleton, parameters: { layout: "centered" } } satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>
export const Linea: Story = { args: { className: "h-4 w-52" } }
export const TarjetaCargando: Story = { render: () => <div className="flex w-[310px] flex-col gap-3 rounded-lg border border-border bg-card p-5"><Skeleton className="h-5 w-40"/><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-4/5"/><Skeleton className="h-14 w-full"/></div> }
