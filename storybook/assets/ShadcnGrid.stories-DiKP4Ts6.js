import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as y}from"./iframe-BKAAK0rd.js";import{B as g}from"./button-sAfNaNB7.js";import{S as k}from"./switch-DA3LAYsA.js";import{S as v}from"./ShadcnGrid-DAmH4SEd.js";import"./preload-helper-lTcTpUi0.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./utils-CHfrMcqn.js";import"./useButton-BDpbz4SD.js";import"./useRenderElement-Cx4B1UQo.js";import"./index-2uqsLyWL.js";import"./useAriaLabelledBy-BcdJuLE5.js";import"./useValueChanged-ZjIIXsv2.js";import"./input-group-BKBPc1x_.js";import"./createLucideIcon-B3qUlc6v.js";import"./textarea-d61lpd9-.js";import"./useOnMount-FoTfSrRs.js";import"./index-CcTUMvND.js";import"./index-COkCsmFg.js";import"./index-Bw2BfvIy.js";import"./checkbox-Bxsqqoyu.js";import"./loader-circle-D2ZDG52y.js";import"./layers-df8Te_-O.js";import"./alert-BEgBa3md.js";import"./badge-3DZXE7av.js";import"./skeleton-BGVTqtn9.js";const b=[{id:"d1",name:"Rodaje · Tanda 02",track:"Circuito Delta",category:"Turismo",status:"Cumplidos",available:!0},{id:"d2",name:"Rodaje · Referencia 01",track:"Circuito Delta",category:"Turismo",status:"Cumplidos",available:!0},{id:"d3",name:"Ensayo previo",track:"",category:"Karting",status:"Incumplidos",available:!1}],x=[{key:"name",title:"Nombre",value:e=>e.name,filter:!0},{key:"track",title:"Circuito",value:e=>e.track||"—",filter:!0},{key:"category",title:"Categoría",value:e=>e.category,filter:!0},{key:"status",title:"Requisitos",value:e=>e.status,status:e=>e.available?"success":"error"}];function S({multiple:e}){const[C,j]=y.useState([]);return a.jsx(v,{label:e?"Referencias disponibles":"Objetivos disponibles",rows:b,columns:x,selection:e?"multiple":"single",selected:e?C:C[0]??"",onSelect:(r,D)=>j(h=>D?e?[...new Set([...h,r])]:[r]:h.filter(f=>f!==r)),disabled:r=>!r.available,detail:r=>a.jsxs("div",{className:"dg-detail",children:[a.jsx("strong",{children:r.name}),a.jsx("span",{children:r.category})]})})}const $={title:"Tablas/ShadcnGrid",component:v,args:{label:"Registros de prueba",rows:b,columns:x},parameters:{layout:"fullscreen"},decorators:[e=>a.jsx("div",{className:"mx-auto w-full max-w-[1150px] p-5",children:a.jsx(e,{})})]},s={},o={args:{rows:[],emptyMessage:"No hay registros disponibles"}},t={args:{groups:["track","category"],advancedFilterColumns:[{key:"state",title:"Estado",value:e=>e.status}]}},i={render:()=>a.jsx(S,{multiple:!1})},n={render:()=>a.jsx(S,{multiple:!0})},c={args:{detail:e=>a.jsxs("div",{className:"dg-detail",children:[a.jsx("strong",{children:e.name}),a.jsxs("span",{children:["Categoría: ",e.category]})]}),actions:e=>a.jsx(g,{size:"xs",variant:"outline",onClick:()=>{navigator.clipboard?.writeText(e.name)},children:"Copiar nombre"})}},l={args:{selection:"single",disabled:e=>!e.available,selected:"d1"}},d={render:()=>a.jsx(v,{label:"Módulos y estados",rows:b,columns:x,leadingControl:e=>a.jsx(k,{"aria-label":"Activar "+e.name,disabled:!e.available,defaultChecked:e.id==="d1"}),detail:e=>a.jsxs("p",{children:[e.name," · Estado de ejemplo"]})})},m={args:{selection:"multiple",selected:["d1"],detail:e=>a.jsxs("p",{className:"p-2",children:["Detalle de ",e.name]}),groups:["track"]}},p={args:{compact:!0,searchable:!1,groups:[],actions:e=>a.jsxs(a.Fragment,{children:[a.jsx(g,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard?.writeText(e.name)},children:"Configurar"}),a.jsx(g,{size:"sm",variant:"outline",children:"Documentación"})]})}},u={args:{groups:["track"],detail:e=>a.jsxs("div",{className:"dg-detail",children:["Detalle de ",e.name]})}},ee=["Normal","Vacia","ConFiltroYAgrupacion","SeleccionUnica","SeleccionMultiple","ConDetalleYAcciones","Deshabilitada","ConSwitchDeActivacion","DetalleCompacto","CatalogoCompacto","GrupoDeAnchoCompleto"];s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:"{}",...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    rows: [],
    emptyMessage: "No hay registros disponibles"
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    groups: ["track", "category"],
    advancedFilterColumns: [{
      key: "state",
      title: "Estado",
      value: (r: DemoRecord) => r.status
    }]
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <SelectableGrid multiple={false} />
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <SelectableGrid multiple />
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    detail: (r: DemoRecord) => <div className="dg-detail"><strong>{r.name}</strong><span>Categoría: {r.category}</span></div>,
    actions: (r: DemoRecord) => <Button size="xs" variant="outline" onClick={() => {
      void navigator.clipboard?.writeText(r.name);
    }}>Copiar nombre</Button>
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    selection: "single",
    disabled: (r: DemoRecord) => !r.available,
    selected: "d1"
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <ShadcnGrid label="Módulos y estados" rows={records} columns={columns} leadingControl={r => <Switch aria-label={"Activar " + r.name} disabled={!r.available} defaultChecked={r.id === "d1"} />} detail={r => <p>{r.name} · Estado de ejemplo</p>} />
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    selection: "multiple",
    selected: ["d1"],
    detail: (r: DemoRecord) => <p className="p-2">Detalle de {r.name}</p>,
    groups: ["track"]
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true,
    searchable: false,
    groups: [],
    actions: (r: DemoRecord) => <>
  <Button size="sm" variant="outline" onClick={() => {
        void navigator.clipboard?.writeText(r.name);
      }}>Configurar</Button>
  <Button size="sm" variant="outline">Documentación</Button>
 </>
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    groups: ["track"],
    detail: (r: DemoRecord) => <div className="dg-detail">Detalle de {r.name}</div>
  }
}`,...u.parameters?.docs?.source}}};export{p as CatalogoCompacto,c as ConDetalleYAcciones,t as ConFiltroYAgrupacion,d as ConSwitchDeActivacion,l as Deshabilitada,m as DetalleCompacto,u as GrupoDeAnchoCompleto,s as Normal,n as SeleccionMultiple,i as SeleccionUnica,o as Vacia,ee as __namedExportsOrder,$ as default};
