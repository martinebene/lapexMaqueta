import { useRef, useState } from "react"
import { ImagePlus, Images, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Resource, ResourceKind } from "./data"

type AvatarKind = Exclude<ResourceKind, "modules">
type CatalogImage = { key: string; label: string; path: string }
const folder = "resource-images/demo-001/"
const assetUrl = (path: string) => import.meta.env.BASE_URL + folder + path

const pilotDescriptions = [
 "Piloto A · rojo y blanco", "Piloto A · azul y amarillo", "Piloto A · verde y dorado",
 "Piloto A · naranja y gris", "Piloto A · blanco y carbono", "Piloto B · magenta y negro",
 "Piloto B · cian y blanco", "Piloto B · violeta y plata", "Piloto B · amarillo y carbón",
 "Piloto B · carmesí y negro", "Piloto C · antracita y rojo",
 "Piloto C · azul marino y plata", "Piloto C · esmeralda y dorado", "Piloto C · borgoña y plata",
]
const numbered = (value: number) => String(value).padStart(3, "0")

export const avatarOptions: Record<AvatarKind, CatalogImage[]> = {
 pilots: pilotDescriptions.map((label, index) => ({
  key: "pilot-" + numbered(index + 1),
  label,
  path: "pilots/pilot-" + numbered(index + 1) + ".jpg",
 })).concat([{ key: "pilot-default", label: "Silueta anterior de piloto", path: "pilots/pilot-default.png" }]),
 tracks: [
  { key: "circuit-001", label: "Autódromo tradicional con paddock", path: "circuits/circuit-001.jpg" },
  { key: "circuit-005", label: "Circuito técnico muy trabado", path: "circuits/circuit-005.jpg" },
  { key: "circuit-008", label: "Óvalo de alta velocidad", path: "circuits/circuit-008.jpg" },
  { key: "circuit-011", label: "Circuito callejero costero", path: "circuits/circuit-011.jpg" },
  { key: "circuit-015", label: "Recorrido abierto de montaña", path: "circuits/circuit-015.jpg" },
  { key: "circuit-default", label: "Silueta anterior de circuito", path: "circuits/circuit-default.png" },
 ],
 vehicles: [
  { key: "touring-001", label: "Turismo Carretera", path: "vehicles/touring/touring-001.jpg" },
  { key: "touring-005", label: "Procar 4000", path: "vehicles/touring/touring-005.jpg" },
  { key: "touring-009", label: "Turismo Nacional · Clase 2", path: "vehicles/touring/touring-009.jpg" },
  { key: "touring-013", label: "Turismo Nacional · Clase 3", path: "vehicles/touring/touring-013.jpg" },
  { key: "touring-017", label: "TC Pick Up", path: "vehicles/touring/touring-017.jpg" },
  { key: "touring-021", label: "Prototipo Sport", path: "vehicles/touring/touring-021.jpg" },
  { key: "formula-001", label: "Fórmula / monoplaza", path: "vehicles/formula/formula-001.jpg" },
  { key: "kart-001", label: "Karting", path: "vehicles/kart/kart-001.jpg" },
  { key: "motorcycle-001", label: "Moto de velocidad", path: "vehicles/motorcycle/motorcycle-001.jpg" },
  { key: "rally-001", label: "Rally", path: "vehicles/rally/rally-001.jpg" },
  { key: "vehicle-default", label: "Silueta anterior de vehículo deportivo", path: "vehicles/vehicle-default.jpg" },
  { key: "vehicle-neutral", label: "Silueta neutra de automóvil", path: "vehicles/vehicle-default.png" },
 ],
}

const defaults: Record<AvatarKind, CatalogImage> = {
 pilots: { key: "pilot-default-2", label: "Imagen genérica de piloto", path: "pilots/pilot-default-2.png" },
 tracks: { key: "circuit-default-2", label: "Imagen genérica de circuito", path: "circuits/circuit-default-2.png" },
 vehicles: { key: "vehicle-default-2", label: "Imagen genérica de vehículo de turismo", path: "vehicles/vehicle-default-2.png" },
}
const labels: Record<AvatarKind, string> = { pilots: "piloto", tracks: "circuito", vehicles: "vehículo" }
function selectedImage(kind: AvatarKind, key?: string): CatalogImage {
 return avatarOptions[kind].find((image) => image.key === key) ?? defaults[kind]
}

export function ResourceAvatar({ kind, resource, size = 76 }: { kind: ResourceKind; resource?: Resource; size?: number }) {
 if (kind === "modules") return null
 const fallback = assetUrl(defaults[kind].path)
 const entry = selectedImage(kind, resource?.avatar)
 const src = resource?.photo || assetUrl(entry.path)
 const description = resource?.photo ? "Imagen propia" : entry.label
 return <img className="resource-avatar" src={src} alt={description + (resource?.name ? " · " + resource.name : "")}
  width={size} height={size} style={{width:size,height:size,minWidth:size,minHeight:size,maxWidth:"none",objectFit:"contain"}} loading="lazy" onError={(event) => {
   if (event.currentTarget.src !== new URL(fallback, document.baseURI).href) event.currentTarget.src = fallback
  }} />
}

export function ResourceAvatarPicker({ kind, value, onChange }: { kind: AvatarKind; value: Resource; onChange: (value: Resource) => void }) {
 const input = useRef<HTMLInputElement>(null)
 const [error, setError] = useState("")
 const [galleryOpen, setGalleryOpen] = useState(false)
 const selected = value.photo ? "Imagen propia" : (avatarOptions[kind].find((item) => item.key === value.avatar)?.label ?? "Imagen predeterminada")
 const choose = (key?: string) => {
  onChange({ ...value, avatar: key, photo: undefined })
  setError("")
  setGalleryOpen(false)
 }
 function load(file?: File) {
  if (!file) return
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 10_000_000) {
   setError("Admitimos PNG, JPG o WebP de hasta 10 MB.")
   return
  }
  const reader = new FileReader()
  reader.onload = () => {
   if (typeof reader.result !== "string") return
   const encoded = reader.result
   const img = new Image()
   img.onload = () => {
    if (img.naturalWidth * img.naturalHeight > 24_000_000) {
     setError("La imagen no puede superar los 24 megapíxeles.")
     return
    }
    onChange({ ...value, photo: encoded, avatar: undefined })
    setError("")
   }
   img.onerror = () => setError("No se pudo interpretar el archivo de imagen.")
   img.src = encoded
  }
  reader.onerror = () => setError("No se pudo leer la imagen.")
  reader.readAsDataURL(file)
 }
 return <section className="avatar-picker" aria-label="Imagen representativa">
  <div className="avatar-picker-head">
   <ResourceAvatar kind={kind} resource={value} size={96} />
   <div className="avatar-picker-information">
    <strong>Imagen del recurso</strong>
    <p className="avatar-selection-status" aria-live="polite">{selected}</p>
    <div className="avatar-picker-actions">
     <Button type="button" variant="outline" size="sm" onClick={() => setGalleryOpen(true)}><Images size={15} />Elegir ilustración</Button>
     <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}><ImagePlus size={15} />Subir imagen</Button>
     <Button type="button" variant="ghost" size="sm" onClick={() => choose()}><RotateCcw size={14} />Restablecer predeterminada</Button>
    </div>
   </div>
  </div>
  <input ref={input} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp"
   aria-label="Subir imagen propia" onChange={(event) => { load(event.target.files?.[0]); event.target.value = "" }} />
  {error && <p className="resource-form-error" role="alert">{error}</p>}
  <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
   <DialogContent className="avatar-gallery-dialog sm:max-w-4xl">
    <DialogHeader>
     <DialogTitle>Elegir ilustración de {labels[kind]}</DialogTitle>
     <DialogDescription>Seleccioná una imagen prediseñada o la representación genérica. La elección reemplaza la imagen actual.</DialogDescription>
    </DialogHeader>
    <div className="avatar-gallery-grid" role="group" aria-label={"Ilustraciones de " + labels[kind]}>
     {[defaults[kind], ...avatarOptions[kind]].map((item) => {
      const isDefault = item.key === defaults[kind].key
      const current = !value.photo && (isDefault ? !avatarOptions[kind].some((opt) => opt.key === value.avatar) : value.avatar === item.key)
      return <Button key={item.key} type="button" variant="outline" className="avatar-gallery-choice"
       aria-label={"Elegir " + item.label} aria-pressed={current} onClick={() => choose(isDefault ? undefined : item.key)}>
       <img src={assetUrl(item.path)} alt="" loading="lazy" />
       <span>{isDefault ? "Predeterminada" : item.label}</span>
      </Button>
     })}
    </div>
    <DialogFooter><Button type="button" variant="outline" onClick={() => setGalleryOpen(false)}>Cancelar</Button></DialogFooter>
   </DialogContent>
  </Dialog>
 </section>
}
