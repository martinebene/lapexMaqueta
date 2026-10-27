
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Activity, Layers3, Database, Settings2, UserRound, ChevronRight, ChevronsUpDown, BarChart3, CreditCard, RefreshCw, LogOut, CircleHelp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import logo from "../assets/lapex-logo.png"
import profilePhoto from "../assets/profile-mebene.jpg"

export type NavSection="analysis"|"resources"|"data"|"config"|"help"
type ActionKey="usage"|"membership"|"switch"|"signout"
type NavTarget={key:string;label:string;action:()=>void}
type NavEntry={id:NavSection;title:string;icon:LucideIcon;items:NavTarget[]}
interface Props {
  mode:NavSection
  plan:"Free"|"Pro"
  onNewSession:()=>void
  onOpenSessions:()=>void
  onResource:(key:"pilots"|"tracks"|"vehicles"|"modules")=>void
  onData:(key:"datasets"|"import")=>void
  onConfig:(key:"settings"|"account")=>void
  onHelp:(key:"documentation"|"faq"|"version")=>void
  buildTime:string
  onProfile:(key:ActionKey)=>void
}
export function AppSidebar07({mode,plan,onNewSession,onOpenSessions,onResource,onData,onConfig,onHelp,buildTime,onProfile}:Props){
  const {t}=useTranslation()
  const [openGroup,setOpenGroup]=useState<NavSection|null>("analysis")
  const [profileOpen,setProfileOpen]=useState(false)
  const profileAreaRef=useRef<HTMLLIElement>(null)
  const {setOpenMobile,isMobile}=useSidebar()
  useEffect(()=>{
    if(!profileOpen)return
    const closeOutside=(event:PointerEvent)=>{
      if(!profileAreaRef.current?.contains(event.target as Node))setProfileOpen(false)
    }
    const closeEscape=(event:KeyboardEvent)=>{if(event.key==="Escape")setProfileOpen(false)}
    document.addEventListener("pointerdown",closeOutside)
    document.addEventListener("keydown",closeEscape)
    return ()=>{document.removeEventListener("pointerdown",closeOutside);document.removeEventListener("keydown",closeEscape)}
  },[profileOpen])
  const entries:NavEntry[]=[
    {id:"analysis",title:t("nav.analysis"),icon:Activity,items:[
      {key:"new",label:t("nav.new"),action:onNewSession},
      {key:"open",label:t("nav.open"),action:onOpenSessions}
    ]},
    {id:"resources",title:t("nav.resources"),icon:Layers3,items:[
      {key:"pilots",label:t("nav.pilots"),action:()=>onResource("pilots")},
      {key:"tracks",label:t("nav.tracks"),action:()=>onResource("tracks")},
      {key:"vehicles",label:t("nav.vehicles"),action:()=>onResource("vehicles")},
      {key:"modules",label:t("nav.modules"),action:()=>onResource("modules")}
    ]},
    {id:"data",title:t("nav.data"),icon:Database,items:[
      {key:"datasets",label:t("nav.library"),action:()=>onData("datasets")},
      {key:"import",label:t("nav.import"),action:()=>onData("import")}
    ]},
    {id:"config",title:t("nav.config"),icon:Settings2,items:[
      {key:"settings",label:t("nav.preferences"),action:()=>onConfig("settings")},
      {key:"account",label:t("nav.account"),action:()=>onConfig("account")}
    ]},
    {id:"help",title:t("nav.help"),icon:CircleHelp,items:[
      {key:"documentation",label:"Documentación",action:()=>onHelp("documentation")},
      {key:"faq",label:"FAQ",action:()=>onHelp("faq")},
      {key:"version",label:"Versión",action:()=>onHelp("version")}
    ]}
  ]
  const closeOnMobile=()=>{if(isMobile)setOpenMobile(false)}
  return <Sidebar collapsible="icon" className="lapex-sidebar07" aria-label="Navegación de Lapex">
    <SidebarHeader className="lapex-sidebar07-head">
      <div className="sidebar07-logo-wrap">
        <img src={logo} alt="Lapex.ai · AI-Powered Motorsport Analysis" className="sidebar07-logo"/>
        <span className="sidebar07-icon" aria-hidden="true"><Activity size={23}/></span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
          <SidebarMenu>
          {entries.map(entry=><SidebarMenuItem key={entry.id}>
            <Collapsible open={openGroup===entry.id} onOpenChange={opened=>setOpenGroup(opened?entry.id:null)}>
              <CollapsibleTrigger render={<SidebarMenuButton tooltip={entry.title} isActive={mode===entry.id} className="sidebar07-main-item"/>}>
                <entry.icon size={18}/><span>{entry.title}</span>
                <ChevronRight className={"sidebar07-chevron"+(openGroup===entry.id?" rotated":"")} size={15}/>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {entry.items.map(sub=><SidebarMenuSubItem key={sub.key}>
                    <SidebarMenuSubButton render={<button type="button" onClick={()=>{sub.action();closeOnMobile()}}/>}>
                      <span>{sub.label}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>)}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="sidebar07-footer">
      <div className="sidebar07-build-time" title="Fecha y hora de la compilación publicada">{buildTime}</div>
      <SidebarMenu>
        <SidebarMenuItem ref={profileAreaRef} className="sidebar07-user-anchor">
          <SidebarMenuButton size="lg" className="sidebar07-user" onClick={()=>setProfileOpen(p=>!p)} aria-haspopup="menu" aria-expanded={profileOpen} aria-controls="lapex-profile-menu" aria-label={t("nav.profile")}>
            <Avatar className="sidebar07-avatar">
              <AvatarImage src={profilePhoto} alt="Foto de perfil"/>
              <AvatarFallback><UserRound size={17}/></AvatarFallback>
            </Avatar>
            <span className="sidebar07-user-info"><strong>Martín Ebene</strong><small>{t("profile.plan",{plan})}</small></span>
            <ChevronsUpDown className="sidebar07-user-arrow" size={16}/>
          </SidebarMenuButton>
          {profileOpen&&<div id="lapex-profile-menu" className="sidebar07-user-dropdown sidebar07-profile-panel" role="menu" aria-label={t("nav.profile")}>
            <div className="sidebar07-dropdown-user">
              <Avatar className="sidebar07-avatar"><AvatarImage src={profilePhoto} alt="Foto de perfil"/><AvatarFallback>ME</AvatarFallback></Avatar>
              <span><strong>Martín Ebene</strong><small>{t("profile.plan",{plan})}</small></span>
            </div>
            <div className="sidebar07-profile-separator"/>
            {([{id:"usage" as const,text:t("profile.usage"),icon:BarChart3},{id:"membership" as const,text:t("profile.membership"),icon:CreditCard},{id:"switch" as const,text:t("profile.switch"),icon:RefreshCw},{id:"signout" as const,text:t("profile.signout"),icon:LogOut}]).map(x=>
              <button type="button" role="menuitem" className="sidebar07-profile-option" key={x.id} onClick={()=>{setProfileOpen(false);onProfile(x.id)}}><x.icon size={16}/>{x.text}</button>
            )}
          </div>}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail/>
  </Sidebar>
}
