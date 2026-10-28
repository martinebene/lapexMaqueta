import type {Meta,StoryObj} from "@storybook/react-vite"
import {PreferencesPanel} from "@/PreferencesPanel"
const meta={title:"Configuración/Preferencias",component:PreferencesPanel,parameters:{layout:"padded"}} satisfies Meta<typeof PreferencesPanel>
export default meta
type Story=StoryObj<typeof meta>
export const UnidadesYTema:Story={}
