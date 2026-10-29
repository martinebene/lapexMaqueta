import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as P}from"./iframe-D84k1xpJ.js";import{R as z,a as f}from"./ResourceAvatar-ZO-ieVAS.js";import{i as e}from"./data-DrNHrcuR.js";import"./preload-helper-lTcTpUi0.js";import"./button-C_H9oO0z.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./utils-CHfrMcqn.js";import"./useButton-Do-xdfOw.js";import"./useRenderElement-D4PR6hji.js";import"./dialog-CnEV9LJ0.js";import"./index-2uqsLyWL.js";import"./createLucideIcon-DAFrjLjk.js";import"./useTimeout-BGjjppu_.js";import"./useOnMount--TLk9fva.js";import"./useTransitionStatus-B0Z5bWkD.js";import"./index-CLSF7GC0.js";import"./index-tMgi7jf-.js";import"./reason-parts-C4i7TWbI.js";import"./index-DknLqzjD.js";import"./visuallyHidden-BsIGJQ4u.js";import"./rotate-ccw-B4g7viQk.js";const L={title:"Recursos/Galería de imágenes",component:z,parameters:{layout:"padded"}},i={args:{kind:"pilots",resource:e.pilots[0],size:115}},t={args:{kind:"tracks",resource:e.tracks[0],size:115}},c={args:{kind:"vehicles",resource:e.vehicles[0],size:115}},n={args:{kind:"pilots",resource:{...e.pilots[0],avatar:"pilot-default"},size:115}},d={args:{kind:"tracks",resource:{...e.tracks[0],avatar:"circuit-default"},size:115}},l={args:{kind:"vehicles",resource:{...e.vehicles[0],avatar:"vehicle-default"},size:115}},u={args:{kind:"pilots",resource:{...e.pilots[0],avatar:"pilot-001"},size:115}},p={args:{kind:"tracks",resource:{...e.tracks[0],avatar:"circuit-011"},size:115}},m={args:{kind:"vehicles",resource:{...e.vehicles[0],avatar:"touring-017"},size:115}};function g({kind:k}){const v=k==="pilots"?e.pilots[0]:k==="tracks"?e.tracks[0]:e.vehicles[0],[h,S]=P.useState(v);return a.jsx("div",{style:{maxWidth:700},children:a.jsx(f,{kind:k,value:h,onChange:S})})}const r=()=>a.jsx(g,{kind:"pilots"}),s=()=>a.jsx(g,{kind:"tracks"}),o=()=>a.jsx(g,{kind:"vehicles"});r.__docgenInfo={description:"",methods:[],displayName:"SelectorPiloto"};s.__docgenInfo={description:"",methods:[],displayName:"SelectorCircuito"};o.__docgenInfo={description:"",methods:[],displayName:"SelectorVehiculo"};const M=["PilotoPredeterminado","CircuitoPredeterminado","VehiculoPredeterminado","PilotoAnterior","CircuitoAnterior","VehiculoAnterior","PilotoPredisenado","CircuitoPredisenado","VehiculoPredisenado","SelectorPiloto","SelectorCircuito","SelectorVehiculo"];i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "pilots",
    resource: initialResources.pilots[0],
    size: 115
  }
}`,...i.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "tracks",
    resource: initialResources.tracks[0],
    size: 115
  }
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "vehicles",
    resource: initialResources.vehicles[0],
    size: 115
  }
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "pilots",
    resource: {
      ...initialResources.pilots[0],
      avatar: "pilot-default"
    },
    size: 115
  }
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "tracks",
    resource: {
      ...initialResources.tracks[0],
      avatar: "circuit-default"
    },
    size: 115
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "vehicles",
    resource: {
      ...initialResources.vehicles[0],
      avatar: "vehicle-default"
    },
    size: 115
  }
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "pilots",
    resource: {
      ...initialResources.pilots[0],
      avatar: "pilot-001"
    },
    size: 115
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "tracks",
    resource: {
      ...initialResources.tracks[0],
      avatar: "circuit-011"
    },
    size: 115
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "vehicles",
    resource: {
      ...initialResources.vehicles[0],
      avatar: "touring-017"
    },
    size: 115
  }
}`,...m.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:'() => <InteractiveSelector kind="pilots" />',...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:'() => <InteractiveSelector kind="tracks" />',...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:'() => <InteractiveSelector kind="vehicles" />',...o.parameters?.docs?.source}}};export{d as CircuitoAnterior,t as CircuitoPredeterminado,p as CircuitoPredisenado,n as PilotoAnterior,i as PilotoPredeterminado,u as PilotoPredisenado,s as SelectorCircuito,r as SelectorPiloto,o as SelectorVehiculo,l as VehiculoAnterior,c as VehiculoPredeterminado,m as VehiculoPredisenado,M as __namedExportsOrder,L as default};
