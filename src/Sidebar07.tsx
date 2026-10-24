
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Activity, Layers3, Database, Settings2, Plus, FolderOpen, UserRound, ChevronRight, ChevronsUpDown, BarChart3, CreditCard, RefreshCw, LogOut, CircleHelp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarRail, useSidebar } from "@/components/ui/sidebar"
import logo from "../assets/lapex-logo.svg"
import profilePhoto from "../assets/profile-mebene.jpg"

export type NavSection="analysis"|"resources"|"data"|"config"
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
  onConfig:(key:"settings"|"account"|"help")=>void
  onProfile:(key:ActionKey)=>void
}
export function AppSidebar07({mode,plan,onNewSession,onOpenSessions,onResource,onData,onConfig,onProfile}:Props){
  const {t}=useTranslation()
  const [openGroups,setOpenGroups]=useState<Record<NavSection,boolean>>({analysis:true,resources:false,data:false,config:false})
  const {state,setOpenMobile,isMobile}=useSidebar()
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
      {key:"account",label:t("nav.account"),action:()=>onConfig("account")},
      {key:"help",label:t("nav.help"),action:()=>onConfig("help")}
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
        <SidebarGroupLabel>{t("app.title")}</SidebarGroupLabel>
        <SidebarMenu>
          {entries.map(entry=><SidebarMenuItem key={entry.id}>
            <Collapsible open={openGroups[entry.id]} onOpenChange={opened=>setOpenGroups(prev=>({...prev,[entry.id]:opened}))}>
              <CollapsibleTrigger render={<SidebarMenuButton tooltip={entry.title} isActive={mode===entry.id} className="sidebar07-main-item"/>}>
                <entry.icon size={18}/><span>{entry.title}</span>
                <ChevronRight className={"sidebar07-chevron"+(openGroups[entry.id]?" rotated":"")} size={15}/>
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
      {state==="expanded"&&<div className="sidebar07-hint"><CircleHelp size={14}/><span>{t("app.demo")}</span></div>}
    </SidebarContent>
    <SidebarFooter className="sidebar07-footer">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="sidebar07-user" tooltip={t("nav.profile")}/>}>
              <Avatar className="sidebar07-avatar">
                <AvatarImage src={profilePhoto} alt="Foto de perfil"/>
                <AvatarFallback><UserRound size={17}/></AvatarFallback>
              </Avatar>
              <span className="sidebar07-user-info"><strong>Martín Ebene</strong><small>{t("profile.plan",{plan})}</small></span>
              <ChevronsUpDown className="sidebar07-user-arrow" size={16}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={isMobile?"bottom":"right"} align="end" className="sidebar07-user-dropdown">
              <DropdownMenuLabel className="sidebar07-dropdown-user">
                <Avatar className="sidebar07-avatar"><AvatarImage src={profilePhoto} alt="Foto de perfil"/><AvatarFallback>ME</AvatarFallback></Avatar>
                <span><strong>Martín Ebene</strong><small>{t("profile.plan",{plan})}</small></span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
              {([{id:"usage" as const,text:t("profile.usage"),icon:BarChart3},{id:"membership" as const,text:t("profile.membership"),icon:CreditCard},{id:"switch" as const,text:t("profile.switch"),icon:RefreshCw},{id:"signout" as const,text:t("profile.signout"),icon:LogOut}]).map(x=>
                <DropdownMenuItem key={x.id} onClick={()=>onProfile(x.id)}><x.icon size={16}/>{x.text}</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail/>
  </Sidebar>
}
