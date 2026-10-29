import{j as i}from"./jsx-runtime-u17CrQMm.js";import{r as v}from"./iframe-BHOX8t48.js";import{R as h,a as S}from"./ResourceAvatar-TQcFT_rb.js";import{i as e}from"./data-DrNHrcuR.js";import"./preload-helper-lTcTpUi0.js";import"./button-DNVuc5Ax.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./utils-CHfrMcqn.js";import"./useButton-v5ZRMChi.js";import"./useRenderElement-3tA6WA7z.js";import"./dialog-Cg6VWPdf.js";import"./index-2uqsLyWL.js";import"./createLucideIcon-sCZGzHSW.js";import"./useTimeout-B7bpdX_Y.js";import"./useOnMount-HSMB7WWF.js";import"./useTransitionStatus-C7oBi9mX.js";import"./index-D2g6UvIu.js";import"./index-BbN5p45q.js";import"./reason-parts-DC-2fEig.js";import"./index-CEeu0rZ1.js";import"./visuallyHidden-BsIGJQ4u.js";import"./rotate-ccw-B8mFMgzc.js";const H={title:"Recursos/Galería de imágenes",component:h,parameters:{layout:"padded"}},t={args:{kind:"pilots",resource:e.pilots[0],size:115}},a={args:{kind:"tracks",resource:e.tracks[0],size:115}},c={args:{kind:"vehicles",resource:e.vehicles[0],size:115}},n={args:{kind:"pilots",resource:{...e.pilots[0],avatar:"pilot-001"},size:115}},d={args:{kind:"tracks",resource:{...e.tracks[0],avatar:"circuit-011"},size:115}},p={args:{kind:"vehicles",resource:{...e.vehicles[0],avatar:"touring-017"},size:115}};function l({kind:m}){const u=m==="pilots"?e.pilots[0]:m==="tracks"?e.tracks[0]:e.vehicles[0],[k,g]=v.useState(u);return i.jsx("div",{style:{maxWidth:700},children:i.jsx(S,{kind:m,value:k,onChange:g})})}const r=()=>i.jsx(l,{kind:"pilots"}),s=()=>i.jsx(l,{kind:"tracks"}),o=()=>i.jsx(l,{kind:"vehicles"});r.__docgenInfo={description:"",methods:[],displayName:"SelectorPiloto"};s.__docgenInfo={description:"",methods:[],displayName:"SelectorCircuito"};o.__docgenInfo={description:"",methods:[],displayName:"SelectorVehiculo"};const J=["PilotoPredeterminado","CircuitoPredeterminado","VehiculoPredeterminado","PilotoPredisenado","CircuitoPredisenado","VehiculoPredisenado","SelectorPiloto","SelectorCircuito","SelectorVehiculo"];t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "pilots",
    resource: initialResources.pilots[0],
    size: 115
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "tracks",
    resource: initialResources.tracks[0],
    size: 115
  }
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
      avatar: "pilot-001"
    },
    size: 115
  }
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "tracks",
    resource: {
      ...initialResources.tracks[0],
      avatar: "circuit-011"
    },
    size: 115
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    kind: "vehicles",
    resource: {
      ...initialResources.vehicles[0],
      avatar: "touring-017"
    },
    size: 115
  }
}`,...p.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:'() => <InteractiveSelector kind="pilots" />',...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:'() => <InteractiveSelector kind="tracks" />',...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:'() => <InteractiveSelector kind="vehicles" />',...o.parameters?.docs?.source}}};export{a as CircuitoPredeterminado,d as CircuitoPredisenado,t as PilotoPredeterminado,n as PilotoPredisenado,s as SelectorCircuito,r as SelectorPiloto,o as SelectorVehiculo,c as VehiculoPredeterminado,p as VehiculoPredisenado,J as __namedExportsOrder,H as default};
