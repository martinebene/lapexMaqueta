import{j as r}from"./jsx-runtime-u17CrQMm.js";import{I as c}from"./input-CyjiYSOa.js";import{I as d,a as l,b as p,S as u}from"./input-group-C2f_fbRU.js";import{T as m}from"./textarea-D9ENbvoJ.js";import"./utils-CHfrMcqn.js";import"./clsx-B-dksMZM.js";import"./iframe-ClsRSjBU.js";import"./preload-helper-lTcTpUi0.js";import"./useButton-CTefd20m.js";import"./useRenderElement-BM_TxRBu.js";import"./useOnMount-_CTVp3PH.js";import"./reason-parts-C69ALuVo.js";import"./createLucideIcon-DayPOW0i.js";import"./index-B8k91cqS.js";import"./index-2uqsLyWL.js";import"./button-CbrD4bDu.js";const w={title:"Controles/Entrada de texto",component:c,args:{"aria-label":"Nombre de la sesión",placeholder:"Nombre de la sesión"},decorators:[i=>r.jsx("div",{className:"w-[330px] max-w-full",children:r.jsx(i,{})})]},a={},e={args:{defaultValue:"Ensayo de clasificación"}},s={args:{disabled:!0,defaultValue:"No editable"}},o={args:{"aria-invalid":!0,defaultValue:"Valor inválido"}},t={render:()=>r.jsxs(d,{children:[r.jsx(l,{"aria-label":"Buscar registros",placeholder:"Buscar"}),r.jsx(p,{align:"inline-start",children:r.jsx(u,{"aria-hidden":"true"})})]})},n={render:()=>r.jsx(m,{"aria-label":"Observaciones",placeholder:"Notas sobre la sesión",rows:3})},A=["Vacio","ConContenido","Deshabilitado","Error","Buscador","Observaciones"];a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "Ensayo de clasificación"
  }
}`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "No editable"
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "Valor inválido"
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <InputGroup><InputGroupInput aria-label="Buscar registros" placeholder="Buscar" /><InputGroupAddon align="inline-start"><Search aria-hidden="true" /></InputGroupAddon></InputGroup>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-label="Observaciones" placeholder="Notas sobre la sesión" rows={3} />
}`,...n.parameters?.docs?.source}}};export{t as Buscador,e as ConContenido,s as Deshabilitado,o as Error,n as Observaciones,a as Vacio,A as __namedExportsOrder,w as default};
