import {Activity,Flag,Layers3,Radio,BookOpen,ArrowUpRight} from "lucide-react"
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
const updates=[
 {date:"Próximamente",tag:"Análisis",title:"Comparación de vueltas y parciales",detail:"Una nueva forma de estudiar intervalos, consistencia y evolución de los tiempos."},
 {date:"En preparación",tag:"Biblioteca",title:"Tus datos, organizados",detail:"Rodajes, circuitos y canales en un entorno único para explorar tus registros."},
 {date:"Vista previa",tag:"Plataforma",title:"Paneles adaptados a cada disciplina",detail:"Módulos para turismos, fórmulas, motos, karting y rally."}
]
export function HomeLanding({onSessions,onLibrary,onHelp}:{onSessions:()=>void;onLibrary:()=>void;onHelp:()=>void}){
 return <div className="lapex-start">
  <Card className="start-hero"><CardContent><div className="start-hero-content">
   <div className="start-eyebrow"><Activity size={16}/> INTELIGENCIA PARA EL MOTORSPORT</div>
   <h2>Convertí cada giro en información para mejorar.</h2>
   <p>Lapex reúne rodajes, telemetría y contexto de pista para ayudarte a interpretar el rendimiento y tomar mejores decisiones.</p>
   <div className="pill-row"><Button onClick={onSessions}>Abrir mis análisis <ArrowUpRight size={16}/></Button><Button variant="outline" onClick={onLibrary}>Explorar datos</Button></div>
  </div><div className="start-hero-art" aria-hidden="true">
   <svg viewBox="0 0 460 310" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="lapex-track-glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4ee3df"/><stop offset="100%" stopColor="#2385e2"/></linearGradient></defs>
    <circle cx="244" cy="151" r="124" fill="none" stroke="#ffffff" strokeOpacity=".08" strokeWidth="1"/>
    <circle cx="244" cy="151" r="81" fill="none" stroke="#ffffff" strokeOpacity=".07" strokeWidth="1"/>
    <path d="M75 222 C30 151 101 63 195 62 C300 58 364 36 395 109 C433 178 356 231 312 206 C269 179 246 252 180 251 C123 254 116 201 75 222Z" fill="none" stroke="#ffffff" strokeOpacity=".12" strokeWidth="37" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M75 222 C30 151 101 63 195 62 C300 58 364 36 395 109 C433 178 356 231 312 206 C269 179 246 252 180 251 C123 254 116 201 75 222Z" fill="none" stroke="url(#lapex-track-glow)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="75" cy="222" r="9" fill="#f0fdff" stroke="#087f88" strokeWidth="3"/><circle cx="312" cy="206" r="6" fill="#fff"/>
    <path d="M58 257L58 286M45 271H70" stroke="#7be2e4" strokeWidth="2" opacity=".6"/>
    <path d="M397 46L397 79M381 62H414" stroke="#7be2e4" strokeWidth="2" opacity=".6"/>
   </svg>
  </div></CardContent></Card>
  <div className="start-section-heading"><div><h2>Novedades de Lapex</h2><p>Noticias y funciones de demostración: contenido provisional de la plataforma.</p></div><span>Vista previa</span></div>
  <div className="start-news-grid">{updates.map((item,i)=><Card key={item.title} className="start-news-card"><CardHeader><div className="start-news-icon">{i===0?<Flag size={23}/>:i===1?<Radio size={23}/>:<Layers3 size={23}/>}</div><span className="start-news-tag">{item.tag} · {item.date}</span><CardTitle>{item.title}</CardTitle><CardDescription>{item.detail}</CardDescription></CardHeader></Card>)}</div>
  <Card className="start-guide"><CardContent><div><h3>¿Primera vez en Lapex?</h3><p>Conocé cómo importar datos y cómo explorar los registros de tu biblioteca.</p></div><Button variant="outline" onClick={onHelp}><BookOpen size={16}/>Consultar documentación</Button></CardContent></Card>
 </div>
}
