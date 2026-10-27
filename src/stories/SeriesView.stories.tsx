import type {Meta,StoryObj} from "@storybook/react-vite"
import {SeriesView} from "@/SeriesView"
import {initialDatasets} from "@/data"
const meta={title:"Datos/Series de datos",component:SeriesView,args:{dataset:initialDatasets[0],seriesId:"speed",onBack:()=>{}},parameters:{layout:"fullscreen"}} satisfies Meta<typeof SeriesView>
export default meta
type Story=StoryObj<typeof meta>
export const Velocidad:Story={}
export const RPM:Story={args:{seriesId:"rpm"}}
export const AceleracionLateral:Story={args:{seriesId:"g"}}
