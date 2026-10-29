import type {Meta,StoryObj} from "@storybook/react-vite"
import {PreferencesPanel} from "@/PreferencesPanel"

// Ambas historias renderizan el componente auténtico y utilizan las preferencias
// del navegador. No representan el catálogo UCUM definitivo del producto.
const meta={
 title:"Configuración/Preferencias",
 component:PreferencesPanel,
 parameters:{layout:"padded"},
} satisfies Meta<typeof PreferencesPanel>
export default meta
type Story=StoryObj<typeof meta>

export const UnidadesYTema:Story={}
export const MagnitudesAmpliadas:Story={
 parameters:{
  docs:{description:{story:"Incluye ángulo, fuerza, frecuencia de giro y tiempo, junto con las alternativas de unidades y conversiones de la maqueta. Las preferencias se guardan localmente."}},
 },
}
