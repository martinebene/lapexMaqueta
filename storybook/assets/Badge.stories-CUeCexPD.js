import{c}from"./index-B8k91cqS.js";import{c as u}from"./index-2uqsLyWL.js";import{u as g,m as l}from"./useRenderElement-BaQEy_In.js";import"./clsx-B-dksMZM.js";import"./iframe-BfbbqQIR.js";import"./preload-helper-lTcTpUi0.js";function p(r){return g(r.defaultTagName??"div",r,r)}const m=c("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",{variants:{variant:{default:"bg-primary text-primary-foreground [a]:hover:bg-primary/80",secondary:"bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",destructive:"bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",outline:"border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",ghost:"hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",link:"text-primary underline-offset-4 hover:underline"}},defaultVariants:{variant:"default"}});function v({className:r,variant:s="default",render:i,...d}){return p({defaultTagName:"span",props:l({className:u(m({variant:s}),r)},d),render:i,state:{slot:"badge",variant:s}})}const k={title:"Indicadores/Badge",component:v,args:{children:"Disponible"},parameters:{layout:"centered"}},e={args:{variant:"default"}},a={args:{variant:"secondary"}},t={args:{variant:"outline"}},o={args:{variant:"destructive",children:"Incumplidos"}},n={args:{variant:"secondary",children:"Favorito"}},w=["Principal","Secundario","Contorno","Error","Favorito"];e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "default"
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary"
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline"
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "destructive",
    children: "Incumplidos"
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    children: "Favorito"
  }
}`,...n.parameters?.docs?.source}}};export{t as Contorno,o as Error,n as Favorito,e as Principal,a as Secundario,w as __namedExportsOrder,k as default};
