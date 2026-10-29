import{j as i}from"./jsx-runtime-u17CrQMm.js";import{r as v}from"./iframe-BDALlBlS.js";import{R as h,a as S}from"./ResourceAvatar-CNwRlLuC.js";import{i as e}from"./data-C2Mgv67X.js";import"./preload-helper-lTcTpUi0.js";import"./button-BuwWbYq0.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./utils-CHfrMcqn.js";import"./useButton-B6AszCPY.js";import"./useRenderElement-C0e9ABOW.js";import"./dialog-BSSYwv1k.js";import"./index-2uqsLyWL.js";import"./createLucideIcon-CXmeZXKk.js";import"./useTimeout-BBkfUSSu.js";import"./useOnMount-DGYP88jW.js";import"./useTransitionStatus-CF1Eu8hh.js";import"./index-BMGNCMto.js";import"./index-D4EPAv3Z.js";import"./reason-parts-zPHUywcg.js";import"./index-TpCWSljK.js";import"./visuallyHidden-BsIGJQ4u.js";import"./rotate-ccw-BYezXUGu.js";const H={title:"Recursos/Galería de imágenes",component:h,parameters:{layout:"padded"}},t={args:{kind:"pilots",resource:e.pilots[0],size:115}},a={args:{kind:"tracks",resource:e.tracks[0],size:115}},c={args:{kind:"vehicles",resource:e.vehicles[0],size:115}},n={args:{kind:"pilots",resource:{...e.pilots[0],avatar:"pilot-001"},size:115}},d={args:{kind:"tracks",resource:{...e.tracks[0],avatar:"circuit-011"},size:115}},p={args:{kind:"vehicles",resource:{...e.vehicles[0],avatar:"touring-017"},size:115}};function l({kind:m}){const u=m==="pilots"?e.pilots[0]:m==="tracks"?e.tracks[0]:e.vehicles[0],[k,g]=v.useState(u);return i.jsx("div",{style:{maxWidth:700},children:i.jsx(S,{kind:m,value:k,onChange:g})})}const r=()=>i.jsx(l,{kind:"pilots"}),s=()=>i.jsx(l,{kind:"tracks"}),o=()=>i.jsx(l,{kind:"vehicles"});r.__docgenInfo={description:"",methods:[],displayName:"SelectorPiloto"};s.__docgenInfo={description:"",methods:[],displayName:"SelectorCircuito"};o.__docgenInfo={description:"",methods:[],displayName:"SelectorVehiculo"};const J=["PilotoPredeterminado","CircuitoPredeterminado","VehiculoPredeterminado","PilotoPredisenado","CircuitoPredisenado","VehiculoPredisenado","SelectorPiloto","SelectorCircuito","SelectorVehiculo"];t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
