import{j as r}from"./jsx-runtime-u17CrQMm.js";import{I as c}from"./input-UL1FZVjT.js";import{I as d,a as p,b as l,S as u}from"./input-group-DEbMTZt5.js";import{T as m}from"./textarea-D9ENbvoJ.js";import"./utils-CHfrMcqn.js";import"./clsx-B-dksMZM.js";import"./iframe-B3tjX8WQ.js";import"./preload-helper-lTcTpUi0.js";import"./useButton-DfNQ8K6U.js";import"./useRenderElement-C8ZC5YFE.js";import"./useTimeout-BxdPSkaY.js";import"./useOnMount-efCVZLVE.js";import"./useValueChanged-BZJ1rqbv.js";import"./reason-parts-CqWrZPSZ.js";import"./createLucideIcon-Cd2_lSuV.js";import"./index-B8k91cqS.js";import"./index-2uqsLyWL.js";import"./button-BOLtlgvK.js";const T={title:"Controles/Entrada de texto",component:c,args:{"aria-label":"Nombre de la sesión",placeholder:"Nombre de la sesión"},decorators:[n=>r.jsx("div",{className:"w-[330px] max-w-full",children:r.jsx(n,{})})]},a={},e={args:{defaultValue:"Ensayo de clasificación"}},o={args:{disabled:!0,defaultValue:"No editable"}},s={args:{"aria-invalid":!0,defaultValue:"Valor inválido"}},t={render:()=>r.jsxs(d,{children:[r.jsx(p,{"aria-label":"Buscar registros",placeholder:"Buscar"}),r.jsx(l,{align:"inline-start",children:r.jsx(u,{"aria-hidden":"true"})})]})},i={render:()=>r.jsx(m,{"aria-label":"Observaciones",placeholder:"Notas sobre la sesión",rows:3})},y=["Vacio","ConContenido","Deshabilitado","Error","Buscador","Observaciones"];a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "Ensayo de clasificación"
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "No editable"
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-invalid": true,
    defaultValue: "Valor inválido"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <InputGroup><InputGroupInput aria-label="Buscar registros" placeholder="Buscar" /><InputGroupAddon align="inline-start"><Search aria-hidden="true" /></InputGroupAddon></InputGroup>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Textarea aria-label="Observaciones" placeholder="Notas sobre la sesión" rows={3} />
}`,...i.parameters?.docs?.source}}};export{t as Buscador,e as ConContenido,o as Deshabilitado,s as Error,i as Observaciones,a as Vacio,y as __namedExportsOrder,T as default};
