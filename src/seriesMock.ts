import type {Dataset} from "./data"
export type SeriesDef={id:string;name:string;unit:string;hz:number}
export type Sample={id:string;time:number;value:number}
export type Segment={id:string;name:string;start:number;end:number}
export type Group={id:string;name:string;segments:Segment[]}
export const DURATION=1200
const defs:SeriesDef[]=[{id:"speed",name:"Velocidad",unit:"km/h",hz:2},{id:"rpm",name:"RPM",unit:"rpm",hz:5},{id:"g",name:"Aceleración lateral",unit:"g",hz:10}]
export const seriesOf=(d:Dataset)=>d.type==="run"?defs:[]
export const groupsOf=(d:Dataset):Group[]=>d.type==="run"?[
 {id:"laps",name:"Vueltas",segments:Array.from({length:12},(_,i)=>({id:"lap"+(i+1),name:"Vuelta "+(i+1),start:i*100,end:(i+1)*100}))},
 {id:"stints",name:"Tandas",segments:[{id:"st1",name:"Tanda 1",start:0,end:400},{id:"st2",name:"Tanda 2",start:400,end:800},{id:"st3",name:"Tanda 3",start:800,end:1200}]}]:[]
export function samplesOf(datasetId:string,s:SeriesDef):Sample[]{
 const offset=datasetId.charCodeAt(1)%11
 return Array.from({length:DURATION*s.hz},(_,i)=>{
  const time=i/s.hz,phase=2*Math.PI*(time+offset)/100
  const value=s.id==="speed"?135+45*Math.sin(phase)+16*Math.sin(3*phase):s.id==="rpm"?5700+1600*Math.sin(phase)+490*Math.cos(2*phase):.65*Math.sin(2*phase)+.25*Math.cos(4*phase)
  return {id:String(i),time,value:Number(value.toFixed(3))}
 })
}
