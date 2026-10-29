import {useEffect,useState} from "react"
import {UserRound,ShieldCheck,CreditCard,KeyRound,ChartNoAxesColumnIncreasing,Download,Trash2,Lock,CheckCircle2,Bell} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {NativeSelect} from "@/components/ui/native-select"
import {Switch} from "@/components/ui/switch"
import type {Dataset,Session} from "./data"
type Props={plan:"Free"|"Pro";datasets:Dataset[];sessions:Session[];storageUsed:number;storageTotal:number;onMembership:()=>void}
const values=[5,8,7,12,14,11,18,15,24,19,28,23]
export function AccountPanel({plan,datasets,sessions,storageUsed,storageTotal,onMembership}:Props){
 const [period,setPeriod]=useState("90")
 const [message,setMessage]=useState("")
 const [name,setName]=useState("Usuario de demostración")
 const [realName,setRealName]=useState("")
 const [phone,setPhone]=useState("")
 const [address,setAddress]=useState("")
 const [billingAddress,setBillingAddress]=useState("")
 const [notifications,setNotifications]=useState<Record<string,boolean>>(()=>{
  const defaults={updates:true,promotions:false,billing:true,shared:true,imports:false}
  try {return {...defaults,...JSON.parse(localStorage.getItem("lapex-demo-notifications")||"{}")}}
  catch{return defaults}
 })
 useEffect(()=>{localStorage.setItem("lapex-demo-notifications",JSON.stringify(notifications))},[notifications])
 const [editing,setEditing]=useState(false)
 const mfa=false
 function demo(what:string){setMessage(what+" es una función demostrativa; no se realizó ninguna operación en una cuenta real.")}
 function danger(){if(window.confirm("¿Deseás solicitar la eliminación de la cuenta? En Lapex se requerirá reautenticación y habrá 7 días para cancelar la solicitud."))demo("La solicitud de eliminación")}
 const sequence=period==="30"?values.slice(-4):period==="90"?values.slice(-7):values
 return <div className="account-stack">
 <div className="account-grid">
  <Card><CardHeader><CardTitle><UserRound size={19}/>Perfil personal</CardTitle><CardDescription>Datos básicos de tu cuenta</CardDescription></CardHeader><CardContent className="account-detail">
   <label>Nombre de usuario visible<Input aria-label="Nombre de usuario visible" value={name} disabled={!editing} onChange={e=>setName(e.target.value)}/></label>
   <label>Nombre real<Input aria-label="Nombre real" value={realName} disabled={!editing} onChange={e=>setRealName(e.target.value)} placeholder="Nombre y apellido"/></label>
   <label>Teléfono<Input aria-label="Teléfono" type="tel" value={phone} disabled={!editing} onChange={e=>setPhone(e.target.value)} placeholder="Opcional"/></label>
   <label>Dirección personal<Input aria-label="Dirección personal" value={address} disabled={!editing} onChange={e=>setAddress(e.target.value)} placeholder="Opcional"/></label>
   <label>Dirección de facturación<Input aria-label="Dirección de facturación" value={billingAddress} disabled={!editing} onChange={e=>setBillingAddress(e.target.value)} placeholder="Opcional"/></label>
   <label>Correo electrónico de registro<Input aria-label="Correo electrónico de registro" value="usuario@ejemplo.com" disabled readOnly/></label>
   <span>Datos exclusivamente demostrativos. No se guardan en una cuenta real ni se envían a un servicio.</span>
   <Button variant="outline" onClick={()=>{setEditing(v=>!v);if(editing)demo("Guardar el perfil")}}>{editing?"Guardar perfil":"Editar perfil"}</Button>
  </CardContent></Card>
  <Card><CardHeader><CardTitle><Bell size={19}/>Notificaciones</CardTitle><CardDescription>Preferencias de avisos para tu cuenta (simulación local).</CardDescription></CardHeader>
  <CardContent className="account-notification-list">
  {([
    ["updates","Actualizaciones y nuevas funcionalidades","Novedades de Lapex y mejoras del producto"],
    ["promotions","Promociones","Ofertas y comunicaciones comerciales opcionales"],
    ["billing","Estado de cuenta y facturación","Movimientos, pagos y datos del plan"],
    ["shared","Contenido compartido conmigo","Avisos cuando otros usuarios compartan recursos"],
    ["imports","Importaciones y procesos","Finalización o error de operaciones prolongadas (función futura)"]
   ] as const).map(([key,label,help])=><label key={key}>
    <span>{label}<small>{help}</small></span>
    <Switch aria-label={label} checked={notifications[key]} onCheckedChange={checked=>setNotifications(old=>({...old,[key]:checked}))}/>
   </label>)}
   <p className="unit-note">Los avisos esenciales de seguridad no se pueden desactivar. En esta maqueta no se envían notificaciones reales.</p>
  </CardContent></Card>
  <Card><CardHeader><CardTitle><ShieldCheck size={19}/>Seguridad y acceso</CardTitle><CardDescription>Contraseña y dispositivos</CardDescription></CardHeader><CardContent className="account-detail">
   <div className="account-line"><span>Proveedor de acceso</span><strong>Auth0 · Email o Google</strong></div>
   <Button variant="outline" onClick={()=>demo("Recuperar contraseña mediante Auth0")}><Lock size={15}/>Restablecer contraseña</Button>
   <label className="account-line"><span>Autenticación con aplicación (TOTP)</span><input type="checkbox" checked={mfa} onChange={()=>demo("Activar MFA")} aria-label="Habilitar MFA (demostración)"/></label>
   <span>Estado de MFA: {mfa?"Habilitada":"No configurada"}</span>
   <Button variant="ghost" onClick={()=>demo("Gestionar sesiones y dispositivos")}>Ver sesiones activas</Button>
  </CardContent></Card>
  <Card><CardHeader><CardTitle><CreditCard size={19}/>Suscripción y membresía</CardTitle><CardDescription>Información de plan y facturación</CardDescription></CardHeader><CardContent className="account-detail">
   <div className="account-plan"><span>Plan actual</span><strong>{plan}</strong></div>
   <span>Gestión de pagos mediante Lemon Squeezy</span>
   <Button variant="outline" onClick={onMembership}>Ver y gestionar plan</Button>
   <Button variant="ghost" onClick={()=>demo("Consultar facturación")}>Facturas y pagos</Button>
   <Button variant="ghost" onClick={()=>demo("Consultar referidos y beneficios")}>Referidos y beneficios</Button>
  </CardContent></Card>
  <Card><CardHeader><CardTitle><KeyRound size={19}/>Credenciales de IA</CardTitle><CardDescription>Gestioná las conexiones de proveedores</CardDescription></CardHeader><CardContent className="account-detail">
   <div className="account-line"><span>Credenciales activas</span><strong>0</strong></div>
   <p>Podrás cargar varias credenciales y elegir una activa. Las claves permanecerán ocultas.</p>
   <Button variant="outline" onClick={()=>demo("Administrar credenciales de IA")}>Administrar API keys</Button>
  </CardContent></Card>
 </div>
 <Card className="account-usage-card"><CardHeader><div className="account-usage-heading"><div><CardTitle><ChartNoAxesColumnIncreasing size={19}/>Uso y estadísticas</CardTitle><CardDescription>Indicadores de la maqueta basados en registros de ejemplo.</CardDescription></div>
 <NativeSelect aria-label="Período de estadísticas" value={period} onChange={e=>setPeriod(e.target.value)}><option value="30">30 días</option><option value="90">90 días</option><option value="365">12 meses</option></NativeSelect></div></CardHeader>
 <CardContent>
  <div className="account-metrics"><div><small>Sesiones de análisis</small><strong>{sessions.length}</strong></div><div><small>Datos importados</small><strong>{datasets.length}</strong></div><div><small>Espacio utilizado</small><strong>{storageUsed.toLocaleString("es-AR")} MB</strong></div><div><small>Disponible</small><strong>{Math.max(0,storageTotal-storageUsed).toLocaleString("es-AR")} MB</strong></div></div>
  <div className="usage-chart-block"><h3>Evolución de la actividad</h3><svg viewBox="0 0 720 190" role="img" aria-label="Gráfico demostrativo de evolución de actividad"><path d="M18 160H702M18 105H702M18 50H702" fill="none" stroke="currentColor" opacity=".14"/>{sequence.map((v,i)=>{const w=670/sequence.length;return <rect key={i} x={25+i*w} y={165-v*4.1} width={Math.max(10,w-14)} height={v*4.1} rx="4" fill="var(--primary)" opacity=".75"/>})}</svg><p>Actividad de ejemplo por período, no corresponde a mediciones reales.</p></div>
  <div className="account-storage"><div><strong>Almacenamiento</strong><span>{storageUsed} MB usados / {storageTotal} MB totales</span></div><progress aria-label="Almacenamiento utilizado en la cuenta" value={storageUsed} max={storageTotal}/></div>
  <p className="unit-note">Los límites del plan y el consumo por módulos se mostrarán cuando existan métricas verificables.</p>
 </CardContent></Card>
 <Card><CardHeader><CardTitle><Download size={19}/>Privacidad y datos</CardTitle><CardDescription>Exportación y control de tus datos personales.</CardDescription></CardHeader><CardContent className="account-actions">
 <Button variant="outline" onClick={()=>demo("Exportar cuenta")}><Download size={15}/>Solicitar exportación</Button>
 <Button variant="ghost" onClick={()=>demo("Revisar privacidad")}>Preferencias de privacidad</Button>
 <Button variant="ghost" onClick={()=>demo("Revisar memoria de Lapex")}>Memoria de Lapex</Button>
 <p>En el producto, una exportación preparada estará disponible durante 7 días y no contendrá credenciales secretas.</p>
 </CardContent></Card>
 <Card className="account-danger"><CardHeader><CardTitle><Trash2 size={19}/>Eliminar cuenta</CardTitle><CardDescription>Esta operación requiere reautenticación y confirmación. El producto contempla 7 días para cancelar una solicitud antes de su eliminación definitiva.</CardDescription></CardHeader><CardContent>
 <Button variant="destructive" onClick={danger}><Trash2 size={15}/>Eliminar cuenta</Button>
 </CardContent></Card>
 {message&&<div role="status" className="account-notice"><CheckCircle2 size={17}/>{message}<Button variant="ghost" size="sm" onClick={()=>setMessage("")}>Cerrar</Button></div>}
 </div>
}
