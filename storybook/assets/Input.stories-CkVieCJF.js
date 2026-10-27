import{j as r}from"./jsx-runtime-u17CrQMm.js";import{I as c,T as d}from"./textarea-d61lpd9-.js";import{I as l,a as p,b as u,S as m}from"./input-group-BKBPc1x_.js";import"./utils-CHfrMcqn.js";import"./clsx-B-dksMZM.js";import"./iframe-BKAAK0rd.js";import"./preload-helper-lTcTpUi0.js";import"./useButton-BDpbz4SD.js";import"./useRenderElement-Cx4B1UQo.js";import"./useOnMount-FoTfSrRs.js";import"./useValueChanged-ZjIIXsv2.js";import"./index-2uqsLyWL.js";import"./createLucideIcon-B3qUlc6v.js";import"./index-B8k91cqS.js";import"./button-sAfNaNB7.js";const O={title:"Controles/Entrada de texto",component:c,args:{"aria-label":"Nombre de la sesión",placeholder:"Nombre de la sesión"},decorators:[i=>r.jsx("div",{className:"w-[330px] max-w-full",children:r.jsx(i,{})})]},a={},e={args:{defaultValue:"Ensayo de clasificación"}},s={args:{disabled:!0,defaultValue:"No editable"}},o={args:{"aria-invalid":!0,defaultValue:"Valor inválido"}},t={render:()=>r.jsxs(l,{children:[r.jsx(p,{"aria-label":"Buscar registros",placeholder:"Buscar"}),r.jsx(u,{align:"inline-start",children:r.jsx(m,{"aria-hidden":"true"})})]})},n={render:()=>r.jsx(d,{"aria-label":"Observaciones",placeholder:"Notas sobre la sesión",rows:3})},w=["Vacio","ConContenido","Deshabilitado","Error","Buscador","Observaciones"];a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};export{t as Buscador,e as ConContenido,s as Deshabilitado,o as Error,n as Observaciones,a as Vacio,w as __namedExportsOrder,O as default};
