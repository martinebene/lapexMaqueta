import {useEffect,useState} from "react"
import type {Resource,Session} from "./data"

type Position={latitude:number;longitude:number}
const radians=(degrees:number)=>degrees*Math.PI/180

/** Distancia geodésica aproximada; NO representa recorrido en ruta ni longitud del circuito. */
export function circuitDistanceKm(track:Resource,position:Position|null):number|null{
 if(!position)return null
 const point=track.geometry?.find(([lon,lat])=>Number.isFinite(lon)&&Number.isFinite(lat)&&Math.abs(lon)<=180&&Math.abs(lat)<=90)
 if(!point)return null
 const [lon,lat]=point
 const deltaLat=radians(lat-position.latitude),deltaLon=radians(lon-position.longitude)
 const a=Math.sin(deltaLat/2)**2+Math.cos(radians(position.latitude))*Math.cos(radians(lat))*Math.sin(deltaLon/2)**2
 return 6371.0088*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)))
}
export function distanceText(value:number|null):string{
 return value==null?"No disponible":value.toLocaleString("es-AR",{maximumFractionDigits:1})+" km"
}

/** Sólo usa sesiones sintéticas para ordenar en la maqueta. No es métrica real del producto. */
export function rankRecent<T extends Resource>(items:T[],sessions:Session[],field:"pilot"|"vehicle"):T[]{
 const score=new Map<string,number>()
 // El orden del array DEMO representa recencia relativa, no fechas de actividad verificadas.
 sessions.forEach((session,i)=>score.set(session[field],(score.get(session[field])??0)+Math.pow(0.8,i)))
 return [...items].sort((a,b)=>(score.get(b.id)??0)-(score.get(a.id)??0)||a.name.localeCompare(b.name,"es"))
}

/** Sólo consulta la ubicación del dispositivo si ya hay permiso o por acción del usuario. */
export function useCircuitLocation(){
 const [position,setPosition]=useState<Position|null>(null)
 const [status,setStatus]=useState<"idle"|"loading"|"ready"|"denied"|"unavailable">("idle")
 const request=()=>{
  if(!navigator.geolocation){setStatus("unavailable");return}
  setStatus("loading")
  navigator.geolocation.getCurrentPosition(
   current=>{setPosition({latitude:current.coords.latitude,longitude:current.coords.longitude});setStatus("ready")},
   error=>{setPosition(null);setStatus(error.code===1?"denied":"unavailable")},
   {enableHighAccuracy:false,timeout:8000,maximumAge:60000},
  )
 }
 useEffect(()=>{
  if(!navigator.permissions?.query)return
  let cancelled=false
  navigator.permissions.query({name:"geolocation"}).then(result=>{
   if(!cancelled&&result.state==="granted")request()
  }).catch(()=>{/* El permiso se solicita sólo mediante el botón. */})
  return ()=>{cancelled=true}
 },[])
 return {position,status,request}
}
