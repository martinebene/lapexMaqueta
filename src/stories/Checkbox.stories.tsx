import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "@/components/ui/checkbox"

const meta = { title: "Controles/Checkbox", component: Checkbox, parameters: { layout: "centered" } } satisfies Meta<typeof Checkbox>
export default meta
type Story = StoryObj<typeof meta>
const Labelled = ({initial=false,disabled=false}:{initial?:boolean;disabled?:boolean}) => <label className="flex items-center gap-2 text-sm"><Checkbox aria-label="Seleccionar referencia" defaultChecked={initial} disabled={disabled}/> Rodaje de referencia</label>
export const SinSeleccionar: Story = { render: () => <Labelled/> }
export const Seleccionado: Story = { render: () => <Labelled initial/> }
export const Deshabilitado: Story = { render: () => <Labelled disabled/> }
