import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as f}from"./iframe-BHOX8t48.js";import{B as b}from"./button-DNVuc5Ax.js";import{S as w}from"./switch-Z1LhmzS7.js";import{S as x}from"./ShadcnGrid-BlbXIpJg.js";import"./preload-helper-lTcTpUi0.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./utils-CHfrMcqn.js";import"./useButton-v5ZRMChi.js";import"./useRenderElement-3tA6WA7z.js";import"./index-2uqsLyWL.js";import"./useControlled-cR5474I5.js";import"./reason-parts-DC-2fEig.js";import"./visuallyHidden-BsIGJQ4u.js";import"./useValueChanged-CEEvMyHl.js";import"./input-group-DTJGhMV2.js";import"./createLucideIcon-sCZGzHSW.js";import"./input-ajldlvgN.js";import"./useTimeout-B7bpdX_Y.js";import"./useOnMount-HSMB7WWF.js";import"./textarea-D9ENbvoJ.js";import"./dialog-Cg6VWPdf.js";import"./useTransitionStatus-C7oBi9mX.js";import"./index-D2g6UvIu.js";import"./index-BbN5p45q.js";import"./index-CEeu0rZ1.js";import"./loader-circle-BDlgOPPP.js";import"./checkbox-Db6qt1gy.js";import"./rotate-ccw-B8mFMgzc.js";import"./native-select-B7P6gcOB.js";import"./layers-CYCmc-Xf.js";import"./alert-BEgBa3md.js";import"./badge-CRkgW4DU.js";import"./skeleton-BGVTqtn9.js";import"./sliders-horizontal-09SwABWZ.js";const C=[{id:"d1",name:"Rodaje · Tanda 02",track:"Circuito Delta",category:"Turismo",status:"Cumplidos",date:"2026-10-19",available:!0},{id:"d2",name:"Rodaje · Referencia 01",track:"Circuito Delta",category:"Turismo",status:"Cumplidos",available:!0},{id:"d3",name:"Ensayo previo",track:"",category:"Karting",status:"Incumplidos",date:"2026-10-18",available:!1}],v=[{key:"name",title:"Nombre",value:e=>e.name,filter:!0},{key:"track",title:"Circuito",value:e=>e.track||"—",filter:!0},{key:"category",title:"Categoría",value:e=>e.category,filter:!0},{key:"status",title:"Requisitos",value:e=>e.status,status:e=>e.available?"success":"error"}];function k({multiple:e}){const[h,y]=f.useState([]);return a.jsx(x,{label:e?"Referencias disponibles":"Objetivos disponibles",rows:C,columns:v,selection:e?"multiple":"single",selected:e?h:h[0]??"",onSelect:(r,j)=>y(S=>j?e?[...new Set([...S,r])]:[r]:S.filter(D=>D!==r)),disabled:r=>!r.available,detail:r=>a.jsxs("div",{className:"dg-detail",children:[a.jsx("strong",{children:r.name}),a.jsx("span",{children:r.category})]})})}const le={title:"Tablas/ShadcnGrid",component:x,args:{label:"Registros de prueba",rows:C,columns:v},parameters:{layout:"fullscreen"},decorators:[e=>a.jsx("div",{className:"mx-auto w-full max-w-[1150px] p-5",children:a.jsx(e,{})})]},t={},o={args:{rows:[],emptyMessage:"No hay registros disponibles"}},s={args:{groups:["track","category"],advancedFilterColumns:[{key:"state",title:"Estado",value:e=>e.status}]}},i={render:()=>a.jsx(k,{multiple:!1})},n={render:()=>a.jsx(k,{multiple:!0})},c={args:{detail:e=>a.jsxs("div",{className:"dg-detail",children:[a.jsx("strong",{children:e.name}),a.jsxs("span",{children:["Categoría: ",e.category]})]}),actions:e=>a.jsx(b,{size:"xs",variant:"outline",onClick:()=>{navigator.clipboard?.writeText(e.name)},children:"Copiar nombre"})}},l={args:{selection:"single",disabled:e=>!e.available,selected:"d1"}},d={args:{columns:[...v,{key:"date",title:"Fecha",value:e=>e.date??"—",filter:!0}],advancedFilterKeys:["track","date"],groups:["track"],initialSort:{key:"name"}}},m={render:()=>a.jsx(x,{label:"Módulos y estados",rows:C,columns:v,leadingControl:e=>a.jsx(w,{"aria-label":"Activar "+e.name,disabled:!e.available,defaultChecked:e.id==="d1"}),detail:e=>a.jsxs("p",{children:[e.name," · Estado de ejemplo"]})})},p={args:{selection:"multiple",selected:["d1"],detail:e=>a.jsxs("p",{className:"p-2",children:["Detalle de ",e.name]}),groups:["track"]}},u={args:{compact:!0,searchable:!1,groups:[],actions:e=>a.jsxs(a.Fragment,{children:[a.jsx(b,{size:"sm",variant:"outline",onClick:()=>{navigator.clipboard?.writeText(e.name)},children:"Configurar"}),a.jsx(b,{size:"sm",variant:"outline",children:"Documentación"})]})}},g={args:{groups:["track"],detail:e=>a.jsxs("div",{className:"dg-detail",children:["Detalle de ",e.name]})}},de=["Normal","Vacia","ConFiltroYAgrupacion","SeleccionUnica","SeleccionMultiple","ConDetalleYAcciones","Deshabilitada","FechaExactaYFiltrosAvanzados","ConSwitchDeActivacion","DetalleCompacto","CatalogoCompacto","GrupoDeAnchoCompleto"];t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    rows: [],
    emptyMessage: "No hay registros disponibles"
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    groups: ["track", "category"],
    advancedFilterColumns: [{
      key: "state",
      title: "Estado",
      value: (r: DemoRecord) => r.status
    }]
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
  args: {
    columns: [...columns, {
      key: "date",
      title: "Fecha",
      value: (r: DemoRecord) => r.date ?? "—",
      filter: true
    }],
    advancedFilterKeys: ["track", "date"],
    groups: ["track"],
    initialSort: {
      key: "name"
    }
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <ShadcnGrid label="Módulos y estados" rows={records} columns={columns} leadingControl={r => <Switch aria-label={"Activar " + r.name} disabled={!r.available} defaultChecked={r.id === "d1"} />} detail={r => <p>{r.name} · Estado de ejemplo</p>} />
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    selection: "multiple",
    selected: ["d1"],
    detail: (r: DemoRecord) => <p className="p-2">Detalle de {r.name}</p>,
    groups: ["track"]
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    groups: ["track"],
    detail: (r: DemoRecord) => <div className="dg-detail">Detalle de {r.name}</div>
  }
}`,...g.parameters?.docs?.source}}};export{u as CatalogoCompacto,c as ConDetalleYAcciones,s as ConFiltroYAgrupacion,m as ConSwitchDeActivacion,l as Deshabilitada,p as DetalleCompacto,d as FechaExactaYFiltrosAvanzados,g as GrupoDeAnchoCompleto,t as Normal,n as SeleccionMultiple,i as SeleccionUnica,o as Vacia,de as __namedExportsOrder,le as default};
